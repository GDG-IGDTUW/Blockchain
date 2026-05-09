// Provides search APIs for users, posts, hashtags and global search.

import express from 'express';
import {
  searchUsers,
  searchPosts,
  searchHashtags,
  searchAll,
} from '../controllers/searchController.js';

const router = express.Router();

// Search users by name or username
router.get('/users', searchUsers);

// Search posts by text or description
router.get('/posts', searchPosts);

// Search posts using hashtags
router.get('/hashtags', searchHashtags);

// Global search across users, posts, and hashtags
router.get('/all', searchAll);

export default router;
