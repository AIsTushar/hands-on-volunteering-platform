import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createEvent,
  getEvent,
  getEvents,
  joinEvent,
} from "../controllers/event.controller.js";
const router = express.Router();

router.get("/", getEvents); // Get all events with filters
router.post("/", verifyToken, createEvent); // Create event (protected)
router.get("/:id", getEvent); // Get event by ID
router.post("/:id/join", verifyToken, joinEvent); // Join event (protected)

export default router;
