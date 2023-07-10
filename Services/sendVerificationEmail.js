const nodemailer = require("nodemailer");
require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "3bc78265590345",
//     pass: "3131cdcf1d5bb0",
//   },
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abouhasanmohamed@gmail.com", // Replace with your Gmail email address
    pass: "nvcklonbnuctdxdg",
  },
});
// Function to send email verification code
const sendVerificationEmail = async (email, code) => {
  try {
    console.log("hello world1111");
    // Create the email message
    console.log(email, code);
    const mailOptions = {
      from: "moahmed@gmail.com", // Replace with your AOL email address
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by entering the following code: ${code}`,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Verification email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

module.exports = { sendVerificationEmail };

// Create a transporter object with Gmail SMTP settings

// // Function to send email
// const sendEmail = async (email, subject, text) => {
//   try {
//     // Create the email message
//     const mailOptions = {
//       from: "your-email@gmail.com", // Replace with your Gmail email address
//       to: email,
//       subject: subject,
//       text: text,
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent:", info.messageId);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// };

// module.exports = { sendEmail };
