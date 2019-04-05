const nodemailer = require('nodemailer');
const mailgun = require('nodemailer-mailgun-transport');
const debug = require('debug')('app:mail');

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: 'giftgrab.herokuapp.com'
  }
};

const transporter = nodemailer.createTransport(mailgun(auth));

function sendOrderEmail(order) {
  let html = '<ul>';

  Object.entries(order).forEach(([key, value]) => {
    html += `<li>${key}: ${value}</li>`;
  });

  html += '</ul>';

  const mailOptions = {
    from: 'info@giftgrab.com',
    to: 'gftgrb@gmail.com',
    subject: 'New order received',
    html
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      debug(`Error: ${err}`);
    } else {
      debug(`Info: ${info}`);
    }
  });
}

module.exports = sendOrderEmail;
