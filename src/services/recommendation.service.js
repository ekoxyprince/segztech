const { Op } = require('sequelize');
const {
  UserSession,
  UserActivity,
  Product,
  ProductImage,
  Order,
  OrderItem,
  sequelize
} = require('../database/models');

class RecommendationEngine {
  constructor() {
    this.cacheExpiry = 60 * 60 * 1000;
    this.weights = {
      viewWeight: 1,
      cartWeight: 3,
      purchaseWeight: 5,
      searchWeight: 2,
      similarUserWeight: 4,
      trendingWeight: 3,
      regionWeight: 2
    };
  }

  async getComplementaryProducts(productId, category, limit = 5) {
    const complementaryMap = {
      laptops: ['mouse', 'laptop bag', 'charger', 'headphones', 'keyboard', 'monitor', 'webcam', 'cooling pad'],
      phones: ['phone case', 'screen protector', 'charger', 'earbuds', 'power bank', 'car mount'],
      tablets: ['stylus', 'keyboard', 'case', 'charger', 'earbuds'],
      accessories: ['cable', 'adapter', 'charger', 'case'],
      gaming: ['controller', 'headset', 'mouse', 'keyboard', 'monitor']
    };

    const searchTerms = complementaryMap[category?.toLowerCase()] || ['accessories', 'complementary'];
    const searchQuery = searchTerms.join(' OR ');

    try {
      const products = await Product.findAll({
        where: {
          id: { [Op.ne]: productId },
          is_active: true,
          [Op.or]: searchTerms.map(term => ({
            name: { [Op.like]: `%${term}%` }
          }))
        },
        include: [
          { model: ProductImage, as: 'images' }
        ],
        limit
      });

      return products.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        image: p.images?.[0]?.image_url || '/images/placeholder.jpg',
        reason: 'Frequently bought together',
        confidence: 0.75
      }));
    } catch (error) {
      console.error('Complementary products error:', error);
      return [];
    }
  }

  async getFrequentlyBoughtTogether(productId, limit = 5) {
    try {
      const orders = await OrderItem.findAll({
        where: { product_id: productId },
        attributes: ['order_id']
      });

      const orderIds = orders.map(o => o.order_id);

      if (orderIds.length === 0) {
        return this.getComplementaryProducts(productId, null, limit);
      }

      const coPurchased = await OrderItem.findAll({
        where: {
          order_id: { [Op.in]: orderIds },
          product_id: { [Op.ne]: productId }
        },
        attributes: [
          'product_id',
          [sequelize.fn('COUNT', sequelize.col('product_id')), 'count']
        ],
        include: [{
          model: Product,
          as: 'order',
          attributes: ['name', 'price']
        }],
        group: ['product_id'],
        order: [[sequelize.literal('count'), 'DESC']],
        limit
      });

      const productIds = coPurchased.map(cp => cp.product_id);
      const products = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
        include: [{ model: ProductImage, as: 'images' }]
      });

      const productMap = {};
      products.forEach(p => productMap[p.id] = p);

      return coPurchased.map(cp => {
        const product = productMap[cp.product_id];
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.images?.[0]?.image_url || '/images/placeholder.jpg',
          reason: 'Frequently bought together',
          confidence: Math.min(0.9, parseInt(cp.get('count')) / 10)
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('Frequently bought together error:', error);
      return [];
    }
  }

  async getViewedTogether(productId, sessionId, limit = 5) {
    try {
      const session = await UserSession.findOne({
        where: { session_id: sessionId }
      });

      if (!session) return [];

      const viewHistory = session.view_history || [];
      const viewedIds = viewHistory.slice(0, 10).map(v => v.productId).filter(id => id !== productId);

      if (viewedIds.length === 0) return [];

      const activities = await UserActivity.findAll({
        where: {
          product_id: { [Op.in]: viewedIds },
          activity_type: 'product_view',
          session_id: { [Op.ne]: sessionId }
        },
        attributes: [
          'product_id',
          [sequelize.fn('COUNT', sequelize.literal('DISTINCT session_id')), 'viewer_count']
        ],
        group: ['product_id'],
        having: sequelize.literal('viewer_count > 1'),
        order: [[sequelize.literal('viewer_count'), 'DESC']],
        limit
      });

      const productIds = activities.map(a => a.product_id);
      const products = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
        include: [{ model: ProductImage, as: 'images' }]
      });

      const productMap = {};
      products.forEach(p => productMap[p.id] = p);

      return activities.map(a => {
        const product = productMap[a.product_id];
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: parseFloat(product.price),
          image: product.images?.[0]?.image_url || '/images/placeholder.jpg',
          reason: 'Viewed together',
          confidence: Math.min(0.8, parseInt(a.get('viewer_count')) / 20)
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('Viewed together error:', error);
      return [];
    }
  }

  async getTrendingProducts(limit = 10, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const trending = await sequelize.query(`
        SELECT 
          pa.product_id,
          p.name,
          p.price,
          pi.image_url,
          pa.views,
          pa.cart_adds,
          pa.purchases,
          (pa.views * 1 + pa.cart_adds * 3 + pa.purchases * 5) as trending_score
        FROM product_analytics pa
        JOIN products p ON pa.product_id = p.id
        LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
        WHERE pa.date >= '${startDate.toISOString().split('T')[0]}'
        ORDER BY trending_score DESC
        LIMIT ?
      `, {
        type: sequelize.QueryTypes.SELECT,
        replacements: [limit]
      });

      return trending.map(t => ({
        id: t.product_id,
        name: t.name,
        price: parseFloat(t.price),
        image: t.image_url || '/images/placeholder.jpg',
        views: t.views,
        purchases: t.purchases,
        reason: 'Trending now',
        confidence: Math.min(0.95, t.trending_score / 100)
      }));
    } catch (error) {
      console.error('Trending products error:', error);
      return [];
    }
  }

  async getRegionBasedProducts(region, limit = 5) {
    if (!region) return [];

    try {
      const products = await Product.findAll({
        where: { is_active: true },
        include: [{ model: ProductImage, as: 'images' }],
        order: sequelize.literal('RAND()'),
        limit
      });

      return products.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        image: p.images?.[0]?.image_url || '/images/placeholder.jpg',
        reason: `Popular in ${region}`,
        confidence: 0.6
      }));
    } catch (error) {
      console.error('Region products error:', error);
      return [];
    }
  }

  async getPersonalizedRecommendations(sessionId, userId, limit = 10) {
    try {
      let recommendations = [];
      const seenIds = new Set();

      if (userId) {
        const userSession = await UserSession.findOne({
          where: { user_id: userId }
        });

        if (userSession) {
          const viewHistory = userSession.view_history || [];
          const purchaseHistory = userSession.purchase_history || [];
          const interests = userSession.interests || {};

          if (viewHistory.length > 0) {
            const lastViewed = viewHistory[0];
            const lastViewedProducts = await this.getViewedTogether(
              lastViewed.productId,
              userSession.session_id,
              5
            );
            
            for (const rec of lastViewedProducts) {
              if (!seenIds.has(rec.id)) {
                recommendations.push(rec);
                seenIds.add(rec.id);
              }
            }
          }

          const purchaseCategories = purchaseHistory.map(p => p.category).filter(Boolean);
          if (purchaseCategories.length > 0) {
            const relatedProducts = await Product.findAll({
              where: {
                id: { [Op.notIn]: [...seenIds] },
                is_active: true,
                category_id: { [Op.in]: purchaseCategories }
              },
              include: [{ model: ProductImage, as: 'images' }],
              limit: 5
            });

            for (const product of relatedProducts) {
              recommendations.push({
                id: product.id,
                name: product.name,
                price: parseFloat(product.price),
                image: product.images?.[0]?.image_url || '/images/placeholder.jpg',
                reason: 'Based on your purchases',
                confidence: 0.7
              });
              seenIds.add(product.id);
            }
          }
        }
      }

      const trendingProducts = await this.getTrendingProducts(limit);
      for (const rec of trendingProducts) {
        if (!seenIds.has(rec.id)) {
          recommendations.push(rec);
          seenIds.add(rec.id);
        }
        if (recommendations.length >= limit) break;
      }

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('Personalized recommendations error:', error);
      return [];
    }
  }

  async getCheckoutUpsells(cartItems, limit = 3) {
    const upsells = [];
    const cartProductIds = cartItems.map(item => item.productId);

    const cartCategories = [];
    const cartBrands = [];

    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        cartCategories.push(product.category_id);
        if (product.brand) cartBrands.push(product.brand);
      }
    }

    const complementaryRules = [
      {
        trigger: { category: 'laptops', name: /laptop|notebook/i },
        suggests: [
          { keyword: 'mouse', reason: 'Need a mouse for your new laptop?' },
          { keyword: 'laptop bag', reason: 'Protect your laptop with a bag' },
          { keyword: 'headphones', reason: 'Great headphones for work and entertainment' }
        ]
      },
      {
        trigger: { category: 'phones', name: /phone|smartphone/i },
        suggests: [
          { keyword: 'case', reason: 'Protect your new phone' },
          { keyword: 'charger', reason: 'Extra charger for convenience' },
          { keyword: 'earbuds', reason: 'Complete your setup with earbuds' }
        ]
      },
      {
        trigger: { category: 'gaming', name: /gaming|gamer|playstation|xbox/i },
        suggests: [
          { keyword: 'controller', reason: 'Enhanced gaming experience' },
          { keyword: 'headset', reason: 'Immersive audio for gaming' },
          { keyword: 'monitor', reason: 'Better display for gaming' }
        ]
      }
    ];

    for (const item of cartItems) {
      const product = await Product.findByPk(item.productId);
      if (!product) continue;

      for (const rule of complementaryRules) {
        if (
          (rule.trigger.category && product.category_id === rule.trigger.category) ||
          (rule.trigger.name && rule.trigger.name.test(product.name))
        ) {
          for (const suggestion of rule.suggests) {
            if (upsells.length >= limit) break;

            const suggestedProducts = await Product.findAll({
              where: {
                id: { [Op.notIn]: cartProductIds },
                is_active: true,
                name: { [Op.like]: `%${suggestion.keyword}%` }
              },
              include: [{ model: ProductImage, as: 'images' }],
              limit: 1
            });

            for (const suggested of suggestedProducts) {
              if (!upsells.find(u => u.id === suggested.id)) {
                upsells.push({
                  id: suggested.id,
                  name: suggested.name,
                  price: parseFloat(suggested.price),
                  image: suggested.images?.[0]?.image_url || '/images/placeholder.jpg',
                  reason: suggestion.reason,
                  addedValue: parseFloat(suggested.price) * 0.1,
                  confidence: 0.85
                });
              }
            }
          }
          break;
        }
      }
    }

    return upsells.slice(0, limit);
  }

  async getSimilarUsersRecommendations(userId, limit = 5) {
    try {
      const userSession = await UserSession.findOne({
        where: { user_id: userId }
      });

      if (!userSession) return [];

      const userInterests = userSession.interests || {};
      const userCategories = Object.keys(userInterests).filter(k => userInterests[k] > 0);

      if (userCategories.length === 0) return [];

      const similarSessions = await UserSession.findAll({
        where: {
          user_id: { [Op.ne]: userId },
          interests: {
            [Op.or]: userCategories.map(cat => ({
              [Op.like]: `%${cat}%`
            }))
          }
        },
        limit: 20
      });

      const similarSessionIds = similarSessions.map(s => s.session_id);
      const purchaseHistory = similarSessions.flatMap(s => s.purchase_history || []);
      const purchasedIds = purchaseHistory.map(p => p.productId).filter(Boolean);

      if (purchasedIds.length === 0) return [];

      const products = await Product.findAll({
        where: {
          id: { [Op.in]: purchasedIds.slice(0, 10) },
          is_active: true
        },
        include: [{ model: ProductImage, as: 'images' }]
      });

      return products.map(p => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        image: p.images?.[0]?.image_url || '/images/placeholder.jpg',
        reason: 'Customers like you also bought',
        confidence: 0.75
      })).slice(0, limit);
    } catch (error) {
      console.error('Similar users recommendations error:', error);
      return [];
    }
  }

  async enhanceSearchResults(searchQuery, userId, region, limit = 10) {
    try {
      const recommendations = [];

      if (userId) {
        const userSession = await UserSession.findOne({
          where: { user_id: userId }
        });

        if (userSession?.interests) {
          const interests = userSession.interests;
          const interestKeywords = Object.entries(interests)
            .filter(([_, score]) => score > 0.5)
            .map(([keyword]) => keyword);

          if (interestKeywords.length > 0) {
            const enhancedQuery = `${searchQuery} ${interestKeywords.join(' ')}`;
            
            const products = await Product.findAll({
              where: {
                is_active: true,
                [Op.or]: [
                  { name: { [Op.like]: `%${searchQuery}%` } },
                  { description: { [Op.like]: `%${searchQuery}%` } },
                  { brand: { [Op.like]: `%${searchQuery}%` } }
                ]
              },
              include: [{ model: ProductImage, as: 'images' }],
              limit
            });

            return products.map(p => ({
              ...p.toJSON(),
              recommendationScore: this.calculateProductScore(p, interests),
              recommendationReason: 'Based on your interests'
            }));
          }
        }
      }

      const products = await Product.findAll({
        where: {
          is_active: true,
          [Op.or]: [
            { name: { [Op.like]: `%${searchQuery}%` } },
            { description: { [Op.like]: `%${searchQuery}%` } },
            { brand: { [Op.like]: `%${searchQuery}%` } }
          ]
        },
        include: [{ model: ProductImage, as: 'images' }],
        limit
      });

      return products.map(p => ({
        ...p.toJSON(),
        recommendationScore: 0.5,
        recommendationReason: null
      }));
    } catch (error) {
      console.error('Enhance search results error:', error);
      return [];
    }
  }

  calculateProductScore(product, interests) {
    let score = 0.5;

    if (product.brand && interests[product.brand.toLowerCase()]) {
      score += interests[product.brand.toLowerCase()] * 0.2;
    }

    if (product.tags) {
      for (const tag of product.tags) {
        if (interests[tag.toLowerCase()]) {
          score += interests[tag.toLowerCase()] * 0.1;
        }
      }
    }

    return Math.min(1, score);
  }
}

module.exports = new RecommendationEngine();
