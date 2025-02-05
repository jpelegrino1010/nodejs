const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create Transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email

  const mailOptions = {
    from: 'My email',
    to: [options.email],
    subject: options.subject,
    text: options.message,
  };
  // 3) Send the email

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
