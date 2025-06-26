import transporter from "./transporter.js";

const sendVerificationMail = async (userEmail, token) => {
  const verificationUrl = `https://spendwise-web.onrender.com/api/auth/${token}`;

  const mailOptions = {
    from: '"SpendWise" <no-reply@spendwise.com>',
    to: userEmail,
    subject: "Verify Your Email - SpendWise",
    html: `
      <h2>Welcome to SpendWise 👋</h2>
      <p>Please verify your email address by clicking the button below:</p>
      <a 
        href="${verificationUrl}" 
        style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #fff; text-decoration: none; border-radius: 6px; margin-top: 10px;"
      >
        Verify Email
      </a>
      <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      <br />
      <p>Thanks,<br/>The SpendWise Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email.");
  }
};

export default sendVerificationMail;
