/* Handles all search-related APIs:
  - Search users
  - Search posts
  - Search by hashtags
  - Global search
 */

import User from '../models/User.js';
import Post from '../models/Post.js';

// Search users by first name or last name
export const searchUsers = async (req, res) => {
  try {
    const { searchQuery , page = 1, limit = 10 } = req.query;if (!searchQuery || searchQuery.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a name to search.',
      });
    }

    const searchRegex = new RegExp(searchQuery, 'i'); // case-insensitive search

    // Find matching users using MongoDB regex
    const users = await User.find({
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
    })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:'Unable to search users right now. Please try again later.' });
  }
};

// Search posts using keywords in description
export const searchPosts = async (req, res) => {
  try {
    const { searchQuery, page = 1, limit = 10 } = req.query;if (!searchQuery || searchQuery.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a keyword to search posts.',
      });
    }

    const searchRegex = new RegExp(searchQuery, 'i');

    // Fetch posts that match description text
    const posts = await Post.find({ description: searchRegex })
      .populate('userId', 'firstName lastName')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message:'Unable to search posts at the moment.' });
  }
};

// Search posts by hashtag
export const searchHashtags = async (req, res) => {
  try {
    const { hashtag, page = 1, limit = 10 } = req.query;
if (!hashtag || hashtag.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please enter a hashtag to search.',
      });
    }

    // Fetch posts containing the hashtag
    const posts = await Post.find({ hashtags: hashtag })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to search hashtags right now.' });
  }
};

// Search both users and posts together
export const searchAll = async (req, res) => {
  try {
    const { searchQuery, page = 1, limit = 10 } = req.query;
    if (!searchQuery || searchQuery.trim() === '') return res.json({ users: [], posts: [] });

    const searchRegex = new RegExp(searchQuery, 'i');

    // Search users
    const users = await User.find({
      $or: [{ firstName: searchRegex }, { lastName: searchRegex }],
    }).limit(parseInt(limit));

    // Search posts
    const posts = await Post.find({ description: regex })
      .populate('userId', 'firstName lastName')
      .limit(parseInt(limit));

    res.json({ users, posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Search service is currently unavailable. Please try again later.'});
  }
};
