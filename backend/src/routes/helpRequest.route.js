import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addComment,
  createHelpRequest,
  deleteComment,
  deleteHelpRequest,
  getHelpRequest,
  getHelpRequestHelpers,
  getHelpRequests,
  getHelpRequestsByUser,
  offerHelp,
  updateHelpRequest,
  withdrawHelp,
} from "../controllers/helpRequest.controller.js";
const router = express.Router();

// Help request routes
router.get("/", getHelpRequests);
router.post("/", verifyToken, createHelpRequest);
router.get("/:id", getHelpRequest);
router.put("/:id", verifyToken, updateHelpRequest);
router.delete("/:id", verifyToken, deleteHelpRequest);
router.get("/user/created", verifyToken, getHelpRequestsByUser);

// Helper routes
router.post("/:id/offer-help", verifyToken, offerHelp);
router.delete("/:id/withdraw-help", verifyToken, withdrawHelp);
router.get("/:id/helpers", getHelpRequestHelpers);

// Comment routes
router.post("/:id/comments", verifyToken, addComment);
router.delete("/:id/comments/:commentId", verifyToken, deleteComment);

export default router;
