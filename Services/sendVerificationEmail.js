const nodemailer = require("nodemailer");
require("dotenv").config();

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
    const verificationLink = `http://localhost:3000/verifylink?email=${email}&code=${code}`;

    // Create the email message
    const mailOptions = {
      from: "moahmed@gmail.com", // Replace with your AOL email address
      to: email,
      subject: "Email Verification",
      html: `
      <html>
      <head>
        <!-- Styles and other headers -->
      </head>
      <body>
        <h1>Hello!</h1>
        <p>Thank you for signing up. Please verify your email address by clicking the following link:</p>
        <a href="${verificationLink}">${verificationLink}</a>
        <p>We appreciate your participation!</p>
      </body>
    </html>
      `,
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
