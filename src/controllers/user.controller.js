// User Controller - Handles user profile requests

const { userService, orderService } = require('../database/service');
const bcrypt = require('bcryptjs');
const { User, UserAddress } = require('../database/models');

function formatSessionUser(sessionUser) {
  if (!sessionUser) return null;
  return {
    id: sessionUser.id,
    firstName: sessionUser.first_name || '',
    lastName: sessionUser.last_name || '',
    email: sessionUser.email || '',
    phone: sessionUser.phone || '',
    avatar: sessionUser.avatar || '/images/default-avatar.png',
    role: sessionUser.role || 'user',
    status: sessionUser.status || 'active',
    createdAt: sessionUser.created_at
  };
}

class UserController {
  isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    req.session.returnTo = req.originalUrl;
    res.redirect('/auth/login');
  }

  async getProfile(req, res) {
    try {
      const user = formatSessionUser(req.session.user);
      const orders = await orderService.getUserOrders(user.id, { limit: 1000 });
      
      const stats = {
        total: orders.totalOrders,
        pending: orders.orders.filter(o => o.status === 'pending').length,
        processing: orders.orders.filter(o => o.status === 'processing').length,
        shipped: orders.orders.filter(o => o.status === 'shipped').length,
        delivered: orders.orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.orders.filter(o => o.status === 'cancelled').length,
        totalSpent: orders.orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + parseFloat(o.total), 0)
      };
      
      res.render('pages/user/profile', {
        title: 'My Profile - SegzTech',
        currentRoute: 'profile',
        user,
        stats,
        success: req.query.updated ? 'Profile updated successfully' : null,
        error: null
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      res.render('pages/user/profile', {
        title: 'My Profile - SegzTech',
        currentRoute: 'profile',
        user: req.session.user ? formatSessionUser(req.session.user) : null,
        stats: { total: 0, totalSpent: 0 },
        success: null,
        error: 'Failed to load profile'
      });
    }
  }
  
  async postProfile(req, res) {
    try {
      const { firstName, lastName, phone } = req.body;
      const userId = req.session.user.id;
      
      await User.update(
        { first_name: firstName, last_name: lastName, phone: phone },
        { where: { id: userId } }
      );
      
      req.session.user.first_name = firstName;
      req.session.user.last_name = lastName;
      req.session.user.phone = phone;
      
      res.redirect('/user/profile?updated=true');
    } catch (error) {
      console.error('Profile update error:', error);
      res.redirect('/user/profile?error=1');
    }
  }

  getPasswordPage(req, res) {
    res.render('pages/user/password', {
      title: 'Change Password - SegzTech',
      currentRoute: 'password',
      user: formatSessionUser(req.session.user),
      success: req.query.changed ? 'Password changed successfully' : null,
      error: req.query.error || null
    });
  }

  async postPassword(req, res) {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;
      
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.render('pages/user/password', {
          title: 'Change Password - SegzTech',
          currentRoute: 'password',
          user: formatSessionUser(req.session.user),
          success: null,
          error: 'Please fill in all fields'
        });
      }
      
      if (newPassword !== confirmPassword) {
        return res.render('pages/user/password', {
          title: 'Change Password - SegzTech',
          currentRoute: 'password',
          user: formatSessionUser(req.session.user),
          success: null,
          error: 'New passwords do not match'
        });
      }
      
      if (newPassword.length < 6) {
        return res.render('pages/user/password', {
          title: 'Change Password - SegzTech',
          currentRoute: 'password',
          user: formatSessionUser(req.session.user),
          success: null,
          error: 'Password must be at least 6 characters'
        });
      }
      
      const user = await User.findByPk(req.session.user.id);
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.render('pages/user/password', {
          title: 'Change Password - SegzTech',
          currentRoute: 'password',
          user: formatSessionUser(req.session.user),
          success: null,
          error: 'Current password is incorrect'
        });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.update({ password: hashedPassword }, { where: { id: req.session.user.id } });
      
      res.redirect('/user/password?changed=true');
    } catch (error) {
      console.error('Password change error:', error);
      res.redirect('/user/password?error=Failed to change password');
    }
  }

  async getAddresses(req, res) {
    try {
      const addresses = await userService.getAddresses(req.session.user.id);
      const formattedAddresses = addresses.map(addr => {
        const a = addr.toJSON ? addr.toJSON() : addr;
        return {
          id: a.id,
          label: a.label || '',
          fullName: a.full_name || '',
          phone: a.phone || '',
          street: a.street || '',
          city: a.city || '',
          state: a.state || '',
          zipCode: a.zip_code || '',
          country: a.country || 'United States',
          isDefault: a.is_default || false
        };
      });
      
      res.render('pages/user/addresses', {
        title: 'My Addresses - SegzTech',
        currentRoute: 'addresses',
        user: formatSessionUser(req.session.user),
        addresses: formattedAddresses,
        success: req.query.updated ? 'Address saved successfully' : null,
        error: null
      });
    } catch (error) {
      console.error('Error loading addresses:', error);
      res.render('pages/user/addresses', {
        title: 'My Addresses - SegzTech',
        currentRoute: 'addresses',
        user: formatSessionUser(req.session.user),
        addresses: [],
        success: null,
        error: 'Failed to load addresses'
      });
    }
  }

  async addAddress(req, res) {
    try {
      const { label, fullName, phone, street, city, state, zipCode, country, isDefault } = req.body;
      const userId = req.session.user.id;
      
      if (isDefault === 'on') {
        await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
      }
      
      await UserAddress.create({
        user_id: userId,
        label: label || '',
        full_name: fullName,
        phone: phone,
        street: street,
        city: city,
        state: state,
        zip_code: zipCode,
        country: country || 'United States',
        is_default: isDefault === 'on' ? true : false
      });
      
      res.redirect('/user/addresses?updated=true');
    } catch (error) {
      console.error('Add address error:', error);
      res.redirect('/user/addresses?error=Failed to add address');
    }
  }

  async updateAddress(req, res) {
    try {
      const { label, fullName, phone, street, city, state, zipCode, country, isDefault } = req.body;
      const userId = req.session.user.id;
      const { id } = req.params;
      
      const address = await UserAddress.findOne({ where: { id, user_id: userId } });
      if (!address) {
        return res.redirect('/user/addresses?error=Address not found');
      }
      
      if (isDefault === 'on') {
        await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
      }
      
      await address.update({
        label: label || '',
        full_name: fullName,
        phone: phone,
        street: street,
        city: city,
        state: state,
        zip_code: zipCode,
        country: country || 'United States',
        is_default: isDefault === 'on' ? true : false
      });
      
      res.redirect('/user/addresses?updated=true');
    } catch (error) {
      console.error('Update address error:', error);
      res.redirect('/user/addresses?error=Failed to update address');
    }
  }

  async deleteAddress(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;
      
      await UserAddress.destroy({ where: { id, user_id: userId } });
      
      res.redirect('/user/addresses?updated=true');
    } catch (error) {
      console.error('Delete address error:', error);
      res.redirect('/user/addresses?error=Failed to delete address');
    }
  }

  async setDefaultAddress(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.user.id;
      
      await UserAddress.update({ is_default: false }, { where: { user_id: userId } });
      await UserAddress.update({ is_default: true }, { where: { id, user_id: userId } });
      
      res.redirect('/user/addresses?updated=true');
    } catch (error) {
      console.error('Set default address error:', error);
      res.redirect('/user/addresses?error=Failed to set default address');
    }
  }
}

module.exports = new UserController();
