// ==========================================
// FILE: server/src/utils/emailTemplates.js
// ==========================================

/**
 * Welcome Email Template
 * Sent when a new user registers
 */
const getWelcomeEmailTemplate = (userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .content h2 {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 15px;
        }
        .content p {
          color: #4b5563;
          margin-bottom: 15px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #f43f5e;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background: #e11d48;
        }
        .features {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          border-left: 4px solid #f43f5e;
        }
        .features h3 {
          color: #f43f5e;
          margin-top: 0;
        }
        .features ul {
          list-style: none;
          padding: 0;
        }
        .features li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        .features li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #f43f5e;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #f43f5e;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Cosmetic Shop! 🌸</h1>
        </div>
        <div class="content">
          <h2>Hi ${userName}!</h2>
          <p>Thank you for joining our beauty community. We're thrilled to have you!</p>
          
          <p>Get ready to explore our curated collection of premium cosmetics and skincare products designed to help you look and feel your best.</p>
          
          <div style="text-align: center;">
            <a href="${
              process.env.CLIENT_URL
            }/shop" class="button">Start Shopping</a>
          </div>

          <div class="features">
            <h3>What You Can Do:</h3>
            <ul>
              <li>Browse our exclusive collection of beauty products</li>
              <li>Get personalized product recommendations</li>
              <li>Read reviews from our community</li>
              <li>Track your orders in real-time</li>
              <li>Enjoy exclusive member discounts</li>
            </ul>
          </div>

          <p>If you have any questions, our customer service team is always here to help. Feel free to reach out!</p>

          <p style="margin-top: 30px;">
            <strong>Happy Shopping!</strong><br>
            The Cosmetic Shop Team
          </p>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> |
            <a href="#">Instagram</a> |
            <a href="#">Twitter</a>
          </div>
          <p>© ${new Date().getFullYear()} Cosmetic Shop. All rights reserved.</p>
          <p style="font-size: 12px; color: #9ca3af;">
            You received this email because you registered at Cosmetic Shop.<br>
            <a href="${
              process.env.CLIENT_URL
            }" style="color: #f43f5e;">Visit our website</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Order Confirmation Email Template
 * Sent when an order is successfully placed
 */
