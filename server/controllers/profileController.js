import User from "../models/User.js";
import bcrypt from "bcryptjs";

// @desc Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Update profile
export const updateProfile = async (req, res) => {
  try {
    const { bio, socialLinks } = req.body;

    if (bio && bio.length > 200) {
        return res.status(400).json({ message: "Bio cannot exceed 200 characters" });
    }

    const updateData = {
      bio,
      socialLinks,
    };

    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Change password
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both passwords are required" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc Get user stats
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const stats = {
      posts: user.posts?.length || 0,
      followers: user.followers?.length || 0,
      tokens: user.tokens || 0,
    };

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};