const dotenv = require('dotenv');
const path = require('path');
const sendEmail = require('./sendEmail');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const runDiagnostic = async () => {
  console.log('==================================================');
  console.log('       CERIA EMAIL CONFIGURATION DIAGNOSTIC       ');
  console.log('==================================================');

  const testEmailAddress = process.argv[2] || process.env.ADMIN_EMAIL || 'satdeveayush2004@gmail.com';
  console.log(`Target Recipient Email: ${testEmailAddress}`);
  console.log('--------------------------------------------------');

  let mode = 'SMTP (Nodemailer)';
  if (process.env.BREVO_API_KEY) {
    mode = 'Brevo HTTP API';
    console.log(`[Configured] BREVO_API_KEY is present.`);
    console.log(`[Configured] BREVO_SENDER_EMAIL: ${process.env.BREVO_SENDER_EMAIL || '(fallback to EMAIL_USER/onboarding)'}`);
  } else if (process.env.RESEND_API_KEY) {
    mode = 'Resend HTTP API';
    console.log(`[Configured] RESEND_API_KEY is present.`);
    console.log(`[Restriction Info] Resend free tier ONLY allows sending to your signup email, unless domain is verified.`);
  } else {
    console.log(`[Configured] No BREVO_API_KEY or RESEND_API_KEY found.`);
    console.log(`[Configured] EMAIL_USER: ${process.env.EMAIL_USER || 'Not Set'}`);
    console.log(`[Configured] EMAIL_PASS: ${process.env.EMAIL_PASS ? '********' : 'Not Set'}`);
    console.log(`[Render Note] Gmail SMTP will fail on Render because Render blocks ports 25, 465, 587.`);
  }

  console.log(`\nAttempting to send email via: ${mode}...`);

  try {
    const result = await sendEmail({
      email: testEmailAddress,
      subject: 'CERIA - Diagnostic Test Email',
      message: 'Hello!\n\nIf you are reading this, your email configuration for CERIA is working perfectly!\n\nBest,\nCERIA Team'
    });

    console.log('\n--------------------------------------------------');
    console.log('RESULT: SUCCESS!');
    console.log('Response:', result);
    console.log('==================================================');
  } catch (error) {
    console.log('\n--------------------------------------------------');
    console.log('RESULT: FAILED!');
    console.log('Error Message:', error.message);
    console.log('\nTroubleshooting suggestions:');
    if (mode === 'Brevo HTTP API') {
      console.log('1. Verify your BREVO_API_KEY is correct.');
      console.log('2. Make sure BREVO_SENDER_EMAIL is a verified sender in your Brevo account dashboard.');
    } else if (mode === 'Resend HTTP API') {
      console.log('1. Verify your RESEND_API_KEY is correct.');
      console.log('2. Since you are using Resend free tier, you MUST send only to the email address you signed up with on Resend (unless you verified a custom domain).');
    } else {
      console.log('1. If running on Render, standard SMTP is blocked. You MUST configure BREVO_API_KEY or RESEND_API_KEY.');
      console.log('2. If running locally, check if your Google Account has "Less secure apps" enabled or if you generated an App Password instead of your regular password.');
    }
    console.log('==================================================');
  }
};

runDiagnostic();
