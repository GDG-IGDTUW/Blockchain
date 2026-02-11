/* Handles all post-related operations:
   - Creating posts
   - Fetching feed & user posts
   - Likes
   - Comments (add, edit, delete)
 */
import Post from '../models/Post.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

/* CREATE POST */
/* Creates a new post for a logged-in user.
Stores the post in MongoDB and returns updated feed.  */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;

    // Validate required input
    if (!userId || !description) {
      return res.status(400).json({
        success: false,
        message: 'Post text and user information are required.',
      });
    }

    // Fetch user from DB to attach profile info to post
    const user = await User.findById(userId);
     if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please log in again.',
      });
    }

    // Create new Post document
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    // Save post to database
    await newPost.save();

    // Return updated feed
    const posts = await Post.find();
    res.status(201).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({
        msg: 'Unable to create your post right now. Please try again later.',
      });
  }
};

/* READ POSTS */
// Fetches all posts for the main feed
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find();        // Read all posts
    res.status(200).json(posts); 
  } catch (err) {
    res.status(500).json({ msg: 'Failed to load the feed. Please refresh the page.' });
  }
};

//  Fetches all posts created by a specific user
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;

     if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is missing.',
      });
    }

    const posts = await Post.find({ userId });     // Filter by userId
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ msg: "Could not load this user's posts." });
  }
};

/* UPDATE LIKES */
// Toggles like/unlike for a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User must be logged in to like a post.',
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    // Toggle like status
    const isLiked = post.likes.get(userId);
    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    // Save updated likes
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ msg: 'Could not update the like. Please try again.' });
  }
};

/* --- COMMENT FEATURES --- */

// 1. Post Comment   :  Adds a new comment to a post
export const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    
    if (!comment || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Comment text cannot be empty.',
      });
    }

    // Debug Log
    console.log('BACKEND RECEIVED COMMENT:', { userId, commentText: comment });

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    const user = await User.findById(userId);
     if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found. Please log in again.',
      });
    }

    // Create new comment object
    const newComment = {
      _id: new mongoose.Types.ObjectId(), // Generate ID manually
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      comment,
      createdAt: new Date().toISOString(), // Add Timestamp
      likes: [],
    };

    post.comments.push(newComment);

    // Save updated comments array
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message:'Failed to post your comment. Please try again.'});
  }
};

// 2. Delete Comment : Deletes a comment from a post
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);
 if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    const commentExists = post.comments.some(
      (item) => String(item._id) === commentId
    );

    if (!commentExists) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found.',
      });
    }

    // Filter out the comment by ID
    post.comments = post.comments.filter(
      (item) => String(item._id) !== commentId
    );

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: 'Unable to delete the comment.' });
  }
};

// 3. Edit Comment : Updates an existing comment
export const editComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { comment } = req.body;
     if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot be empty.',
      });
    }

    console.log(`Updating Comment - Post ID: ${id}, Comment ID: ${commentId}`);

    const post = await Post.findById(id);
     if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found.',
      });
    }

    // Find and update specific comment
    const commentIndex = post.comments.findIndex((item) => {
      return item._id.toString() === commentId;
    });

    if (commentIndex > -1) {
      post.comments[commentIndex].comment = comment; // Update Text

      // Mark as modified so Mongoose knows to save the array change
      post.markModified('comments');

      await post.save();

      const updatedPost = await Post.findById(id);
      res.status(200).json(updatedPost);
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (err) {
    res.status(404).json({ message: 'Failed to update the comment.' });
  }
};
