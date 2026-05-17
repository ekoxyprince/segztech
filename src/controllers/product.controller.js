// Product Controller - Handles product-related requests

const { productService } = require('../database/service');
const analyticsService = require('../services/analytics.service');
const categoryConfig = require('../config/category-specs.json');

class ProductController {
  // GET /products - Product listing page
  async getProductListing(req, res) {
    try {
      const {
        category,
        brand,
        search,
        sort,
        minPrice,
        maxPrice,
        sale,
        page
      } = req.query;
      
      let categoryId = null;
      let brandId = null;
      let currentCategory = null;
      let currentBrand = null;
      
      if (category) {
        currentCategory = await productService.getCategoryBySlug(category);
        if (currentCategory) categoryId = currentCategory.id;
      }
      
      if (brand) {
        currentBrand = await productService.getBrandBySlug(brand);
        if (currentBrand) brandId = currentBrand.id;
      }
      
      const [result, categories, brands] = await Promise.all([
        productService.getAllProducts({
          category: categoryId,
          brand: currentBrand ? currentBrand.name : null,
          search,
          sort,
          minPrice,
          maxPrice,
          page: page || 1,
          limit: 12,
          flashSale: sale === 'flash' ? 'true' : null,
          hotPick: sale === 'hot' ? 'true' : null,
          featured: sale === 'featured' ? 'true' : null
        }),
        productService.getCategories(),
        productService.getBrands(category)
      ]);
      
      const sessionId = req.cookies?.segz_session || req.sessionID;
      if (search && sessionId) {
        analyticsService.trackSearch(sessionId, req, {
          query: search,
          resultsCount: result.totalProducts,
          clickedProductId: null,
          aiEnhanced: false
        }).catch(() => {});
      }
      
      let title = 'Products';
      if (search) {
        title = `Search results for "${search}"`;
      } else if (currentCategory) {
        title = `${currentCategory.name} - SegzTech`;
      } else if (currentBrand) {
        title = `${currentBrand.name} Products - SegzTech`;
      } else if (sale === 'flash') {
        title = 'Flash Sale - SegzTech';
      } else if (sale === 'hot') {
        title = 'Hot Picks - SegzTech';
      } else {
        title = 'All Products - SegzTech';
      }

      res.render('pages/products', {
        title,
        currentRoute: 'products',
        products: result.products,
        pagination: {
          totalProducts: result.totalProducts,
          totalPages: result.totalPages,
          currentPage: result.currentPage
        },
        categories,
        brands,
        filters: {
          category,
          brand,
          search,
          sort,
          minPrice,
          maxPrice,
          sale
        },
        currentCategory,
        currentBrand
      });
    } catch (error) {
      console.error('Error loading products:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load products',
        currentRoute: ''
      });
    }
  }
  
  // GET /products/:slug - Product detail page
  async getProductDetail(req, res) {
    try {
      const { slug } = req.params;
      
      const product = await productService.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).render('pages/404', {
          title: 'Product Not Found',
          currentRoute: ''
        });
      }
      
      const sessionId = req.cookies?.segz_session || req.sessionID;
      if (sessionId) {
        analyticsService.trackActivity(sessionId, req, {
          type: 'product_view',
          productId: product.id,
          productName: product.name,
          price: product.price,
          category: product.category,
          brand: product.brand
        }).catch(() => {});
      }
      
      const relatedProducts = await productService.getRelatedProducts(product.id, 4);
      const reviews = await productService.getProductReviews(product.id);
      
      const wishlist = req.session.wishlist || [];
      const isInWishlist = wishlist.includes(product.id);
      
      res.render('pages/product-detail', {
        title: `${product.name} - SegzTech`,
        currentRoute: 'products',
        product,
        relatedProducts,
        isInWishlist,
        reviews
      });
    } catch (error) {
      console.error('Error loading product:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load product',
        currentRoute: ''
      });
    }
  }
  
  // GET /categories - Categories page
  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();
      
      res.render('pages/categories', {
        title: 'Categories - SegzTech',
        currentRoute: 'categories',
        categories
      });
    } catch (error) {
      console.error('Error loading categories:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load categories',
        currentRoute: ''
      });
    }
  }

  // GET /products/categories/:slug - Category specific listing with dynamic filters
  async getCategoryListing(req, res) {
    try {
      const { slug } = req.params;
      const query = req.query;
      
      const category = query.category || '';
      const brand = query.brand || '';
      const search = query.search || '';
      const sort = query.sort || '';
      const minPrice = query.minPrice || '';
      const maxPrice = query.maxPrice || '';
      const ram = query.ram || '';
      const storage = query.storage || '';
      const gpu = query.gpu || '';
      const processor = query.processor || '';
      const condition = query.condition || '';
      const display_size = query.display_size || '';
      const screen_size = query.screen_size || '';
      const refresh_rate = query.refresh_rate || '';
      const resolution = query.resolution || '';
      const panel_type = query.panel_type || '';
      const battery = query.battery || '';
      const page = query.page || 1;

      const categoryConfigData = categoryConfig.categories[slug] || categoryConfig.categories.phones;
      const filterOptions = categoryConfig.filterOptions;

      const options = {
        search,
        sort,
        minPrice,
        maxPrice,
        condition,
        ram,
        storage,
        gpu,
        processor,
        display_size,
        screen_size,
        refresh_rate,
        resolution,
        panel_type,
        battery,
        page: page || 1,
        limit: 12
      };

      // Get category by slug (using name matching for now)
      const categories = await productService.getCategories();
      const currentCategory = categories.find(c => 
        c.slug === slug || 
        c.name.toLowerCase().replace(/\s+/g, '-') === slug
      ) || categories.find(c => c.name.toLowerCase() === slug.replace(/-/g, ' '));

      if (currentCategory) {
        options.category = currentCategory.id;
      }

      const [result, brands] = await Promise.all([
        productService.getAllProducts(options),
        productService.getBrandsForCategory(slug)
      ]);

      const filteredBrands = brands;

      // Build filter data based on category config
      const activeFilters = {};
      if (brand) activeFilters.brand = brand;
      if (minPrice) activeFilters.minPrice = minPrice;
      if (maxPrice) activeFilters.maxPrice = maxPrice;
      if (ram) activeFilters.ram = ram;
      if (storage) activeFilters.storage = storage;
      if (condition) activeFilters.condition = condition;
      if (processor) activeFilters.processor = processor;
      if (gpu) activeFilters.gpu = gpu;
      if (display_size) activeFilters.display_size = display_size;
      if (screen_size) activeFilters.screen_size = screen_size;
      if (refresh_rate) activeFilters.refresh_rate = refresh_rate;
      if (resolution) activeFilters.resolution = resolution;
      if (panel_type) activeFilters.panel_type = panel_type;
      if (battery) activeFilters.battery = battery;

      res.render('pages/category-listing', {
        title: `${categoryConfigData.name} - SegzTech`,
        currentRoute: 'products',
        products: result.products,
        pagination: {
          totalProducts: result.totalProducts,
          totalPages: result.totalPages,
          currentPage: result.currentPage
        },
        categoryConfig: categoryConfigData,
        filterOptions,
        brands: filteredBrands,
        category: slug,
        currentCategory: currentCategory || { name: categoryConfigData.name, slug },
        filters: {
          brand,
          search,
          sort,
          minPrice,
          maxPrice,
          ram,
          storage,
          gpu,
          processor,
          condition,
          display_size,
          screen_size,
          refresh_rate,
          resolution,
          panel_type,
          battery
        },
        activeFilters
      });
    } catch (error) {
      console.error('Error loading category listing:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load category products',
        currentRoute: ''
      });
    }
  }
}

module.exports = new ProductController();
