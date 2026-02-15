import express from "express";
import { searchUsers, searchPosts, searchHashtags , searchAll} from "../controllers/searchController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get('/users', verifyToken, searchUsers);
router.get('/posts', verifyToken, searchPosts);
router.get('/hashtags', verifyToken, searchHashtags);
router.get("/all", verifyToken, searchAll);


export default router;