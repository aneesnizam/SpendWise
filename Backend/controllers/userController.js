import User from "../models/userModel.js";

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId, "-password");

        if (!user) {
            return res.json({ success: false, message: "User not found"});
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateUser = async (req, res) => {
    try{
        const { name, getSummary, dailyLimit, currency, upiId } = req.body;

        const user = await User.findById(req.userId, "-password");

        if (!user) {
            return res.json({ success: false, message: "User not found"});
        }

        if(name) user.name = name;
        if (getSummary !== undefined) user.getSummary = getSummary;
        if(dailyLimit) user.dailyLimit = dailyLimit;
        if(currency) user.currency = currency;
        if(upiId) user.upiId = upiId;

        await user.save();

        res.json({success: true, message: "Updated successfully", user})
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

