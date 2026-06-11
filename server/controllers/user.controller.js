const User = require("../models/User");
const Post = require("../models/Post");
const Reward = require("../models/Reward");

exports.getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const postsCount = await Post.countDocuments({
      author: userId,
    });

    const rewards = await Reward.aggregate([
      {
        $match: {
          user: user._id,
        },
      },
      {
        $group: {
          _id: null,
          totalRewards: {
            $sum: "$amount",
          },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        postsCount,
        rewards:
          rewards.length > 0
            ? rewards[0].totalRewards
            : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};