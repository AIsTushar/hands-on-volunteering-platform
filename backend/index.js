import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js";
import additionalRoutes from "./src/routes/additional.route.js";

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(cookieParser());

dotenv.config();

// Authentication APIs
app.use("/api/auth", authRoutes);
// Profile APIs
app.use("/api/profile", profileRoutes);

// additional APIs
app.use("/api/additional", additionalRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
