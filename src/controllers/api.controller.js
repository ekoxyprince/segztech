// API Controller - Handles API requests for AJAX

const { productService } = require('../database/service');
const cartService = require('../services/cart.service');

class AiSearchEngine {
  parseQuery(query) {
    const lowerQuery = query.toLowerCase();
    const filters = {
      maxPrice: null,
      minPrice: null,
      brand: null,
      ram: null,
      storage: null,
      gpu: null,
      processor: null,
      category: null,
      keywords: []
    };

    // Price patterns
    const priceUnderMatch = lowerQuery.match(/(?:under|less than|below|max|maximum|maximum)\s*\$?(\d+[k]?)/i);
    if (priceUnderMatch) {
      let price = priceUnderMatch[1].toLowerCase();
      if (price.endsWith('k')) {
        filters.maxPrice = parseInt(price) * 1000;
      } else {
        filters.maxPrice = parseInt(price);
      }
    }

    const priceRangeMatch = lowerQuery.match(/\$?(\d+[k]?)\s*(?:to|-)\s*\$?(\d+[k]?)/i);
    if (priceRangeMatch) {
      let min = priceRangeMatch[1].toLowerCase();
      let max = priceRangeMatch[2].toLowerCase();
      filters.minPrice = min.endsWith('k') ? parseInt(min) * 1000 : parseInt(min);
      filters.maxPrice = max.endsWith('k') ? parseInt(max) * 1000 : parseInt(max);
    }

    // GPU patterns
    const gpuPatterns = [
      { pattern: /rtx\s*(\d{4})/i, gpu: (m) => `RTX ${m[1]}` },
      { pattern: /gtx\s*(\d{3,4})/i, gpu: (m) => `GTX ${m[1]}` },
      { pattern: /nvidia\s*(?:rtx|gtx)?\s*(\d{3,4})/i, gpu: (m) => `RTX ${m[1]}` },
      { pattern: /rx\s*(\d{4})/i, gpu: (m) => `RX ${m[1]}` },
      { pattern: /radeon\s*(?:rx)?\s*(\d{3,4})/i, gpu: (m) => `RX ${m[1]}` },
      { pattern: /integrated/i, gpu: () => 'Integrated' }
    ];

    for (const gpuPattern of gpuPatterns) {
      const match = lowerQuery.match(gpuPattern.pattern);
      if (match) {
        filters.gpu = gpuPattern.gpu(match);
        break;
      }
    }

    // RAM patterns
    const ramMatch = lowerQuery.match(/(\d+)\s*gb\s*(?:ram|memory)/i);
    if (ramMatch) {
      filters.ram = `${ramMatch[1]}GB`;
    }
    const ramOnlyMatch = lowerQuery.match(/(\d+)\s*gb/i);
    if (ramOnlyMatch && !filters.ram) {
      filters.ram = `${ramOnlyMatch[1]}GB`;
    }

    // Storage patterns
    const storageMatch = lowerQuery.match(/(\d+)\s*(?:tb|gb)\s*(?:ssd|hdd|storage|space)/i);
    if (storageMatch) {
      const size = storageMatch[1];
      const unit = lowerQuery.includes('tb') ? 'TB' : 'GB';
      filters.storage = `${size}${unit}`;
    }
    const storageOnlyMatch = lowerQuery.match(/(\d+)\s*(?:tb|gb)/i);
    if (storageOnlyMatch && !filters.storage) {
      const size = storageOnlyMatch[1];
      const unit = lowerQuery.includes('tb') ? 'TB' : 'GB';
      filters.storage = `${size}${unit}`;
    }

    // Brand patterns
    const brands = ['apple', 'samsung', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'microsoft', 'google', 'oneplus', 'sony', 'logitech', 'razer'];
    for (const brand of brands) {
      if (lowerQuery.includes(brand)) {
        filters.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
        break;
      }
    }

    // Category patterns
    const categories = {
      'laptop': ['laptop', 'notebook'],
      'phone': ['phone', 'smartphone', 'mobile'],
      'tablet': ['tablet', 'ipad'],
      'accessory': ['headphone', 'earbud', 'charger', 'cable'],
      'gaming': ['gaming', 'game', 'console', 'playstation', 'xbox', 'nintendo']
    };

    for (const [category, terms] of Object.entries(categories)) {
      for (const term of terms) {
        if (lowerQuery.includes(term)) {
          filters.category = category;
          break;
        }
      }
    }

    // Processor patterns
    const processorPatterns = [
      { pattern: /i[3579]-\d{4,5}/i, name: (m) => m[0] },
      { pattern: /ryzen\s*[3579]\s*\d{4}/i, name: (m) => m[0] },
      { pattern: /m[123]/i, name: (m) => `Apple ${m[0].toUpperCase()}` }
    ];

    for (const proc of processorPatterns) {
      const match = lowerQuery.match(proc.pattern);
      if (match) {
        filters.processor = proc.name(match);
        break;
      }
    }

    // Extract remaining keywords
    const excludeWords = ['i', 'need', 'want', 'looking', 'for', 'with', 'that', 'and', 'the', 'a', 'an', 'under', 'less', 'than', 'under', 'around', 'about', 'budget', 'cheap', 'affordable', 'expensive', 'premium', 'best', 'good'];
    const words = lowerQuery.split(/\s+/).filter(w => w.length > 2 && !excludeWords.includes(w));
    filters.keywords = words;

    return filters;
  }

