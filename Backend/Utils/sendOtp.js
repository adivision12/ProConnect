const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // use app password here
  },
});

async function sendOtpMail(to, otp) {
  const mailOptions = {
    from: `"ProConnect" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP for ProConnect",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  // console.log("OTP email sent: %s", info.messageId);
  return info;
}

module.exports = { sendOtpMail };
