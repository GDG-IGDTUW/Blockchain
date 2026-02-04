import express from "express";
import { searchUsers, searchPosts, searchHashtags , searchAll} from "../controllers/searchController.js";

const router = express.Router();

router.get('/users', searchUsers);
router.get('/posts', searchPosts);
router.get('/hashtags', searchHashtags);
router.get("/all", searchAll);


export default router;
