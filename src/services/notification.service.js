const { Notification, ContactMessage } = require('../database/models');
const emailService = require('./email.service');

const adminEmail = process.env.ADMIN_EMAIL || 'admin@segztech.com';

const notificationService = {
  async createNotification(type, title, message, data = {}) {
    try {
      const notification = await Notification.create({
        type,
        title,
        message,
        data
      });

      await this.sendAdminEmail(type, title, message, data);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  async sendAdminEmail(type, title, message, data) {
    try {
      let subject, html;

      switch (type) {
        case 'order':
          subject = `New Order: ${data.orderNumber || title}`;
          html = `
            <h2>New Order Placed</h2>
            <p><strong>Order Number:</strong> ${data.orderNumber || 'N/A'}</p>
            <p><strong>Customer:</strong> ${data.customerName || 'N/A'}</p>
            <p><strong>Email:</strong> ${data.customerEmail || 'N/A'}</p>
            <p><strong>Total:</strong> ₦${data.total || '0.00'}</p>
            <p>${message}</p>
            <hr>
            <p><a href="${process.env.BASE_URL || 'http://localhost:3000'}/admin/orders/${data.orderId}">View Order in Admin</a></p>
          `;
          break;
        case 'signup':
          subject = `New User Registration: ${data.firstName} ${data.lastName}`;
          html = `
            <h2>New User Registration</h2>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p>${message}</p>
          `;
          break;
        case 'message':
          subject = `New Contact Message: ${data.subject || title}`;
          html = `
            <h2>New Contact Form Message</h2>
            <p><strong>From:</strong> ${data.name} (${data.email})</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p>${message}</p>
            <hr>
            <p><a href="${process.env.BASE_URL || 'http://localhost:3000'}/admin/messages">View Message in Admin</a></p>
          `;
          break;
        default:
          subject = `Notification: ${title}`;
          html = `<h2>${title}</h2><p>${message}</p>`;
      }

      await emailService.sendEmail({
        to: adminEmail,
        subject,
        html
      });
    } catch (error) {
      console.error('Error sending admin email:', error);
    }
  },

  async getUnreadCount() {
    return await Notification.count({ where: { is_read: false } });
  },

  async getNotifications(page = 1, limit = 20, type = null) {
    const where = {};
    if (type) where.type = type;

    const offset = (page - 1) * limit;
    const { rows, count } = await Notification.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      notifications: rows.map(n => n.toJSON()),
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  },

  async markAsRead(id) {
    await Notification.update({ is_read: true }, { where: { id } });
  },

  async markAllAsRead() {
    await Notification.update({ is_read: true }, { where: { is_read: false } });
  },

  async deleteNotification(id) {
    await Notification.destroy({ where: { id } });
  },

  async clearAll() {
    await Notification.destroy({ where: {} });
  },

  async getStats() {
    const total = await Notification.count();
    const unread = await Notification.count({ where: { is_read: false } });
    const orders = await Notification.count({ where: { type: 'order' } });
    const signups = await Notification.count({ where: { type: 'signup' } });

    return { total, unread, orders, signups };
  },

  async createContactMessage(name, email, subject, message) {
    try {
      const contactMsg = await ContactMessage.create({
        name,
        email,
        subject,
        message
      });
      return contactMsg;
    } catch (error) {
      console.error('Error creating contact message:', error);
      return null;
    }
  },

  async getContactMessages(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { rows, count } = await ContactMessage.findAndCountAll({
      order: [['created_at', 'DESC']],
      limit,
      offset
    });

    return {
      messages: rows.map(m => m.toJSON()),
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    };
  },

  async getUnreadMessageCount() {
    return await ContactMessage.count({ where: { is_read: false } });
  },

  async markMessageAsRead(id) {
    await ContactMessage.update({ is_read: true }, { where: { id } });
  },

  async deleteMessage(id) {
    await ContactMessage.destroy({ where: { id } });
  }
};

module.exports = notificationService;
