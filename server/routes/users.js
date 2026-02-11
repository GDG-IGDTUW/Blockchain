//  Handles user profile, friends and user search operations.
 
import express from 'express';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUserBySearch, // <--- Imported the new search controller
} from '../controllers/users.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get a user's profile information
router.get('/:id', verifyToken, getUser);

// Get list of user's friends
router.get('/:id/friends', verifyToken, getUserFriends);

// Search users by name or username
router.get('/search/:query', verifyToken, getUserBySearch); // <--- Added this route

// Add or remove a friend
router.patch('/:id/:friendId', verifyToken, addRemoveFriend);

export default router;
