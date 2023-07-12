const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abouhasanmohamed@gmail.com",
    pass: "nvcklonbnuctdxdg",
  },
});
// Function to send email verification code
const sendVerificationEmail = async (email, code) => {
  try {
    // const verificationLink = `http://localhost:3000/verifylink?email=${email}&code=${code}`;

    // Create the email message
    const mailOptions = {
      from: "moahmed@gmail.com",
      to: email,
      subject: "Email Verification",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                color: #333;
              }
              h1 {
                color: #e9672b;
              }
              p {
                line-height: 1.5;
              }
            </style>
          </head>
          <body>
            <h1>Hello!</h1>
            <p>Thank you for signing up. Please verify your email address by entering the following code:</p>
            <h2>${code}</h2>
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
const sendPasswordResetEmail = async (email, code) => {
  const resetLink = `http://localhost:5173/resetpassword`;

  try {
    const mailOptions = {
      from: "moahmed@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333;
            }
            h1 {
              color: #e9672b;
            }
            p {
              line-height: 1.5;
            }
          </style>
        </head>
        <body>
          <h1>Password Reset</h1>
          <p>You have requested to reset your password. Please use the following code and click the link below to reset your password:</p>
          <h2>${code}</h2>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
        </body>
      </html>
    `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending password reset email:", error);
  }
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
