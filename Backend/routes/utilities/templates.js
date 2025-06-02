export const otpTemplate = (otp) => `
    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
    <h2 style="color: #4CAF50;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>You requested a password reset. Use the following OTP to reset your password:</p>
    <h1 style="color: #333; background-color: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 5px;">${otp}</h1>
    <p style="margin-top: 20px;">This OTP is valid for 10 minutes.</p>
    <img src="https://res.cloudinary.com/daccfo8ad/image/upload/v1748229706/logo_knhbyj.jpg" alt="Security" style="width: 100px; margin-top: 20px;" />
    <p style="font-size: 0.9em; color: #999;">If you did not request this, please ignore this email.</p>
    </div>
`;

export const generateWeeklySummaryEmail = (name, summary, total) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Hi ${name},</h2>
    <p style="font-size: 16px; color: #555;">Here’s your <strong>weekly expense summary</strong>:</p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #eaeaea;">
          <th style="text-align: left; padding: 10px; border: 1px solid #ddd;">Category</th>
          <th style="text-align: right; padding: 10px; border: 1px solid #ddd;">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${summary
          .map(
            (item) => `
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">${item.category}</td>
            <td style="text-align: right; padding: 10px; border: 1px solid #ddd;">${item.total}</td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <p style="font-size: 18px; margin-top: 20px;"><strong>Total Spent:</strong> ₹${total}</p>

    <hr style="margin: 30px 0;" />
    <p style="color: gray; font-size: 13px;">This is an automated weekly report from your expense tracker. No action is needed.</p>
  </div>
`;
