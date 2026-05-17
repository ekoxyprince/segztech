const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const {
  User,
  UserAddress,
  Category,
  Brand,
  Product,
  ProductImage,
  ProductVideo,
  Order,
  OrderItem,
  OrderAddress,
  OrderTimeline,
  FlashSaleBanner,
  Review,
  sequelize
} = require('./models');

function generateOrderNumber() {
  const now = new Date();
  return `ST-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
}

function parseProduct(p) {
  const data = p.toJSON ? p.toJSON() : p;
  return {
    ...data,
    price: parseFloat(data.price) || 0,
    original_price: parseFloat(data.original_price) || 0,
    discount: parseInt(data.discount) || 0,
    stock: parseInt(data.stock) || 0,
    sold_count: parseInt(data.sold_count) || 0,
    ratings: parseFloat(data.ratings) || 0,
    review_count: parseInt(data.review_count) || 0,
    tags: data.tags || [],
    specs: data.specs || {},
    category: data.category ? data.category.name : null,
    categorySlug: data.category ? data.category.slug : null
  };
}

const productService = {
  async getAllProducts(options = {}) {
    const where = { is_active: true };

    if (options.category) where.category_id = options.category;
    if (options.brand) where.brand = options.brand;
    if (options.minPrice) where.price = { [Op.gte]: parseFloat(options.minPrice) };
    if (options.maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(options.maxPrice) };
    if (options.flashSale === 'true') where.is_flash_sale = true;
    if (options.hotPick === 'true') where.is_hot_pick = true;
    if (options.featured === 'true') where.is_featured = true;
    if (options.condition) where.condition = options.condition;
    
    // Spec-based filtering using JSON_EXTRACT for MySQL
    const specConditions = [];
    if (options.ram) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.ram')) LIKE '%${options.ram}%'`));
    if (options.storage) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.storage_capacity')) LIKE '%${options.storage}%' OR JSON_UNQUOTE(JSON_EXTRACT(specs, '$.storage')) LIKE '%${options.storage}%'`));
    if (options.processor) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.processor')) LIKE '%${options.processor}%'`));
    if (options.gpu) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.gpu_model')) LIKE '%${options.gpu}%'`));
    if (options.display_size) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.display_size')) LIKE '%${options.display_size}%'`));
    if (options.screen_size) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.screen_size')) LIKE '%${options.screen_size}%'`));
    if (options.refresh_rate) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.refresh_rate')) LIKE '%${options.refresh_rate}%'`));
    if (options.resolution) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.resolution')) LIKE '%${options.resolution}%' OR JSON_UNQUOTE(JSON_EXTRACT(specs, '$.display_resolution')) LIKE '%${options.resolution}%'`));
    if (options.panel_type) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.panel_type')) LIKE '%${options.panel_type}%' OR JSON_UNQUOTE(JSON_EXTRACT(specs, '$.display_type')) LIKE '%${options.panel_type}%'`));
    if (options.battery) specConditions.push(sequelize.literal(`JSON_UNQUOTE(JSON_EXTRACT(specs, '$.battery')) LIKE '%${options.battery}%' OR JSON_UNQUOTE(JSON_EXTRACT(specs, '$.battery_capacity')) LIKE '%${options.battery}%'`));
    if (options.condition) where.condition = options.condition;
    
    if (options.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${options.search}%` } },
        { description: { [Op.like]: `%${options.search}%` } },
        { brand: { [Op.like]: `%${options.search}%` } }
      ];
    }

    let order = [['created_at', 'DESC']];
    switch (options.sort) {
      case 'price-low': order = [['price', 'ASC']]; break;
      case 'price-high': order = [['price', 'DESC']]; break;
      case 'rating': order = [['ratings', 'DESC']]; break;
      case 'newest': order = [['created_at', 'DESC']]; break;
      case 'popular': order = [['sold_count', 'DESC']]; break;
    }

    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 12;
    const offset = (page - 1) * limit;

    const queryOptions = {
      where,
      order,
      limit,
      offset,
      include: [
        { model: ProductImage, as: 'images', order: [['sort_order', 'ASC']] },
        { model: ProductVideo, as: 'videos', order: [['sort_order', 'ASC']] },
        { model: Category, as: 'category' }
      ]
    };
    
    // Add spec conditions using Op.and
    if (specConditions.length > 0) {
      if (!queryOptions.where[Op.and]) queryOptions.where[Op.and] = [];
      specConditions.forEach(sc => queryOptions.where[Op.and].push(sc));
    }
    
    const { rows: products, count: totalProducts } = await Product.findAndCountAll(queryOptions);

    return {
      products: products.map(p => parseProduct(p)),
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    };
  },

  async getProductById(id) {
    const product = await Product.findByPk(id, {
      include: [
        { model: ProductImage, as: 'images', order: [['sort_order', 'ASC']] },
        { model: ProductVideo, as: 'videos', order: [['sort_order', 'ASC']] },
        { model: Category, as: 'category' }
      ]
    });
    if (!product) return null;
    return parseProduct(product);
  },

  async getProductBySlug(slug) {
    const product = await Product.findOne({
      where: { slug },
      include: [
        { model: ProductImage, as: 'images', order: [['sort_order', 'ASC']] },
        { model: ProductVideo, as: 'videos', order: [['sort_order', 'ASC']] },
        { model: Category, as: 'category' }
      ]
    });
    if (!product) return null;
    return parseProduct(product);
  },

  async getFeaturedProducts(limit = 8) {
    const products = await Product.findAll({
      where: { is_featured: true, is_active: true },
      order: [['created_at', 'DESC']],
      limit,
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductVideo, as: 'videos' }
      ]
    });
    return products.map(p => parseProduct(p));
  },

  async getFlashSaleProducts(limit = 8) {
    const products = await Product.findAll({
      where: { is_flash_sale: true, is_active: true },
      order: [['created_at', 'DESC']],
      limit,
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductVideo, as: 'videos' }
      ]
    });
    return products.map(p => parseProduct(p));
  },

  async getHotPicks(limit = 8) {
    const products = await Product.findAll({
      where: { is_hot_pick: true, is_active: true },
      order: [['created_at', 'DESC']],
      limit,
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductVideo, as: 'videos' }
      ]
    });
    return products.map(p => parseProduct(p));
  },

  async getBestSellers(limit = 8) {
    const products = await Product.findAll({
      where: { is_active: true },
      order: [['sold_count', 'DESC']],
      limit,
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductVideo, as: 'videos' }
      ]
    });
    return products.map(p => parseProduct(p));
  },

  async getRelatedProducts(productId, limit = 4) {
    const product = await this.getProductById(productId);
    if (!product) return [];

    const products = await Product.findAll({
      where: {
        id: { [Op.ne]: productId },
        is_active: true,
        [Op.or]: [
          { category_id: product.category_id },
          { brand: product.brand }
        ]
      },
      order: [['sold_count', 'DESC']],
      limit,
      include: [
        { model: ProductImage, as: 'images' },
        { model: ProductVideo, as: 'videos' }
      ]
    });
    return products.map(p => parseProduct(p));
  },

  async getCategories() {
    const categories = await Category.findAll({ where: { is_active: true }, order: [['sort_order', 'ASC']] });
    
    const { Product } = require('./models');
    const { Op } = require('sequelize');
    
    const counts = await Product.findAll({
      attributes: ['category_id', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { is_active: true },
      group: ['category_id'],
      raw: true
    });
    
    const countMap = {};
    counts.forEach(c => {
      countMap[c.category_id] = parseInt(c.count);
    });
    
    return categories.map(cat => {
      const catData = cat.toJSON ? cat.toJSON() : cat;
      return {
        ...catData,
        count: countMap[catData.id] || 0
      };
    });
  },

  async getCategoryBySlug(slug) {
    return await Category.findOne({ where: { slug } });
  },

  async getBrands(categorySlug = null) {
    const { query } = this;
    let brands = await Brand.findAll({ where: { is_active: true } });
    
    let categoryId = null;
    if (categorySlug) {
      const cat = await this.getCategoryBySlug(categorySlug);
      if (cat) categoryId = cat.id;
    }
    
    if (categorySlug) {
      brands = brands.filter(brand => {
        if (!brand.categories) return true;
        try {
          const cats = typeof brand.categories === 'string' ? JSON.parse(brand.categories) : brand.categories;
          if (!cats || !Array.isArray(cats)) return true;
          if (cats.includes('all')) return true;
          if (cats.includes(categorySlug)) return true;
          if (categoryId && cats.includes(categoryId)) return true;
          return false;
        } catch {
          return true;
        }
      });
    }
    
    const allCategories = await this.getCategories();
    const categoryMap = {};
    allCategories.forEach(c => { categoryMap[c.id] = c; categoryMap[c.slug] = c; });
    
    brands = brands.map(brand => {
      const brandObj = brand.toJSON();
      let categoryObjects = [];
      try {
        const catIds = typeof brand.categories === 'string' ? JSON.parse(brand.categories) : brand.categories;
        if (catIds && Array.isArray(catIds)) {
          categoryObjects = catIds.map(id => {
            const cat = categoryMap[id];
            return cat ? { id: cat.id, name: cat.name, slug: cat.slug } : { id, name: id };
          });
        }
      } catch {}
      return { ...brandObj, categories: categoryObjects };
    });
    
    return brands;
  },
  
  async updateBrand(brandId, brandData) {
    const updates = {};
    if (brandData.name) updates.name = brandData.name;
    if (brandData.logo !== undefined) updates.logo = brandData.logo;
    if (brandData.website !== undefined) updates.website = brandData.website;
    if (brandData.categories) updates.categories = brandData.categories;
    
    await Brand.update(updates, { where: { id: brandId } });
    return { brand: await Brand.findByPk(brandId) };
  },
  
  async deleteBrand(brandId) {
    await Brand.update({ is_active: false }, { where: { id: brandId } });
    return true;
  },

  async getBrandsForCategory(categorySlug) {
    const allBrands = await Brand.findAll({ where: { is_active: true } });
    
    if (!categorySlug) {
      return allBrands;
    }
    
    const cat = await this.getCategoryBySlug(categorySlug);
    const categoryId = cat ? cat.id : null;
    
    return allBrands.filter(brand => {
      if (!brand.categories) return true;
      try {
        const cats = typeof brand.categories === 'string' ? JSON.parse(brand.categories) : brand.categories;
        if (!cats || !Array.isArray(cats)) return true;
        if (cats.includes('all')) return true;
        if (cats.includes(categorySlug)) return true;
        if (categoryId && cats.includes(categoryId)) return true;
        return false;
      } catch {
        return true;
      }
    });
  },

  async getBrandBySlug(slug) {
    return await Brand.findOne({ where: { slug } });
  },

  async createBrand(brandData) {
    const slug = brandData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return await Brand.create({
      name: brandData.name,
      slug,
      logo: brandData.logo,
      website: brandData.website,
      categories: brandData.categories || []
    });
  },

  async getFlashSaleBanners() {
    const now = new Date();
    return await FlashSaleBanner.findAll({
      where: {
        is_active: true,
        [Op.and]: [
          {
            [Op.or]: [
              { start_date: { [Op.lte]: now } },
              { start_date: null }
            ]
          },
          {
            [Op.or]: [
              { end_date: { [Op.gte]: now } },
              { end_date: null }
            ]
          }
        ]
      },
      order: [['sort_order', 'ASC']]
    });
  },

  async getAllFlashSales() {
    return await FlashSaleBanner.findAll({ order: [['created_at', 'DESC']] });
  },

  async getFlashSaleById(id) {
    return await FlashSaleBanner.findByPk(id);
  },

  async createFlashSaleBanner(data) {
    return await FlashSaleBanner.create({
      title: data.title,
      subtitle: data.subtitle || '',
      description: data.description || '',
      image: data.image || '',
      link: data.link || '',
      is_active: data.is_active !== undefined ? data.is_active : true,
      sort_order: parseInt(data.sort_order) || 0,
      start_date: data.start_date || new Date(),
      end_date: data.end_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
  },

  async updateFlashSaleBanner(id, data) {
    const updates = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.subtitle !== undefined) updates.subtitle = data.subtitle;
    if (data.description !== undefined) updates.description = data.description;
    if (data.image !== undefined) updates.image = data.image;
    if (data.link !== undefined) updates.link = data.link;
    if (data.is_active !== undefined) updates.is_active = data.is_active;
    if (data.sort_order !== undefined) updates.sort_order = parseInt(data.sort_order);
    if (data.start_date !== undefined) updates.start_date = data.start_date;
    if (data.end_date !== undefined) updates.end_date = data.end_date;
    await FlashSaleBanner.update(updates, { where: { id } });
    return await FlashSaleBanner.findByPk(id);
  },

  async deleteFlashSaleBanner(id) {
    await FlashSaleBanner.destroy({ where: { id } });
    return { success: true };
  },

  async createProduct(productData) {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await Product.create({
      name: productData.name,
      slug,
      short_description: productData.shortDescription,
      description: productData.description,
      price: productData.price,
      original_price: productData.originalPrice || productData.price,
      discount: productData.discount || 0,
      category_id: productData.category_id,
      subcategory: productData.subcategory,
      brand: productData.brand,
      stock: productData.stock,
      is_featured: productData.isFeatured || false,
      is_flash_sale: productData.isFlashSale || false,
      is_hot_pick: productData.isHotPick || false,
      tags: productData.tags || [],
      specs: productData.specs || {},
      sku: productData.sku || ''
    });

    if (productData.images && productData.images.length > 0) {
      for (let i = 0; i < productData.images.length; i++) {
        await ProductImage.create({
          product_id: product.id,
          image_url: productData.images[i],
          sort_order: i,
          is_primary: i === 0
        });
      }
    }

    if (productData.videos && productData.videos.length > 0) {
      for (let i = 0; i < productData.videos.length; i++) {
        await ProductVideo.create({
          product_id: product.id,
          video_url: productData.videos[i],
          sort_order: i
        });
      }
    }

    return await this.getProductById(product.id);
  },

  async updateProduct(productId, updateData) {
    const allowedFields = ['name', 'short_description', 'description', 'price', 'original_price', 'stock', 'is_featured', 'is_flash_sale', 'is_hot_pick', 'sku', 'category_id', 'brand', 'subcategory', 'model_name', 'series'];
    const updates = {};
    
    for (const key of allowedFields) {
      if (updateData[key] !== undefined) updates[key] = updateData[key];
    }
    if (updateData.shortDescription) updates.short_description = updateData.shortDescription;
    if (updateData.originalPrice) updates.original_price = updateData.originalPrice;
    if (updateData.isFeatured !== undefined) updates.is_featured = updateData.isFeatured;
    if (updateData.isFlashSale !== undefined) updates.is_flash_sale = updateData.isFlashSale;
    if (updateData.isHotPick !== undefined) updates.is_hot_pick = updateData.isHotPick;
    if (updateData.tags) updates.tags = updateData.tags;
    if (updateData.specs) updates.specs = updateData.specs;
    if (updateData.brand !== undefined) updates.brand = updateData.brand;
    if (updateData.subcategory !== undefined) updates.subcategory = updateData.subcategory;
    if (updateData.model_name !== undefined) updates.model_name = updateData.model_name;
    if (updateData.series !== undefined) updates.series = updateData.series;
    if (updateData.category_id !== undefined) updates.category_id = updateData.category_id;
    
    if (Object.keys(updates).length > 0) {
      await Product.update(updates, { where: { id: productId } });
    }
    
    // Sync images with ProductImage table
    if (updateData.images !== undefined) {
      // Delete existing images
      await ProductImage.destroy({ where: { product_id: productId } });
      
      // Add new images
      if (updateData.images && updateData.images.length > 0) {
        for (let i = 0; i < updateData.images.length; i++) {
          await ProductImage.create({
            product_id: productId,
            image_url: updateData.images[i],
            sort_order: i,
            is_primary: i === 0
          });
        }
      }
    }
    
    return { success: true, product: await this.getProductById(productId) };
  },

  async deleteProduct(productId) {
    await Product.destroy({ where: { id: productId } });
    return { success: true };
  },

  async createCategory(categoryData) {
    const slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await Category.create({
      name: categoryData.name,
      slug,
      description: categoryData.description || ''
    });
    return category;
  },

  async updateCategory(categoryId, updateData) {
    const updates = {};
    if (updateData.name) {
      updates.name = updateData.name;
      updates.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (updateData.description !== undefined) updates.description = updateData.description;

    if (Object.keys(updates).length > 0) {
      await Category.update(updates, { where: { id: categoryId } });
    }

    return { success: true, category: await Category.findByPk(categoryId) };
  },

  async deleteCategory(categoryId) {
    await Category.destroy({ where: { id: categoryId } });
    return { success: true };
  },

  async getProductReviews(productId) {
    return await Review.findAll({
      where: { product_id: productId, is_approved: true },
      order: [['created_at', 'DESC']],
      include: [{ model: User, as: 'user', attributes: ['id', 'first_name', 'last_name'] }]
    });
  },

  async createReview(userId, productId, rating, title, comment) {
    const hasPurchased = await Order.findOne({
      where: { user_id: userId, status: 'delivered' },
      include: [{
        model: OrderItem,
        as: 'items',
        where: { product_id: productId }
      }]
    });

    const review = await Review.create({
      user_id: userId,
      product_id: productId,
      rating,
      title,
      comment,
      is_verified: !!hasPurchased
    });

    await this.updateProductRating(productId);
    return review;
  },

  async updateProductRating(productId) {
    const reviews = await Review.findAll({
      where: { product_id: productId, is_approved: true }
    });
    
    const count = reviews.length;
    const avgRating = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
    
    await Product.update(
      { ratings: avgRating, review_count: count },
      { where: { id: productId } }
    );
  }
};

const userService = {
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  },

  async findById(id) {
    return await User.findByPk(id);
  },

  async create(userData) {
    const existing = await this.findByEmail(userData.email);
    if (existing) {
      return { success: false, message: 'Email already registered' };
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      email: userData.email,
      password: hashedPassword,
      first_name: userData.firstName,
      last_name: userData.lastName,
      phone: userData.phone || '',
      role: userData.role || 'user'
    });

    const { password, ...userWithoutPassword } = user.toJSON();
    return { success: true, user: userWithoutPassword };
  },

  async login(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, message: 'Invalid email or password' };
    }

    const { password: pwd, ...userWithoutPassword } = user.toJSON();
    return { success: true, user: userWithoutPassword };
  },

  async getAddresses(userId) {
    return await UserAddress.findAll({ where: { user_id: userId } });
  },

  async getAddressById(addressId, userId) {
    return await UserAddress.findOne({ where: { id: addressId, user_id: userId } });
  },

  async getAllUsers() {
    return await User.findAll({
      attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'role', 'status', 'created_at']
    });
  },

  async getUserById(id) {
    return await User.findByPk(id, {
      attributes: ['id', 'email', 'first_name', 'last_name', 'phone', 'avatar', 'role', 'status', 'created_at']
    });
  },

  async updateUserStatus(userId, status) {
    await User.update({ status }, { where: { id: userId } });
    return { success: true };
  }
};

const orderService = {
  async createOrder(session, orderData) {
    if (!session.user) {
      return { success: false, message: 'Please login to place order' };
    }

    const cartItems = session.cart || [];

    if (cartItems.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }

    const { Product: ProductModel } = require('./models');
    
    for (const item of cartItems) {
      const product = await ProductModel.findByPk(item.productId);
      if (!product) {
        return { success: false, message: `${item.name} no longer available` };
      }
      if (item.quantity > product.stock) {
        return { success: false, message: `${item.name} has insufficient stock` };
      }
    }

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = orderData.shippingMethod === 'express' ? 14.99 : (orderData.shippingMethod === 'overnight' ? 39.99 : (subtotal >= 100 ? 0 : 9.99));
    const shippingLabel = shippingCost === 0 ? 'Free Shipping' : (orderData.shippingMethod === 'express' ? 'Express Shipping' : (orderData.shippingMethod === 'overnight' ? 'Overnight Shipping' : 'Standard Shipping'));
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + shippingCost + tax;
    const orderNumber = generateOrderNumber();

    const t = await sequelize.transaction();

    try {
      const order = await Order.create({
        order_number: orderNumber,
        user_id: session.user.id,
        subtotal,
        shipping_cost: shippingCost,
        shipping_label: shippingLabel,
        tax,
        total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: orderData.paymentMethod,
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }, { transaction: t });

      await OrderAddress.create({
        order_id: order.id,
        full_name: orderData.shippingAddress.fullName,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email || session.user.email,
        street: orderData.shippingAddress.street,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state || '',
        zip_code: orderData.shippingAddress.zipCode || '',
        country: orderData.shippingAddress.country || 'United States'
      }, { transaction: t });

      for (const item of cartItems) {
        await OrderItem.create({
          order_id: order.id,
          product_id: item.productId,
          name: item.name,
          image: item.image || '',
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity
        }, { transaction: t });

        await ProductModel.update(
          { stock: sequelize.literal(`stock - ${item.quantity}`), sold_count: sequelize.literal(`sold_count + ${item.quantity}`) },
          { where: { id: item.productId }, transaction: t }
        );
      }

      await OrderTimeline.create({
        order_id: order.id,
        status: 'pending',
        note: 'Order placed'
      }, { transaction: t });

      session.cart = [];

      await t.commit();

      const fullOrder = await Order.findByPk(order.id, {
        include: [
          { model: OrderItem, as: 'items' },
          { model: OrderAddress, as: 'shippingAddress' }
        ]
      });

      return { success: true, orderId: order.id, orderNumber: order.order_number, order: fullOrder ? fullOrder.toJSON() : null };
    } catch (error) {
      await t.rollback();
      console.error('Order creation error:', error);
      return { success: false, message: error.message };
    }
  },

  async getUserOrders(userId, options = {}) {
    const where = { user_id: userId };
    if (options.status && options.status !== 'all') where.status = options.status;

    const page = parseInt(options.page) || 1;
    const limit = parseInt(options.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows: orders, count: totalOrders } = await Order.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset,
      include: [
        { model: OrderItem, as: 'items' },
        { model: OrderAddress, as: 'shippingAddress' }
      ]
    });

    return { orders, totalOrders, totalPages: Math.ceil(totalOrders / limit), currentPage: page };
  },

  async getOrderById(orderId, userId = null) {
    const order = await Order.findByPk(orderId, {
      include: [
        { model: OrderItem, as: 'items' },
        { model: OrderAddress, as: 'shippingAddress' },
        { model: OrderTimeline, as: 'timeline', order: [['created_at', 'ASC']] }
      ]
    });
    if (!order) return null;
    if (userId && order.user_id !== userId) return null;
    return order.toJSON();
  },

  async getOrderByOrderNumber(orderNumber) {
    const order = await Order.findOne({
      where: { order_number: orderNumber },
      include: [
        { model: OrderItem, as: 'items' },
        { model: OrderAddress, as: 'shippingAddress' }
      ]
    });
    if (!order) return null;
    
    const timeline = await OrderTimeline.findAll({
      where: { order_id: order.id },
      order: [['created_at', 'ASC']]
    });
    
    return {
      ...order.toJSON(),
      timeline: timeline.map(t => t.toJSON())
    };
  },

  async getOrderTimeline(orderId) {
    return await OrderTimeline.findAll({
      where: { order_id: orderId },
      order: [['created_at', 'ASC']]
    });
  },

  async getAllOrders() {
    return await Order.findAll({
      order: [['created_at', 'DESC']],
      include: [
        { model: OrderItem, as: 'items' },
        { model: User, as: 'user', attributes: ['id', 'email', 'first_name', 'last_name'] },
        { model: OrderAddress, as: 'shippingAddress' }
      ]
    });
  },

  async getOrdersByUserId(userId) {
    return await Order.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      include: [{ model: OrderItem, as: 'items' }]
    });
  },

  async updateOrderStatus(orderId, status) {
    const updates = { status };
    if (status === 'delivered') updates.delivered_at = new Date();

    await Order.update(updates, { where: { id: orderId } });

    const statusNotes = {
      pending: 'Order placed',
      confirmed: 'Payment confirmed',
      processing: 'Order is being processed',
      shipped: 'Order has been shipped',
      delivered: 'Order has been delivered',
      cancelled: 'Order has been cancelled'
    };

    await OrderTimeline.create({
      order_id: orderId,
      status,
      note: statusNotes[status] || 'Status updated'
    });
    
    return { success: true, order: await this.getOrderById(orderId) };
  }
};

module.exports = {
  productService,
  userService,
  orderService
};
