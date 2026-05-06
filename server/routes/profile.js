import express from "express";
import multer from "multer";
import {
  getProfile,
  updateProfile,
  changePassword,
  getUserStats,
} from "../controllers/profileController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.get("/:id", getProfile);
router.put("/update/:id", verifyToken, updateProfile);
router.put("/change-password", changePassword);
router.get("/stats/:id", getUserStats);

export default router;