  generateSearchTerms(filters) {
    const terms = [];
    
    if (filters.keywords.length > 0) {
      terms.push(...filters.keywords);
    }
    
    if (filters.brand) terms.push(filters.brand);
    if (filters.category) terms.push(filters.category);
    
    return terms.join(' ');
  }

  scoreProduct(product, filters) {
    let score = 0;
    const reasons = [];

    // Price scoring
    if (filters.maxPrice && product.price <= filters.maxPrice) {
      score += 30;
      if (filters.minPrice && product.price >= filters.minPrice) {
        score += 10;
        reasons.push('Price in range');
      } else if (!filters.minPrice) {
        reasons.push('Within budget');
      }
    } else if (filters.maxPrice) {
      return { score: -1, reasons: [] };
    }

    // GPU scoring
    if (filters.gpu && product.specs) {
      const gpuSpec = (product.specs.gpu_model || product.specs.gpu || '').toLowerCase();
      if (gpuSpec.includes(filters.gpu.toLowerCase()) || gpuSpec.includes(filters.gpu.replace(/\s+/g, '').toLowerCase())) {
        score += 40;
        reasons.push(`Has ${filters.gpu}`);
      }
    }

    // RAM scoring
    if (filters.ram && product.specs) {
      const ramSpec = (product.specs.ram || '').toLowerCase();
      if (ramSpec.includes(filters.ram.toLowerCase().replace('gb', ''))) {
        score += 30;
        reasons.push(`Has ${filters.ram} RAM`);
      }
    }

    // Storage scoring
    if (filters.storage && product.specs) {
      const storageSpec = (product.specs.storage_capacity || product.specs.storage || '').toLowerCase();
      if (storageSpec.includes(filters.storage.toLowerCase().replace('gb', '').replace('tb', ''))) {
        score += 25;
        reasons.push(`Has ${filters.storage} storage`);
      }
    }

    // Brand scoring
    if (filters.brand && product.brand) {
      if (product.brand.toLowerCase() === filters.brand.toLowerCase()) {
        score += 20;
        reasons.push(`${filters.brand} brand`);
      }
    }

    // Category scoring
    if (filters.category && product.category) {
      if (product.category.toLowerCase().includes(filters.category.toLowerCase())) {
        score += 15;
      }
    }

    // Keyword matching in name
    if (filters.keywords.length > 0) {
      const nameLower = (product.name || '').toLowerCase();
      const descLower = (product.description || '').toLowerCase();
      let keywordMatches = 0;
      
      for (const keyword of filters.keywords) {
        if (nameLower.includes(keyword) || descLower.includes(keyword)) {
          keywordMatches++;
        }
      }
      
      score += keywordMatches * 5;
    }

    // Boost for featured/featured products
    if (product.is_featured) score += 5;
    if (product.is_hot_pick) score += 3;

    return { score, reasons };
  }
}

const aiEngine = new AiSearchEngine();

