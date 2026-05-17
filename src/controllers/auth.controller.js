// Auth Controller - Handles authentication requests

const { userService } = require('../database/service');
const notificationService = require('../services/notification.service');

class AuthController {
  // GET /auth/login - Login page
  getLoginPage(req, res) {
    if (req.session.user) {
      return res.redirect('/user/profile');
    }
    
    res.render('pages/auth/login', {
      title: 'Login - SegzTech',
      currentRoute: 'login',
      error: null,
      success: req.query.registered ? 'Registration successful! Please login.' : null
    });
  }
  
  // POST /auth/login - Handle login
  async postLogin(req, res) {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.render('pages/auth/login', {
          title: 'Login - SegzTech',
          currentRoute: 'login',
          error: 'Please enter email and password',
          success: null
        });
      }
      
      const result = await userService.login(email, password);
      
      if (!result.success) {
        return res.render('pages/auth/login', {
          title: 'Login - SegzTech',
          currentRoute: 'login',
          error: result.message,
          success: null
        });
      }
      
      req.session.user = result.user;
      
      const redirectUrl = req.session.returnTo || '/user/profile';
      delete req.session.returnTo;
      
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Login error:', error);
      res.render('pages/auth/login', {
        title: 'Login - SegzTech',
        currentRoute: 'login',
        error: 'An error occurred. Please try again.',
        success: null
      });
    }
  }
  
  // GET /auth/register - Register page
  getRegisterPage(req, res) {
    if (req.session.user) {
      return res.redirect('/user/profile');
    }
    
    res.render('pages/auth/register', {
      title: 'Register - SegzTech',
      currentRoute: 'register',
      error: null,
      success: null
    });
  }
  
  // POST /auth/register - Handle registration
  async postRegister(req, res) {
    try {
      const { firstName, lastName, email, password, confirmPassword, phone } = req.body;
      
      if (!firstName || !lastName || !email || !password) {
        return res.render('pages/auth/register', {
          title: 'Register - SegzTech',
          currentRoute: 'register',
          error: 'Please fill in all required fields',
          success: null
        });
      }
      
      if (password !== confirmPassword) {
        return res.render('pages/auth/register', {
          title: 'Register - SegzTech',
          currentRoute: 'register',
          error: 'Passwords do not match',
          success: null
        });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.render('pages/auth/register', {
          title: 'Register - SegzTech',
          currentRoute: 'register',
          error: 'Please enter a valid email address',
          success: null
        });
      }
      
      if (password.length < 6) {
        return res.render('pages/auth/register', {
          title: 'Register - SegzTech',
          currentRoute: 'register',
          error: 'Password must be at least 6 characters',
          success: null
        });
      }
      
      const result = await userService.create({
        firstName,
        lastName,
        email,
        password,
        phone
      });
      
      if (!result.success) {
        return res.render('pages/auth/register', {
          title: 'Register - SegzTech',
          currentRoute: 'register',
          error: result.message,
          success: null
        });
      }
      
      await notificationService.createNotification('signup', 'New User Registration', `${firstName} ${lastName} (${email}) has registered`, {
        userId: result.user?.id,
        firstName,
        lastName,
        email
      });
      
      res.redirect('/auth/login?registered=true');
    } catch (error) {
      console.error('Registration error:', error);
      res.render('pages/auth/register', {
        title: 'Register - SegzTech',
        currentRoute: 'register',
        error: 'An error occurred. Please try again.',
        success: null
      });
    }
  }

  // GET /auth/logout - Logout
  getLogout(req, res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
      }
      res.redirect('/');
    });
  }
}

module.exports = new AuthController();
