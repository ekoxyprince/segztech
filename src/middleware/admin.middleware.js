// Admin Middleware
const isAdmin = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.user) {
    return res.redirect('/admin/login');
  }
  
  // Check if user is admin
  if (req.session.user.role !== 'admin') {
    return res.status(403).render('pages/error', {
      title: 'Access Denied',
      message: 'You do not have permission to access this page.',
      currentRoute: ''
    });
  }
  
  next();
};

const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/admin/login');
  }
  next();
};

module.exports = {
  isAdmin,
  isAuthenticated
};
