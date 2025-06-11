import mongoose from "mongoose";

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
      lowercase: true
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
      default: 100,
    },
    currency: {
      type: String,
      default: "₹",
    },
    verified: {
      type: Boolean,
      default: false
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    sentRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    upiId: {
      type: String,
      default: ""
    },
    inbox: [
      {
        name: String,
        amount: { type: Number, default: 0},
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Expense"},
        title: String,
        friend: { type:  mongoose.Schema.Types.ObjectId, ref: "User" }
      }
    ],

    resetOTP: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
