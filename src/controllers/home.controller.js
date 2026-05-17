// Home Controller - Handles home page requests

const { productService } = require('../database/service');
const notificationService = require('../services/notification.service');

class HomeController {
  // GET / - Home page
  async getHomePage(req, res) {
    try {
      const [banners, categories, featuredProducts, flashSaleProducts, hotPicks, brands, allFlashSales] = await Promise.all([
        productService.getFlashSaleBanners(),
        productService.getCategories(),
        productService.getFeaturedProducts(8),
        productService.getFlashSaleProducts(8),
        productService.getHotPicks(8),
        productService.getBrands(),
        productService.getAllFlashSales()
      ]);

      // Show flash sale section when there are flash sale products AND an active banner
      const now = new Date();
      let flashSaleEndDate = null;
      let showFlashSale = false;
      if (flashSaleProducts.length > 0) {
        const activeFlashSale = allFlashSales.find(s => {
          if (!s.is_active) return false;
          const startOk = !s.start_date || new Date(s.start_date) <= now;
          const endOk = !s.end_date || new Date(s.end_date) >= now;
          return startOk && endOk;
        });
        showFlashSale = !!activeFlashSale;
        if (activeFlashSale && activeFlashSale.end_date) {
          flashSaleEndDate = activeFlashSale.end_date;
        }
      }

      const newArrivals = await productService.getAllProducts({ limit: 8, sort: 'newest' });
      const bestSellers = await productService.getAllProducts({ limit: 8, sort: 'popular' });
      
      res.render('pages/home', {
        title: 'SegzTech - Premium Gadgets & Electronics',
        currentRoute: 'home',
        banners,
        categories,
        featuredProducts,
        flashSaleProducts,
        showFlashSale,
        flashSaleEndDate,
        hotPicks,
        newArrivals: newArrivals.products,
        bestSellers: bestSellers.products,
        brands
      });
    } catch (error) {
      console.error('Error loading home page:', error);
      res.status(500).render('pages/error', {
        title: 'Error',
        message: 'Unable to load home page',
        currentRoute: ''
      });
    }
  }
  
  // GET /about - About page
  async getAboutPage(req, res) {
    res.render('pages/about', {
      title: 'About Us - SegzTech',
      currentRoute: 'about'
    });
  }
  
  // GET /contact - Contact page
  async getContactPage(req, res) {
    res.render('pages/contact', {
      title: 'Contact Us - SegzTech',
      currentRoute: 'contact'
    });
  }

  // POST /contact - Handle contact form submission
  async postContact(req, res) {
    try {
      const { name, email, subject, message } = req.body;

      if (!name || !email || !subject || !message) {
        return res.render('pages/contact', {
          title: 'Contact Us - SegzTech',
          currentRoute: 'contact',
          success: null,
          error: 'Please fill in all fields'
        });
      }

      const contactMsg = await notificationService.createContactMessage(name, email, subject, message);

      if (!contactMsg) {
        return res.render('pages/contact', {
          title: 'Contact Us - SegzTech',
          currentRoute: 'contact',
          success: null,
          error: 'Failed to send message. Please try again.'
        });
      }

      await notificationService.createNotification('message', 'New Contact Message', `${name} (${email}) sent a message: "${subject}"`, {
        messageId: contactMsg.id,
        name,
        email,
        subject
      });

      res.render('pages/contact', {
        title: 'Contact Us - SegzTech',
        currentRoute: 'contact',
        success: 'Your message has been sent successfully. We will get back to you soon.',
        error: null
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.render('pages/contact', {
        title: 'Contact Us - SegzTech',
        currentRoute: 'contact',
        success: null,
        error: 'Failed to send message. Please try again.'
      });
    }
  }
}

module.exports = new HomeController();