const getOrderConfirmationTemplate = (order, userName) => {
  const itemsHTML = order.orderItems
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 15px 10px;">
        <img src="${item.image}" alt="${item.name}" 
             style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;">
      </td>
      <td style="padding: 15px 10px;">
        <strong>${item.name}</strong>
      </td>
      <td style="padding: 15px 10px; text-align: center;">
        x${item.quantity}
      </td>
      <td style="padding: 15px 10px; text-align: right;">
        <strong>$${item.price.toFixed(2)}</strong>
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .order-number {
          background: rgba(255, 255, 255, 0.2);
          padding: 10px 20px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 10px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
        }
        .order-summary {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          margin: 20px 0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #f3f4f6;
          padding: 12px 10px;
          text-align: left;
          font-weight: bold;
          color: #1f2937;
        }
        .total-row {
          background: #f9fafb;
          font-weight: bold;
          font-size: 18px;
        }
        .total-row td {
          padding: 15px 10px !important;
        }
        .info-box {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .info-box h3 {
          color: #f43f5e;
          margin-top: 0;
          font-size: 16px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #f43f5e;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! ✨</h1>
          <div class="order-number">
            Order #${order._id.toString().slice(-8).toUpperCase()}
          </div>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937;">Hi ${userName}!</h2>
          <p style="color: #4b5563;">
            Thank you for your order! We're processing it and will ship it soon.
          </p>
          
          <div class="order-summary">
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td colspan="3" style="padding: 10px; text-align: right; color: #6b7280;">
                    Subtotal:
                  </td>
                  <td style="padding: 10px; text-align: right;">
                    $${order.itemsPrice.toFixed(2)}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td colspan="3" style="padding: 10px; text-align: right; color: #6b7280;">
                    Shipping:
                  </td>
                  <td style="padding: 10px; text-align: right;">
                    $${order.shippingPrice.toFixed(2)}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td colspan="3" style="padding: 10px; text-align: right; color: #6b7280;">
                    Tax:
                  </td>
                  <td style="padding: 10px; text-align: right;">
                    $${order.taxPrice.toFixed(2)}
                  </td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" style="padding: 15px 10px; text-align: right; border-top: 2px solid #e5e7eb;">
                    Total:
                  </td>
                  <td style="padding: 15px 10px; text-align: right; border-top: 2px solid #e5e7eb; color: #f43f5e;">
                    $${order.totalPrice.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="info-box">
            <h3>Shipping Address:</h3>
            <p style="margin: 5px 0;">
              <strong>${order.shippingAddress.fullName}</strong><br>
              ${order.shippingAddress.addressLine1}<br>
              ${
                order.shippingAddress.addressLine2
                  ? order.shippingAddress.addressLine2 + "<br>"
                  : ""
              }
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${
    order.shippingAddress.zipCode
  }<br>
              ${order.shippingAddress.country}
            </p>
          </div>

          <div class="info-box">
            <h3>Payment Method:</h3>
            <p style="margin: 5px 0;">
              ${order.paymentMethod.toUpperCase()}
            </p>
          </div>

          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/profile/orders/${
    order._id
  }" class="button">
              Track Your Order
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            <strong>Need help?</strong><br>
            Contact our customer service team at support@cosmeticshop.com
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetic Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Password Reset Email Template
 * Sent when user requests password reset
 */
const getPasswordResetTemplate = (resetUrl, userName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 14px 35px;
          background: #f43f5e;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
          font-size: 16px;
        }
        .button:hover {
          background: #e11d48;
        }
        .warning {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .warning strong {
          color: #dc2626;
        }
        .link-box {
          background: white;
          padding: 15px;
          margin: 20px 0;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          word-break: break-all;
          font-size: 12px;
          color: #6b7280;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request 🔐</h1>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937;">Hi ${userName}!</h2>
          <p style="color: #4b5563;">
            We received a request to reset your password for your Cosmetic Shop account.
          </p>
          
          <p style="color: #4b5563;">
            Click the button below to create a new password:
          </p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>

          <div class="warning">
            <strong>⚠️ Important Security Information:</strong>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>This link will expire in 30 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your password won't change unless you click the link above</li>
              <li>Never share your password with anyone</li>
            </ul>
          </div>
          
          <p style="color: #4b5563;">
            <strong>Link not working?</strong> Copy and paste this URL into your browser:
          </p>
          
          <div class="link-box">
            ${resetUrl}
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            If you didn't request a password reset, you can safely ignore this email. 
            Your account is secure and your password hasn't been changed.
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetic Shop. All rights reserved.</p>
          <p style="font-size: 12px;">
            For security reasons, this email was automatically sent from an unmonitored address. 
            Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Order Status Update Email Template
 * Sent when order status changes
 */
const getOrderStatusUpdateTemplate = (order, userName, status) => {
  const statusMessages = {
    processing: {
      title: "Order Processing",
      icon: "⚡",
      message: "Your order is being prepared and will be shipped soon!",
    },
    shipped: {
      title: "Order Shipped",
      icon: "📦",
      message: "Great news! Your order is on its way to you.",
    },
    delivered: {
      title: "Order Delivered",
      icon: "🎉",
      message: "Your order has been delivered. We hope you love your products!",
    },
    cancelled: {
      title: "Order Cancelled",
      icon: "❌",
      message: "Your order has been cancelled as requested.",
    },
  };

  const statusInfo = statusMessages[status] || statusMessages.processing;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0 0 10px 0;
          font-size: 28px;
        }
        .header .icon {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .status-badge {
          display: inline-block;
          padding: 10px 20px;
          background: #10b981;
          color: white;
          border-radius: 20px;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 14px;
          margin: 20px 0;
        }
        .order-info {
          background: white;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .tracking-box {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .tracking-box strong {
          color: #92400e;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #f43f5e;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="icon">${statusInfo.icon}</div>
          <h1>${statusInfo.title}</h1>
          <p style="margin: 0; font-size: 16px;">
            Order #${order._id.toString().slice(-8).toUpperCase()}
          </p>
        </div>
        
        <div class="content">
          <h2 style="color: #1f2937;">Hi ${userName}!</h2>
          
          <div style="text-align: center;">
            <span class="status-badge">${status.toUpperCase()}</span>
          </div>
          
          <p style="color: #4b5563; font-size: 16px; text-align: center;">
            <strong>${statusInfo.message}</strong>
          </p>
          
          ${
            status === "shipped" && order.trackingNumber
              ? `
            <div class="tracking-box">
              <p style="margin: 0;"><strong>Tracking Number:</strong></p>
              <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #92400e;">
                ${order.trackingNumber}
              </p>
            </div>
          `
              : ""
          }

          <div class="order-info">
            <h3 style="color: #f43f5e; margin-top: 0;">Order Details</h3>
            <p style="margin: 5px 0;">
              <strong>Order Number:</strong> #${order._id
                .toString()
                .slice(-8)
                .toUpperCase()}<br>
              <strong>Order Date:</strong> ${new Date(
                order.createdAt
              ).toLocaleDateString()}<br>
              <strong>Total Amount:</strong> $${order.totalPrice.toFixed(2)}
            </p>
          </div>

          ${
            status === "delivered"
              ? `
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #065f46;">
                <strong>Love your products?</strong> We'd love to hear your feedback! 
                Share your experience and help other customers make informed decisions.
              </p>
            </div>
          `
              : ""
          }

          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL}/profile/orders/${
    order._id
  }" class="button">
              View Order Details
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            <strong>Questions?</strong><br>
            Contact us at support@cosmeticshop.com or visit our Help Center.
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Cosmetic Shop. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Low Stock Alert Email Template (For Admin)
 * Sent when product stock is running low
 */
const getLowStockAlertTemplate = (products) => {
  const productsHTML = products
    .map(
      (product) => `
    <tr style="border-bottom: 1px solid #e5e7eb;">
      <td style="padding: 10px;">
        <strong>${product.name}</strong><br>
        <small style="color: #6b7280;">SKU: ${product.sku}</small>
      </td>
      <td style="padding: 10px; text-align: center; color: #dc2626; font-weight: bold;">
        ${product.stock}
      </td>
      <td style="padding: 10px; text-align: center;">
        ${product.lowStockThreshold || 10}
      </td>
    </tr>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 30px; text-align: center; }
        .content { padding: 20px; background: #fef2f2; }
        table { width: 100%; background: white; border-collapse: collapse; margin: 20px 0; }
        th { background: #f3f4f6; padding: 12px; text-align: left; }
        td { padding: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Low Stock Alert</h1>
        </div>
        <div class="content">
          <p>The following products are running low on stock:</p>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Current Stock</th>
                <th style="text-align: center;">Threshold</th>
              </tr>
            </thead>
            <tbody>
              ${productsHTML}
            </tbody>
          </table>
          <p><strong>Action Required:</strong> Please restock these items soon to avoid stock-outs.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  getWelcomeEmailTemplate,
  getOrderConfirmationTemplate,
  getPasswordResetTemplate,
  getOrderStatusUpdateTemplate,
  getLowStockAlertTemplate,
};
