import User from "../models/userModel.js";

export const sendRequest = async (req, res) => {
  const { email } = req.params;
  const senderId = req.userId;

  const receiver = await User.findOne({ email });
  if (!receiver) return res.status(404).json({ message: "User not found" });

  if (
    receiver.friendRequests.includes(senderId) ||
    receiver.friends.includes(senderId)
  )
    return res.status(400).json({ message: "Already requested or friends" });

  const sender = await User.findById(senderId);

  if(sender.email == receiver.email){
    return res.json({ message: "Can't be friend with your own" });
  }

  receiver.friendRequests.push(senderId);
  await receiver.save();

  sender.sentRequests.push(receiver._id);
  await sender.save();

  res.json({ message: "Friend request sent" });
};

export const acceptRequest = async (req, res) => {
  const senderId = req.params.id;
  const receiverId = req.userId;

  const sender = await User.findById(senderId);
  const receiver = await User.findById(receiverId);

  if (!receiver.friendRequests.includes(senderId))
    return res.status(400).json({ message: "No such request" });

  // Update both users
  receiver.friends.push(senderId);
  receiver.friendRequests = receiver.friendRequests.filter(
    (id) => id != senderId
  );

  sender.friends.push(receiverId);
  sender.sentRequests = sender.sentRequests.filter((id) => id != receiverId);

  await receiver.save();
  await sender.save();

  res.json({ message: "Friend request accepted" });
};

export const rejectRequest = async (req, res) => {
  const senderId = req.params.id;
  const receiverId = req.userId;

  const receiver = await User.findById(receiverId);
  const sender = await User.findById(senderId);

  receiver.friendRequests = receiver.friendRequests.filter(
    (id) => id != senderId
  );
  sender.sentRequests = sender.sentRequests.filter((id) => id != receiverId);

  await receiver.save();
  await sender.save();

  res.json({ message: "Friend request rejected" });
};

export const myFriendsData = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate("friends", "name email")
      .populate("friendRequests", "name email")
      .populate("sentRequests", "name email");

    res.json({
      friends: user.friends,
      friendRequests: user.friendRequests,
      sentRequests: user.sentRequests,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch friend data" });
  }
};

export const deleteFriend = async (req, res) => {
  const userId = req.userId;
  const friendId = req.params.id;

  try {
    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    res.json({ message: "Friend removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove friend" });
  }
};

export const sentPayment = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const friend = req.userId;
    const { amount, title, name, id } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.json({ success: false, message: "Receiver not found" });
    }

    const alreadyExists = receiver.inbox.some(
      (entry) => entry.id.toString() === id && entry.name === name
    );

    if (alreadyExists) {
      return res.json({
        success: false,
        message: "Payment message already send",
      });
    }

    receiver.inbox.push({ name, amount, title, id, friend });
    await receiver.save();

    res.status(200).json({
      success: true,
      message: "Payment message sent to inbox",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to send payment message",
      error: err.message,
    });
  }
};

export const getInbox = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("inbox");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      inbox: user.inbox,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to get inbox",
      error: err.message,
    });
  }
};
