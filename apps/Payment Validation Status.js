// Assuming payment validation is successful
if (paymentIntent.status === 'succeeded') {
  // Send payment success notification
  sgMail.send({
    to: 'user@example.com',
    from: 'noreply@example.com',
    subject: 'Payment Successful',
    text: 'Your payment has been successfully processed.',
    html: '<strong>Your payment has been successfully processed.</strong>',
  })
  .then(() => console.log('Payment success notification sent'))
  .catch((error) => console.error('Error sending payment success notification:', error));
} else {
  // Send payment failure notification
  sgMail.send({
    to: 'user@example.com',
    from: 'noreply@example.com',
    subject: 'Payment Failed',
    text: 'There was an issue processing your payment. Please try again later.',
    html: '<strong>There was an issue processing your payment. Please try again later.</strong>',
  })
  .then(() => console.log('Payment failure notification sent'))
  .catch((error) => console.error('Error sending payment failure notification:', error));
}
