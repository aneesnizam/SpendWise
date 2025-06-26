import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import sendOTPEmail from "../utilities/sendOTPEmail .js";
import crypto from "crypto";
import sendVerificationMail from "../utilities/emailVerification.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret1234secret";
const isProd = process.env.NODE_ENV === "production";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    sendVerificationMail(token, email);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.json({ success: false, message: "Email not registered" });
    if (!user.verified){
      return res.json({ success: false, message: "Email not verified" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    user.password = undefined;
    if (!isMatch)
      return res.json({ success: false, message: "Invalid password" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "30d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
      maxAge: 24 * 60 * 60 * 1000 * 30, //30 day
    });

    res.json({
      success: true,
      message: "Login successful",
      user,
      token
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required." });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found." });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetOTP = otp;
    user.otpExpires = otpExpires;
    await user.save();

    sendOTPEmail(email, otp);

    res.json({ success: true, message: "OTP sent to email." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });

    const user = await User.findOne({ email });
    if (!user || user.resetOTP !== otp || user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired OTP." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOTP = null;
    user.otpExpires = null;

    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "None" : "Lax",
  });
  res.json({ success: true, message: "Logged out successfully" });
};

export const EmailVerification = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.send(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background-color: #4361ee;
                font-family: Arial, sans-serif;
                color: #ffffff;
              }
              h1 {
                font-size: 2rem;
              }
            </style>
          </head>
          <body>
            <h1>Verification failed</h1>
          </body>
        </html>
      `);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.send(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background-color: #4361ee;
                font-family: Arial, sans-serif;
                color: #ffffff;
              }
              h2 {
                font-size: 2rem;
              }
            </style>
          </head>
          <body>
            <h2>Invalid or expired token</h2>
          </body>
        </html>
      `);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.send(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                background-color: #4361ee;
                font-family: Arial, sans-serif;
                color: #ffffff;
              }
            </style>
          </head>
          <body>
            <h2>User not found</h2>
          </body>
        </html>
      `);
    }

    user.verified = true;
    await user.save();

    res.send(`
      <html>
        <head>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background: linear-gradient(135deg, #4f46e5, #3b82f6);
              color: white;
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              flex-direction: column;
              text-align: center;
            }
            h1 {
              font-size: 2.5rem;
              margin-bottom: 1rem;
            }
            p {
              font-size: 1.2rem;
              opacity: 0.9;
            }
          </style>
        </head>
        <body>
          <h1>🎉 Email Verified Successfully!</h1>
          <p>Welcome to SpendWise. You can now log in and start tracking your expenses.</p>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`
      <html>
        <head>
          <style>
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              background-color: #f8d7da;
              font-family: Arial, sans-serif;
              color: #721c24;
            }
            h2 {
              font-size: 2rem;
            }
          </style>
        </head>
        <body>
          <h2>Server error: ${err.message}</h2>
        </body>
      </html>
    `);
  }
};

