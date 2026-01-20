const nodemailer = require('nodemailer');
const express = require('express');

const app = express();

// Middleware to parse JSON body
app.use(express.json());

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ritesht378@gmail.com',
    pass: 'otinyyqcshezhnyk'
  }
});

// POST route to send email
app.post('/send-email', (req, res) => {
  const { to, subject, text, html } = req.body;

  // Validate required fields
  if (!to || !subject || !text) {
    return res.status(400).json({
      error: 'Missing required fields: to, subject, text'
    });
  }

  // Define email options from request body
  const mailOptions = {
    from: 'ritesht378@gmail.com',
    to: to,
    subject: subject,
    text: text,
    html: html || `<p>${text}</p>`
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    } else {
      console.log('Email sent successfully!');
      res.status(200).json({ message: 'Email sent successfully!', response: info.response });
    }
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Send POST request to http://localhost:3000/send-email');
});
