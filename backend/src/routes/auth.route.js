import express from "express";
import {
  checkAuth,
  login,
  logout,
  me,
  signup,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", verifyToken, checkAuth);
router.get("/me", verifyToken, me);

export default router;
