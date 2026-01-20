require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');

const app = express();
app.use(express.json());

// Verify API key exists
if (!process.env.RESEND_API_KEY) {
  console.error('❌ RESEND_API_KEY is not set in environment variables!');
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'; // Default Resend test email

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  // Validate required fields
  if (!to || !subject || !text) {
    return res.status(400).json({
      error: 'Missing required fields: to, subject, text'
    });
  }

  try {
    console.log(`📧 Sending email to: ${to}`);
    
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`
    });

    console.log(`✅ Email sent successfully! ID: ${response.data.id}`);
    res.status(200).json({ 
      message: 'Email sent successfully!',
      id: response.data.id 
    });
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
