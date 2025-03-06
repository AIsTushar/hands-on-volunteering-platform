import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  deleteAccount,
  getProfile,
  updatePassword,
  updateProfile,
} from "../controllers/profile.controller.js";
const router = express.Router();

router.get("/:id", getProfile); // Get profile by user ID
router.put("/", verifyToken, updateProfile); // Update profile (protected)
router.put("/ChangePassword", verifyToken, updatePassword); // Change password (protected)
router.delete("/", verifyToken, deleteAccount); // Delete account (protected)

export default router;
