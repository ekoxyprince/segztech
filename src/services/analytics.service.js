const { Op } = require('sequelize');
const {
  UserSession,
  UserActivity,
  ProductAnalytics,
  SearchAnalytics,
  RecommendationCache,
  RegionAnalytics,
  Product,
  Order,
  OrderItem,
  sequelize
} = require('../database/models');

class AnalyticsService {
  constructor() {
    this.deviceDetection = this.detectDevice.bind(this);
    this.referrerDetection = this.detectReferrer.bind(this);
  }

  detectDevice(userAgent) {
    if (!userAgent) return 'desktop';
    const ua = userAgent.toLowerCase();
    if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
      return 'mobile';
    }
    if (/tablet|ipad|playbook|silk|roku/i.test(ua)) {
      return 'tablet';
    }
    if (/bot|crawl|slurp|spider|google|Yandex|Bing/i.test(ua)) {
      return 'bot';
    }
    return 'desktop';
  }

  detectBrowser(userAgent) {
    if (!userAgent) return 'Unknown';
    if (/MSIE|Trident/i.test(userAgent)) return 'Internet Explorer';
    if (/Edge/i.test(userAgent)) return 'Edge';
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) return 'Chrome';
    if (/Firefox/i.test(userAgent)) return 'Firefox';
    if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) return 'Safari';
    if (/Opera|OPR/i.test(userAgent)) return 'Opera';
    return 'Other';
  }

  detectOS(userAgent) {
    if (!userAgent) return 'Unknown';
    if (/Windows NT 10/i.test(userAgent)) return 'Windows 10';
    if (/Windows NT 6.3/i.test(userAgent)) return 'Windows 8.1';
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Mac OS X/i.test(userAgent)) return 'macOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    return 'Other';
  }

  detectReferrer(referrer) {
    if (!referrer) return 'direct';
    const ref = referrer.toLowerCase();
    if (/google|bing|yahoo|duckduckgo|baidu/i.test(ref)) return 'search';
    if (/facebook|twitter|instagram|linkedin|tiktok/i.test(ref)) return 'social';
    if (/mail|gmail|outlook/i.test(ref)) return 'email';
    if (/amazon|ebay|aliexpress/i.test(ref)) return 'affiliate';
    return 'internal';
  }

  normalizeQuery(query) {
    return query.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async getOrCreateSession(sessionId, req) {
    try {
      let session = await UserSession.findOne({ where: { session_id: sessionId } });
      
      if (!session) {
        const userAgent = req.headers['user-agent'] || '';
        const deviceType = this.deviceDetection(userAgent);
        const browser = this.detectBrowser(userAgent);
        const os = this.detectOS(userAgent);
        const language = req.headers['accept-language']?.split(',')[0] || 'en';
        
        session = await UserSession.create({
          session_id: sessionId,
          user_id: req.session?.user?.id || null,
          ip_address: req.ip || req.connection?.remoteAddress || '',
          user_agent: userAgent,
          device_type: deviceType,
          browser,
          os,
          language,
          country: req.geo?.country || null,
          region: req.geo?.region || null,
          city: req.geo?.city || null,
          timezone: req.geo?.timezone || null,
          first_visit: new Date(),
          last_activity: new Date()
        });
      } else if (req.session?.user?.id && session.user_id !== req.session.user.id) {
        session.user_id = req.session.user.id;
        await session.save();
      }
      
      return session;
    } catch (error) {
      console.error('Session error:', error);
      return null;
    }
  }

  async trackActivity(sessionId, req, activityData) {
    try {
      const session = await this.getOrCreateSession(sessionId, req);
      if (!session) return null;

      const userAgent = req.headers['user-agent'] || '';
      const deviceType = this.deviceDetection(userAgent);
      
      const activity = await UserActivity.create({
        session_id: sessionId,
        user_id: session.user_id,
        activity_type: activityData.type,
        page_url: req.originalUrl || activityData.url || null,
        page_name: activityData.pageName || (req.path !== '/' ? req.path : 'home'),
        product_id: activityData.productId || null,
        product_name: activityData.productName || null,
        product_category: activityData.category || null,
        product_price: activityData.price ? parseFloat(activityData.price) : null,
        product_brand: activityData.brand || null,
        search_query: activityData.searchQuery || activityData.query || null,
        search_results_count: activityData.resultsCount || null,
        filters_applied: activityData.filters || {},
        sort_option: activityData.sortOption || null,
        referrer_url: req.get('referrer') || null,
        referrer_type: this.detectReferrer(req.get('referrer')),
        utm_source: req.query.utm_source || null,
        utm_medium: req.query.utm_medium || null,
        utm_campaign: req.query.utm_campaign || null,
        device_type: deviceType,
        country: session.country,
        region: session.region,
        city: session.city,
        ip_address: session.ip_address,
        user_agent: userAgent,
        browser: session.browser,
        os: session.os,
        scroll_depth: activityData.scrollDepth || activityData.depth || null,
        time_on_page: activityData.timeOnPage || activityData.seconds || null,
        metadata: activityData.metadata || {}
      });

      await this.updateSessionStats(session, activityData);
      await this.updateProductAnalytics(activityData);
      await this.updateRegionAnalytics(session, activityData);

      return activity;
    } catch (error) {
      console.error('Track activity error:', error);
      return null;
    }
  }

  async updateSessionStats(session, activityData) {
    try {
      const updates = {
        last_activity: new Date(),
        total_page_views: activityData.type === 'page_view' 
          ? session.total_page_views + 1 
          : session.total_page_views,
        products_viewed: activityData.type === 'product_view'
          ? session.products_viewed + 1
          : session.products_viewed,
        products_added_to_cart: activityData.type === 'add_to_cart'
          ? session.products_added_to_cart + 1
          : session.products_added_to_cart,
        checkout_attempts: activityData.type === 'checkout_start'
          ? session.checkout_attempts + 1
          : session.checkout_attempts,
        searches_made: activityData.type === 'search'
          ? session.searches_made + 1
          : session.searches_made
      };

      if (activityData.type === 'search' && activityData.searchQuery) {
        const searchHistory = session.search_history || [];
        searchHistory.unshift({
          query: activityData.searchQuery,
          timestamp: new Date().toISOString()
        });
        updates.search_history = searchHistory.slice(0, 50);
      }

      if (activityData.type === 'product_view' && activityData.productId) {
        const viewHistory = session.view_history || [];
        viewHistory.unshift({
          productId: activityData.productId,
          productName: activityData.productName,
          timestamp: new Date().toISOString()
        });
        updates.view_history = viewHistory.slice(0, 100);
      }

      await session.update(updates);
    } catch (error) {
      console.error('Update session stats error:', error);
    }
  }

  async updateProductAnalytics(activityData) {
    if (!activityData.productId) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      let analytics = await ProductAnalytics.findOne({
        where: {
          product_id: activityData.productId,
          date: today
        }
      });

      const updateFields = {};
      
      switch (activityData.type) {
        case 'page_view':
        case 'product_view':
          updateFields.views = sequelize.literal('views + 1');
          break;
        case 'add_to_cart':
          updateFields.cart_adds = sequelize.literal('cart_adds + 1');
          break;
        case 'remove_from_cart':
          updateFields.cart_removes = sequelize.literal('cart_removes + 1');
          break;
        case 'checkout_complete':
          updateFields.purchases = sequelize.literal('purchases + 1');
          break;
        case 'wishlist_add':
          updateFields.wishlist_adds = sequelize.literal('wishlist_adds + 1');
          break;
      }

      if (Object.keys(updateFields).length > 0) {
        if (analytics) {
          await analytics.update(updateFields);
        } else {
          await ProductAnalytics.create({
            product_id: activityData.productId,
            product_name: activityData.productName,
            product_category: activityData.category,
            product_brand: activityData.brand,
            date: today,
            ...updateFields
          });
        }
      }
    } catch (error) {
      console.error('Update product analytics error:', error);
    }
  }

  async updateRegionAnalytics(session, activityData) {
    if (!session.country) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      let analytics = await RegionAnalytics.findOne({
        where: {
          country: session.country,
          region: session.region,
          date: today
        }
      });

      if (analytics) {
        const updateFields = {
          page_views: sequelize.literal('page_views + 1')
        };
        if (activityData.type === 'checkout_complete') {
          updateFields.conversions = sequelize.literal('conversions + 1');
        }
        await analytics.update(updateFields);
      } else {
        await RegionAnalytics.create({
          country: session.country,
          region: session.region,
          city: session.city,
          date: today,
          sessions: 1,
          page_views: 1,
          timezone: session.timezone
        });
      }
    } catch (error) {
      console.error('Update region analytics error:', error);
    }
  }

  async trackSearch(sessionId, req, searchData) {
    try {
      const session = await this.getOrCreateSession(sessionId, req);
      const normalizedQuery = this.normalizeQuery(searchData.query);
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      const hour = today.getHours();

      let searchAnalytics = await SearchAnalytics.findOne({
        where: {
          normalized_query: normalizedQuery,
          date: dateStr
        }
      });

      if (searchAnalytics) {
        searchAnalytics.search_count += 1;
        searchAnalytics.results_count = searchData.resultsCount || 0;
        
        if (searchData.clickedProductId) {
          searchAnalytics.clicks_count += 1;
          const topProducts = searchAnalytics.top_clicked_products || [];
          const existingProduct = topProducts.find(p => p.productId === searchData.clickedProductId);
          if (existingProduct) {
            existingProduct.clicks += 1;
          } else {
            topProducts.push({
              productId: searchData.clickedProductId,
              productName: searchData.clickedProductName,
              clicks: 1
            });
          }
          searchAnalytics.top_clicked_products = topProducts.slice(0, 10);
        }
        
        searchAnalytics.click_through_rate = searchAnalytics.search_count > 0
          ? searchAnalytics.clicks_count / searchAnalytics.search_count
          : 0;
        
        await searchAnalytics.save();
      } else {
        const clicksCount = searchData.clickedProductId ? 1 : 0;
        await SearchAnalytics.create({
          search_query: searchData.query,
          normalized_query: normalizedQuery,
          search_count: 1,
          results_count: searchData.resultsCount || 0,
          clicks_count: clicksCount,
          click_through_rate: clicksCount > 0 ? 1 : 0,
          no_results_count: searchData.resultsCount === 0 ? 1 : 0,
          top_clicked_products: searchData.clickedProductId ? [{
            productId: searchData.clickedProductId,
            productName: searchData.clickedProductName,
            clicks: 1
          }] : [],
          date: dateStr,
          hour,
          country: session?.country,
          region: session?.region,
          device_type: session?.device_type || 'desktop',
          ai_enhanced: searchData.aiEnhanced || false
        });
      }

      return searchAnalytics;
    } catch (error) {
      console.error('Track search error:', error);
      return null;
    }
  }

  async getTopSearches(limit = 10, days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const searches = await SearchAnalytics.findAll({
        where: {
          date: {
            [Op.gte]: startDate.toISOString().split('T')[0]
          }
        },
        attributes: [
          'normalized_query',
          [sequelize.fn('MAX', sequelize.col('search_query')), 'original_query'],
          [sequelize.fn('SUM', sequelize.col('search_count')), 'total_count'],
          [sequelize.fn('SUM', sequelize.col('clicks_count')), 'total_clicks'],
          [sequelize.fn('AVG', sequelize.col('click_through_rate')), 'avg_ctr']
        ],
        group: ['normalized_query'],
        order: [[sequelize.literal('total_count'), 'DESC']],
        limit
      });

      return searches.map(s => ({
        query: s.get('original_query') || s.normalized_query,
        count: parseInt(s.get('total_count')),
        clicks: parseInt(s.get('total_clicks')),
        ctr: parseFloat(s.get('avg_ctr')) || 0
      }));
    } catch (error) {
      console.error('Get top searches error:', error);
      return [];
    }
  }

  async getTopProducts(limit = 10, days = 7, metric = 'views') {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const products = await ProductAnalytics.findAll({
        where: {
          date: {
            [Op.gte]: startDate.toISOString().split('T')[0]
          }
        },
        attributes: [
          'product_id',
          'product_name',
          'product_category',
          'product_brand',
          [sequelize.fn('SUM', sequelize.col(metric)), 'total']
        ],
        group: ['product_id', 'product_name', 'product_category', 'product_brand'],
        order: [[sequelize.literal('total'), 'DESC']],
        limit
      });

      return products.map(p => ({
        id: p.product_id,
        name: p.product_name,
        category: p.product_category,
        brand: p.product_brand,
        value: parseInt(p.get('total'))
      }));
    } catch (error) {
      console.error('Get top products error:', error);
      return [];
    }
  }

  async getRegionalInsights() {
    try {
      const insights = await RegionAnalytics.findAll({
        attributes: [
          'country',
          [sequelize.fn('SUM', sequelize.col('sessions')), 'total_sessions'],
          [sequelize.fn('SUM', sequelize.col('conversions')), 'total_conversions'],
          [sequelize.fn('SUM', sequelize.col('revenue')), 'total_revenue'],
          [sequelize.fn('AVG', sequelize.col('conversion_rate')), 'avg_conversion_rate']
        ],
        group: ['country'],
        order: [[sequelize.literal('total_sessions'), 'DESC']],
        limit: 20
      });

      return insights.map(r => ({
        country: r.country,
        sessions: parseInt(r.get('total_sessions')),
        conversions: parseInt(r.get('total_conversions')),
        revenue: parseFloat(r.get('total_revenue')),
        conversionRate: parseFloat(r.get('avg_conversion_rate')) || 0
      }));
    } catch (error) {
      console.error('Get regional insights error:', error);
      return [];
    }
  }

  async getDashboardStats(days = 30) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        totalSessions,
        totalActivities,
        totalSearches,
        topProducts,
        topSearches,
        regionalInsights,
        productViews,
        cartAdds,
        purchases,
        deviceBreakdown
      ] = await Promise.all([
        UserSession.count({
          where: {
            created_at: { [Op.gte]: startDate }
          }
        }),
        UserActivity.count({
          where: {
            created_at: { [Op.gte]: startDate }
          }
        }),
        SearchAnalytics.sum('search_count', {
          where: {
            date: { [Op.gte]: startDate.toISOString().split('T')[0] }
          }
        }),
        this.getTopProducts(10, days, 'views'),
        this.getTopSearches(10, days),
        this.getRegionalInsights(),
        ProductAnalytics.sum('views', {
          where: {
            date: { [Op.gte]: startDate.toISOString().split('T')[0] }
          }
        }),
        ProductAnalytics.sum('cart_adds', {
          where: {
            date: { [Op.gte]: startDate.toISOString().split('T')[0] }
          }
        }),
        ProductAnalytics.sum('purchases', {
          where: {
            date: { [Op.gte]: startDate.toISOString().split('T')[0] }
          }
        }),
        UserSession.findAll({
          where: {
            created_at: { [Op.gte]: startDate }
          },
          attributes: [
            'device_type',
            [sequelize.fn('COUNT', sequelize.col('id')), 'count']
          ],
          group: ['device_type']
        })
      ]);

      const deviceStats = { desktop: 0, mobile: 0, tablet: 0, bot: 0 };
      deviceBreakdown.forEach(d => {
        deviceStats[d.device_type] = parseInt(d.get('count'));
      });

      return {
        totalSessions: totalSessions || 0,
        totalActivities: totalActivities || 0,
        totalSearches: totalSearches || 0,
        topProducts,
        topSearches,
        regionalInsights,
        productViews: productViews || 0,
        cartAdds: cartAdds || 0,
        purchases: purchases || 0,
        conversionRate: productViews > 0 ? ((purchases / productViews) * 100).toFixed(2) : 0,
        avgCtr: topSearches.length > 0 
          ? (topSearches.reduce((a, b) => a + b.ctr, 0) / topSearches.length).toFixed(2) 
          : 0,
        deviceStats
      };
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return {
        totalSessions: 0,
        totalActivities: 0,
        totalSearches: 0,
        topProducts: [],
        topSearches: [],
        regionalInsights: [],
        productViews: 0,
        cartAdds: 0,
        purchases: 0,
        conversionRate: 0,
        avgCtr: 0,
        deviceStats: { desktop: 0, mobile: 0, tablet: 0, bot: 0 }
      };
    }
  }
}

module.exports = new AnalyticsService();
