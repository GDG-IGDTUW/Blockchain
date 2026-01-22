import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUserBySearch, // <--- Imported the new search controller
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* SEARCH USER ROUTE */
router.get("/search/:query", verifyToken, getUserBySearch); // <--- Added this route

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;