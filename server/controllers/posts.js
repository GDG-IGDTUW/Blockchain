import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/* CREATE POST */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
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
    await newPost.save();

    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ POSTS */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE LIKES */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* --- COMMENT FEATURES --- */

// 1. Post Comment
export const postComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    
    // Debug Log
    console.log("BACKEND RECEIVED COMMENT:", { userId, commentText: comment });

    const post = await Post.findById(id);
    const user = await User.findById(userId);

    const newComment = {
      _id: new mongoose.Types.ObjectId(), // Generate ID manually
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userPicturePath: user.picturePath,
      comment, 
      createdAt: new Date().toISOString(), // Add Timestamp
      likes: [] 
    };

    post.comments.push(newComment);

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { comments: post.comments },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// 2. Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const post = await Post.findById(id);

    // Filter out the comment by ID
    post.comments = post.comments.filter((item) => String(item._id) !== commentId);

    const updatedPost = await Post.findByIdAndUpdate(
        id,
        { comments: post.comments },
        { new: true }
    );
    
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// 3. Edit Comment
export const editComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { comment } = req.body;

    console.log(`Updating Comment - Post ID: ${id}, Comment ID: ${commentId}`);

    const post = await Post.findById(id);

    // Find the specific comment index
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
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};