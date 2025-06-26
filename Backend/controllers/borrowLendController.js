import BorrowLend from "../models/borrowLendModel.js";

export const addBorrowLend = async (req, res) => {
  try {
    const { type, person, amount, note } = req.body;
    const transaction = new BorrowLend({
      user: req.userId,
      type,
      person,
      amount,
      note,
    });
    await transaction.save();
    res.json({ success: true, message: "Entry added", transaction });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const getAllBorrowLend = async (req, res) => {
  try {
    const transactions = await BorrowLend.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
};

export const updateBorrowLend = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, person, amount, note, status } = req.body;

    const updated = await BorrowLend.findOneAndUpdate(
      { _id: id, user: req.userId }, 
      { type, person, amount, note, status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Entry not found or unauthorized" });
    }

    res.json({ success: true, message: "Entry updated", transaction: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

export const deleteBorrowLend = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await BorrowLend.findOneAndDelete({ _id: id, user: req.userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Entry not found or unauthorized" });
    }

    res.json({ success: true, message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

