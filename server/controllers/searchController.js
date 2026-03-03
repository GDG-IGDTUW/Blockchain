import User from '../models/User.js';
import Post from '../models/Post.js';

// Search users by name or username
export const searchUsers = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const regex = new RegExp(q, 'i'); // case-insensitive

    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }],
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search posts by content
export const searchPosts = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    const regex = new RegExp(q, 'i');
    // Text search on 'content' field
    const posts = await Post.find({ description: regex })
      .populate('userId', 'firstName lastName')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Search posts by hashtag
export const searchHashtags = async (req, res) => {
  try {
    const { hashtag, page = 1, limit = 10 } = req.query;

    const posts = await Post.find({ hashtags: hashtag })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// controllers/searchController.js
export const searchAll = async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q || q.trim() === '') return res.json({ users: [], posts: [] });

    const regex = new RegExp(q, 'i');

    const users = await User.find({
      $or: [{ firstName: regex }, { lastName: regex }],
    }).limit(parseInt(limit));

    const posts = await Post.find({ description: regex })
      .populate('userId', 'firstName lastName')
      .limit(parseInt(limit));

    res.json({ users, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
