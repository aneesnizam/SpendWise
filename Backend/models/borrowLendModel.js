import mongoose from "mongoose";

const borrowLendSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["borrow", "lend"],
      required: true,
    },

    person: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    note: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "settled"],
      default: "pending",
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const BorrowLend = mongoose.model("BorrowLend", borrowLendSchema);

export default BorrowLend;