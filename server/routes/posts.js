// Contains all routes related to posts, likes and comments.

import express from 'express';
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  postComment,
  deleteComment,
  editComment, // <--- 1. YEH IMPORT HAI NA?
} from '../controllers/posts.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Fetch all posts for user feed
router.get('/', verifyToken, getFeedPosts);

// Fetch all posts created by a specific user
router.get('/:userId/posts', verifyToken, getUserPosts);

// Like or unlike a post & Updates likes array inside Post document
router.patch('/:id/like', verifyToken, likePost);

// Add a comment to a post
router.post('/:id/comment', verifyToken, postComment);

// 👇 2. YEH LINE SABSE ZAROORI HAI. AGAR YEH NAHI HAI TOH 404 AAYEGA.
//  Edit an existing comment
router.patch('/:id/:commentId/edit', verifyToken, editComment);

// Delete a comment from a post
router.delete('/:id/:commentId/delete', verifyToken, deleteComment);

export default router;
