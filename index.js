require('dotenv').config();
const express = require('express');
const { Resend } = require('resend');

const app = express();
app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-email', async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({
      error: 'Missing required fields: to, subject, text'
    });
  }

  try {
    await resend.emails.send({
      from: 'ritesht378@gmail.com', // works immediately
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`
    });

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
