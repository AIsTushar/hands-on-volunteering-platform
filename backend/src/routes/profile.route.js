import express from "express";
const router = express.Router();

router.get("/:id", getProfile); // Get profile by user ID
router.put("/", verifyToken, updateProfile); // Update profile (protected)
router.put("/password", verifyToken, updatePassword); // Change password (protected)
router.delete("/", verifyToken, deleteAccount); // Delete account (protected)

export default router;
