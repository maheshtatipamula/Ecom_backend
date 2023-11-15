const asyncHandler = require("express-async-handler");
require(dotenv).config();
const nodemailer = require("nodemailer");

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_ID,

      pass: process.env.M_P,
    },
  });

  let info = await transporter.sendMail({
    from: '"Start Up" <bbc@gmail.com.com>',
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });

  console.log("Message sent: %s", data.to, data.html, info.messageId);
});

module.exports = sendEmail;
