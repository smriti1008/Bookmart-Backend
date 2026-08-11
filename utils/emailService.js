const nodemailer = require("nodemailer");

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

// Format date
const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });
};

// Generate HTML email template for new order
const generateOrderEmailHTML = (orderDetails) => {
  const { user, books, totalAmount, orderId, orderDate } = orderDetails;

  const bookRows = books
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="display: flex; align-items: center;">
            <img src="${item.book?.url || 'https://via.placeholder.com/60x80'}" 
                 alt="${item.book?.title}" 
                 style="width: 50px; height: 70px; object-fit: cover; border-radius: 4px; margin-right: 12px;">
            <div>
              <strong style="color: #1f2937;">${item.book?.title || "N/A"}</strong>
              <br>
              <span style="color: #6b7280; font-size: 13px;">by ${item.book?.author || "Unknown"}</span>
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151;">
          ${item.qty || 1}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #374151;">
          ${formatCurrency(item.book?.price || 0)}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; color: #1f2937;">
          ${formatCurrency((item.book?.price || 0) * (item.qty || 1))}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Notification</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 650px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; color: #1f2937; font-size: 28px;">📚 BookMart</h1>
          <p style="margin: 10px 0 0; color: #78350f; font-size: 14px;">New Order Received!</p>
        </div>

        <!-- Main Content -->
        <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Alert Banner -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 25px; border-radius: 0 8px 8px 0;">
            <strong style="color: #92400e;">🔔 New Order Alert!</strong>
            <p style="margin: 5px 0 0; color: #78350f; font-size: 14px;">A customer has just placed an order on BookMart.</p>
          </div>

          <!-- Order Info -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              📋 Order Details
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Order ID:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">#${orderId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Order Date:</td>
                <td style="padding: 8px 0; color: #1f2937;">${formatDate(orderDate)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    Order Placed
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Customer Info -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              👤 Customer Information
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Name:</td>
                <td style="padding: 8px 0; color: #1f2937; font-weight: 600;">${user?.username || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                <td style="padding: 8px 0; color: #1f2937;">
                  <a href="mailto:${user?.email}" style="color: #2563eb; text-decoration: none;">${user?.email || "N/A"}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280; vertical-align: top;">Address:</td>
                <td style="padding: 8px 0; color: #1f2937;">${user?.address || "Not provided"}</td>
              </tr>
            </table>
          </div>

          <!-- Books Ordered -->
          <div style="margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px; color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
              📚 Books Ordered (${books.length} ${books.length === 1 ? 'item' : 'items'})
            </h2>
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th style="padding: 12px; text-align: left; color: #374151; font-weight: 600;">Book</th>
                  <th style="padding: 12px; text-align: center; color: #374151; font-weight: 600;">Qty</th>
                  <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600;">Price</th>
                  <th style="padding: 12px; text-align: right; color: #374151; font-weight: 600;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${bookRows}
              </tbody>
            </table>
          </div>

          <!-- Total -->
          <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); padding: 20px; border-radius: 8px; text-align: right;">
            <span style="color: #9ca3af; font-size: 14px;">Total Amount:</span>
            <span style="color: #fbbf24; font-size: 28px; font-weight: 700; margin-left: 15px;">${formatCurrency(totalAmount)}</span>
          </div>

          <!-- Action Button -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" 
               style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
              View All Orders →
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 25px; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">This is an automated notification from BookMart</p>
          <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} BookMart. All rights reserved.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};

// Send order notification email to admin
const sendOrderNotificationEmail = async (orderDetails) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials not configured. Skipping email notification.");
      return { success: false, message: "Email not configured" };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"BookMart 📚" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL || "manijkumaryaduwansh@gmail.com",
      subject: `🛒 New Order Received - Order #${orderDetails.orderId.slice(-8).toUpperCase()}`,
      html: generateOrderEmailHTML(orderDetails),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Order notification email sent:", info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending order notification email:", error.message);
    return { success: false, error: error.message };
  }
};

// Send order confirmation email to customer
const sendOrderConfirmationEmail = async (orderDetails) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email credentials not configured. Skipping confirmation email.");
      return { success: false, message: "Email not configured" };
    }

    const transporter = createTransporter();
    const { user, books, totalAmount, orderId, orderDate } = orderDetails;

    const mailOptions = {
      from: `"BookMart 📚" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `✅ Order Confirmed - Order #${orderId.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px;">✅ Order Confirmed!</h1>
              <p style="margin: 10px 0 0; color: #d1fae5; font-size: 14px;">Thank you for shopping with BookMart</p>
            </div>

            <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Hi <strong>${user.username}</strong>,
              </p>
              <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                Your order has been successfully placed! We're getting your books ready.
              </p>

              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; color: #6b7280;">Order ID: <strong style="color: #1f2937;">#${orderId.slice(-8).toUpperCase()}</strong></p>
                <p style="margin: 10px 0 0; color: #6b7280;">Total: <strong style="color: #059669; font-size: 20px;">${formatCurrency(totalAmount)}</strong></p>
                <p style="margin: 10px 0 0; color: #6b7280;">Items: <strong style="color: #1f2937;">${books.length} book(s)</strong></p>
              </div>

              <p style="color: #6b7280; font-size: 14px;">
                You can track your order status in your profile dashboard.
              </p>

              <div style="text-align: center; margin-top: 25px;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/profile" 
                   style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #1f2937; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-weight: 600;">
                  Track Your Order →
                </a>
              </div>

            </div>

            <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
              <p>© ${new Date().getFullYear()} BookMart. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Order confirmation email sent to customer:", info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending confirmation email:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderNotificationEmail,
  sendOrderConfirmationEmail,
};
