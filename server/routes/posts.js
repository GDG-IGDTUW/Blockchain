import express from "express";
import { 
    getFeedPosts, 
    getUserPosts, 
    likePost, 
    postComment, 
    deleteComment,
    editComment  // <--- 1. YEH IMPORT HAI NA?
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.post("/:id/comment", verifyToken, postComment);

// 👇 2. YEH LINE SABSE ZAROORI HAI. AGAR YEH NAHI HAI TOH 404 AAYEGA.
router.patch("/:id/:commentId/edit", verifyToken, editComment); 

/* DELETE */
router.delete("/:id/:commentId/delete", verifyToken, deleteComment);

export default router;