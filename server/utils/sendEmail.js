const nodemailer = require('nodemailer');
const https = require('https');

const sendEmailViaResend = (options) => {
  return new Promise((resolve, reject) => {
    // Resend free tier uses onboarding@resend.dev as sender
    const data = JSON.stringify({
      from: 'onboarding@resend.dev',
      to: options.email,
      subject: options.subject,
      html: `<h3>${options.subject}</h3><p>${options.message.replace(/\n/g, '<br>')}</p>`,
      text: options.message
    });

    const reqOptions = {
      hostname: 'api.resend.com',
      port: 443,
      path: '/emails',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(body);
            resolve({ success: true, messageId: parsed.id });
          } catch (e) {
            resolve({ success: true });
          }
        } else {
          reject(new Error(`Resend API failed with status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

const sendEmail = async (options) => {
  // If Resend API Key is configured, use Resend HTTP API (works on Render free tier)
  if (process.env.RESEND_API_KEY) {
    try {
      const result = await sendEmailViaResend(options);
      console.log(`Email sent via Resend API successfully: ${result.messageId}`);
      return result;
    } catch (error) {
      console.error('Resend API Send Error:', error.message);
      throw error;
    }
  }

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
