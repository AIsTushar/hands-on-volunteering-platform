import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  getMyEvents,
  joinEvent,
  leaveEvent,
  updateEvent,
} from "../controllers/event.controller.js";
import upload from "../middleware/multer.js";
const router = express.Router();

// Public routes
router.get("/", getEvents);
router.get("/:id", getEvent);

// Protected routes
router.post("/", verifyToken, upload.single("eventImage"), createEvent);
router.put("/:id", verifyToken, upload.single("eventImage"), updateEvent);
router.delete("/:id", verifyToken, upload.single("eventImage"), deleteEvent);
router.get(
  "/user/created",
  verifyToken,
  upload.single("eventImage"),
  getMyEvents
);

router.post("/:id/join", verifyToken, joinEvent);
router.post("/:id/leave", verifyToken, leaveEvent);

export default router;
