import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: String,
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: "others",
    lowercase: true
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sharedWith: [
    {
      friend: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: Number,
      paid: { type: Boolean, default: false },
    },
  ],
});

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
