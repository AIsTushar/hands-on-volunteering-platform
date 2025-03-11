import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteAccount,
  getProfile,
  updatePassword,
  updateProfile,
} from "../controllers/profile.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

router.get("/", verifyToken, getProfile); // Get profile (protected)
router.put("/", verifyToken, upload.single("profileImage"), updateProfile); // Update profile (protected)
router.put("/ChangePassword", verifyToken, updatePassword); // Change password (protected)
router.delete("/", verifyToken, deleteAccount); // Delete account (protected)

export default router;
