const nodemailer = require('nodemailer');

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
}

const emailService = {
  async sendEmail(emailData) {
    const { to, subject, html } = emailData;
    const fromName = process.env.FROM_NAME || 'SegzTech';
    const fromEmail = process.env.FROM_EMAIL || 'noreply@segztech.com';
    const tp = getTransporter();
    if (tp) {
      try {
        await tp.sendMail({ from: `"${fromName}" <${fromEmail}>`, to, subject, html });
        console.log('Email sent to:', to, 'Subject:', subject);
        return { success: true, message: 'Email sent' };
      } catch (error) {
        console.error('Email send failed:', error.message);
        return { success: false, message: error.message };
      }
    }
    console.log('===========================================');
    console.log('EMAIL (no SMTP configured):');
    console.log('To:', to);
    console.log('Subject:', subject);
    console.log('===========================================');
    return { success: true, message: 'Email logged (no SMTP configured)' };
  },

  async sendBulkProductNotification(product, users) {
    const emails = users.map(user => this.sendEmail({
      to: user.email,
      subject: `New Product: ${product.name}`,
      html: this.getProductEmailTemplate(product)
    }));
    return Promise.all(emails);
  },

  getProductEmailTemplate(product) {
    const imageUrl = product.images && product.images[0] ? product.images[0] : '';
    const discount = product.originalPrice > product.price
      ? Math.round((1 - product.price / product.originalPrice) * 100)
      : 0;
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    return `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f5f5f5;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
            <div style="background:linear-gradient(135deg,#ff6a00 0%,#ff4500 100%);padding:30px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:24px;">New Product Available!</h1>
            </div>
            <div style="padding:30px;">
              ${imageUrl ? `<img src="${imageUrl}" alt="${product.name}" style="width:100%;max-height:300px;object-fit:cover;border-radius:8px;margin-bottom:20px;">` : ''}
              <h2 style="color:#333;margin:0 0 10px;">${product.name}</h2>
              ${product.brand ? `<p style="color:#666;margin:0 0 20px;"><strong>Brand:</strong> ${product.brand}</p>` : ''}
              ${product.shortDescription ? `<p style="color:#555;line-height:1.6;margin-bottom:20px;">${product.shortDescription}</p>` : ''}
              <div style="background:#f9f9f9;padding:20px;border-radius:8px;text-align:center;margin-bottom:20px;">
                <span style="font-size:32px;font-weight:bold;color:#ff6a00;">₦${product.price.toFixed(2)}</span>
                ${discount > 0 ? `<span style="text-decoration:line-through;color:#999;margin-left:10px;">₦${product.originalPrice.toFixed(2)}</span><span style="background:#ff6a00;color:#fff;padding:4px 8px;border-radius:4px;font-size:14px;margin-left:10px;">-${discount}%</span>` : ''}
              </div>
              <a href="${siteUrl}/products/${product.id}" style="display:block;background:linear-gradient(135deg,#ff6a00 0%,#ff4500 100%);color:#fff;text-decoration:none;padding:16px 32px;border-radius:8px;text-align:center;font-weight:bold;font-size:16px;">Shop Now</a>
            </div>
            <div style="background:#f5f5f5;padding:20px;text-align:center;border-top:1px solid #eee;">
              <p style="color:#999;font-size:12px;margin:0;">
                You're receiving this email because you subscribed to product notifications from ${process.env.FROM_NAME || 'SegzTech'}.<br>
                <a href="#" style="color:#ff6a00;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  async sendOrderConfirmation(order, user) {
    return this.sendEmail({
      to: user.email,
      subject: `Order Confirmation #${order.orderNumber}`,
      html: `<h2>Thank you for your order!</h2><p>Your order #${order.orderNumber} has been received.</p><p>Total: ₦${order.total.toFixed(2)}</p><p>We'll notify you when your order ships.</p>`
    });
  },

  async sendOrderStatusUpdate(order, user, status) {
    return this.sendEmail({
      to: user.email,
      subject: `Order #${order.orderNumber} - Status Update`,
      html: `<h2>Your order status has been updated</h2><p>Order #${order.orderNumber}</p><p>New Status: <strong>${status}</strong></p>${status === 'shipped' ? '<p>Track your package using the tracking number provided in your order details.</p>' : ''}`
    });
  }
};

module.exports = emailService;