class ApiController {
  async getProducts(req, res) {
    try {
      const options = {
        category: req.query.category,
        brand: req.query.brand,
        search: req.query.search,
        sort: req.query.sort,
        page: req.query.page || 1,
        limit: req.query.limit || 12
      };
      
      const result = await productService.getAllProducts(options);
      res.json(result);
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  }
  
  async searchProducts(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.length < 2) {
        return res.json({ products: [] });
      }
      
      const result = await productService.getAllProducts({ search: q, limit: 10 });
      res.json({ products: result.products });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  }
  
  async aiSearchProducts(req, res) {
    try {
      const { q } = req.query;
      
      if (!q || q.length < 3) {
        return res.json({ success: false, products: [] });
      }

      const filters = aiEngine.parseQuery(q);
      const searchQuery = aiEngine.generateSearchTerms(filters);
      
      const result = await productService.getAllProducts({
        search: searchQuery || q,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        limit: 50
      });

      let scoredProducts = [];
      
      for (const product of result.products) {
        const { score, reasons } = aiEngine.scoreProduct(product, filters);
        if (score > 0) {
          scoredProducts.push({
            ...product,
            matchScore: score,
            matchReason: reasons.join(', ')
          });
        }
      }

      scoredProducts.sort((a, b) => b.matchScore - a.matchScore);

      res.json({
        success: true,
        query: q,
        filters,
        searchQuery,
        results: {
          products: scoredProducts.slice(0, 20),
          total: scoredProducts.length
        }
      });
    } catch (error) {
      console.error('AI Search error:', error);
      res.status(500).json({ success: false, error: 'AI search failed' });
    }
  }
  
  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();
      res.json({ categories });
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  }
  
  async getBrands(req, res) {
    try {
      const brands = await productService.getBrands();
      res.json({ brands });
    } catch (error) {
      console.error('API error:', error);
      res.status(500).json({ error: 'Failed to fetch brands' });
    }
  }
  
  async addToCart(req, res) {
    try {
      const { productId, quantity = 1 } = req.body;
      const result = await cartService.addToCart(req.session, productId, parseInt(quantity));
      res.json(result);
    } catch (error) {
      console.error('Cart error:', error);
      res.status(500).json({ error: 'Failed to add to cart' });
    }
  }
  
  async updateCart(req, res) {
    try {
      const { productId, quantity } = req.body;
      const result = await cartService.updateQuantity(req.session, productId, parseInt(quantity));
      
      res.json({
        ...result,
        cartCount: cartService.getCartCount(req.session),
        totals: cartService.getCartTotals(req.session)
      });
    } catch (error) {
      console.error('Cart error:', error);
      res.status(500).json({ error: 'Failed to update cart' });
    }
  }
  
  removeFromCart(req, res) {
    try {
      const { productId } = req.params;
      const result = cartService.removeFromCart(req.session, productId);
      
      res.json({
        ...result,
        cartCount: cartService.getCartCount(req.session),
        totals: cartService.getCartTotals(req.session)
      });
    } catch (error) {
      console.error('Cart error:', error);
      res.status(500).json({ error: 'Failed to remove from cart' });
    }
  }
  
  getCart(req, res) {
    try {
      const cart = cartService.getCart(req.session);
      const totals = cartService.getCartTotals(req.session);
      
      res.json({ cart, totals });
    } catch (error) {
      console.error('Cart error:', error);
      res.status(500).json({ error: 'Failed to get cart' });
    }
  }
  
  toggleWishlist(req, res) {
    try {
      const { productId } = req.body;
      
      if (!req.session.wishlist) {
        req.session.wishlist = [];
      }
      
      const index = req.session.wishlist.indexOf(productId);
      let success = true;
      let message = '';
      
      if (index > -1) {
        req.session.wishlist.splice(index, 1);
        message = 'Removed from wishlist';
      } else {
        req.session.wishlist.push(productId);
        message = 'Added to wishlist';
      }
      
      res.json({
        success,
        message,
        isInWishlist: index === -1,
        wishlistCount: req.session.wishlist.length
      });
    } catch (error) {
      console.error('Wishlist error:', error);
      res.status(500).json({ error: 'Failed to update wishlist' });
    }
  }
  
  checkWishlist(req, res) {
    try {
      const { productId } = req.params;
      const isInWishlist = req.session.wishlist ? req.session.wishlist.includes(productId) : false;
      
      res.json({ isInWishlist });
    } catch (error) {
      console.error('Wishlist error:', error);
      res.json({ isInWishlist: false });
    }
  }
}

module.exports = new ApiController();
