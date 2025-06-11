import express from "express";
import transporter from "../utilities/transporter.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!message || !email) {
    return res
      .status(400)
      .json({ success: false, message: "Email and message are required." });
  }

  try {
    const mailOptions = {
      from: `"${name || "User"}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "New Feedback from SpendWise",
      html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h2 style="color: #4CAF50; border-bottom: 1px solid #ddd; padding-bottom: 10px;">📬 New Feedback Received</h2>
      
      <p><strong>Name:</strong> ${name || "Anonymous"}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #1a73e8;">${email}</a></p>
      
      <div style="margin-top: 20px;">
        <p style="margin-bottom: 5px;"><strong>Message:</strong></p>
        <div style="background: #f1f1f1; padding: 15px; border-radius: 5px; color: #333; white-space: pre-line;">
          ${message}
        </div>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #999;">This message was sent via the SpendWise feedback form.</p>
    </div>
  </div>
`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Feedback sent successfully!" });
  } catch (err) {
    console.error("Error sending feedback:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to send feedback." });
  }
});

export default router;
