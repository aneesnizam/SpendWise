import { otpTemplate } from "./templates.js";
import transporter from "./transporter.js";

const EMAIL = process.env.EMAIL_USER


const sendOTPEmail = async (toEmail, otp) => {
  const mailOptions = {
    from: EMAIL,
    to: toEmail,
     subject: '🔐 Your OTP Code',
    html: otpTemplate(otp),
  };

  try {
    await transporter.sendMail(mailOptions);
    return otp;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

export default sendOTPEmail;
