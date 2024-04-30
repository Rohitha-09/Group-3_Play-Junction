const sgMail = require('@sendgrid/mail');
sgMail.setApiKey('your_sendgrid_api_key');

const msg = {
  to: 'recipient@example.com',
  from: 'sender@example.com',
  subject: 'Payment Update',
  text: 'Your payment has been processed successfully.',
  html: '<strong>Your payment has been processed successfully.</strong>',
};

// Send email notification
sgMail.send(msg)
  .then(() => console.log('Email notification sent'))
  .catch((error) => console.error('Error sending email notification:', error));
