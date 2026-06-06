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

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Standard MERN choice
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
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
