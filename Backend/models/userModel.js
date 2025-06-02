import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    getSummary: {
      type: Boolean,
      default: false,
    },
    dailyLimit: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: "₹"
    },
    resetOTP: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
