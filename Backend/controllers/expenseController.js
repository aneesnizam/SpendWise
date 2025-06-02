import Expense from "../models/expenseModel.js";
import mongoose from "mongoose";

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const newExpense = new Expense({
      user: req.userId,
      title,
      amount,
      category,
      date,
    });
    await newExpense.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Expense created successfully",
        newExpense,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to create expense",
        error: err.message,
      });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const { today } = req.query;
    let filter = { user: req.userId };

    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });

    let totalAmount = 0;
    if (today === "true") {
      totalAmount = expenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
      );
    }

    res.json({
      success: true,
      expenses,
      ...(today === "true" && { totalAmount }),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
      error: err.message,
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Expense.findOneAndUpdate(
      { _id: id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "Expense not found" });
    res.json({
      success: true,
      message: "Expense updated successfully",
      updated,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update expense",
        error: err.message,
      });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Expense.findOneAndDelete({
      _id: id,
      user: req.userId,
    });
    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    res.json({ success: true, message: "Expense deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to delete expense",
        error: err.message,
      });
  }
};

export const filterExpenses = async (req, res) => {
  try {
    const {
      category,
      startDate,
      endDate,
      date,
      minAmount,
      maxAmount,
      groupByCategory,
      sortBy,
      order,
    } = req.query;

    const userId = new mongoose.Types.ObjectId(String(req.userId));
    const filter = { user: userId };

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by date or date range
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.date = { $lte: new Date(endDate) };
    } else if (date) {
      const targetDate = new Date(date);
      const startOfDate = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDate = new Date(targetDate.setHours(23, 59, 59, 999));
      filter.date = { $gte: startOfDate, $lte: endOfDate };
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filter.amount.$lte = parseFloat(maxAmount);
    }

    let grouped;

    if (groupByCategory === "true") {
      grouped = await Expense.aggregate([
        { $match: filter },
        {
          $group: {
            _id: "$category",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        {
          $sort: { totalAmount: order === "desc" ? -1 : 1 },
        },
      ]);

      // return res.json({ success: true, grouped });
    }

    // Sorting
    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    } else {
      sort.date = -1; // default: newest first
    }

    const expenses = await Expense.find(filter).sort(sort);
    const total = expenses.reduce((sum, i) => sum + i.amount, 0);

    res.json({
      success: true,
      count: expenses.length,
      total,
      grouped,
      expenses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
