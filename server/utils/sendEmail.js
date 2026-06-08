const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const isConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

  if (!isConfigured) {
    console.log('\n==================================================');
    console.log(`[DEV OTP FALLBACK] Sending Email To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message:\n${options.message}`);
    console.log('==================================================\n');
    return { success: true, logged: true };
  }

  // Create transporter using Port 587 (Render blocks Port 465)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // false for port 587 (uses STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: `"CERIA Admin" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<h3>${options.subject}</h3><p>${options.message.replace(/\n/g, '<br>')}</p>`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent successfully: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
