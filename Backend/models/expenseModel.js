import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
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
    },
    date: {
      type: Date,
      default: Date.now,
    },
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;
