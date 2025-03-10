import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./src/routes/auth.route.js";
import profileRoutes from "./src/routes/profile.route.js";
import eventRoutes from "./src/routes/event.route.js";
import additionalRoutes from "./src/routes/additional.route.js";
import helpRequestRoutes from "./src/routes/helpRequest.route.js";
import { getHomePageData } from "./src/controllers/others.controller.js";

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

dotenv.config();

app.get("/home", getHomePageData);

// Authentication APIs
app.use("/api/auth", authRoutes);
// Profile APIs
app.use("/api/profile", profileRoutes);
// Event APIs
app.use("/api/event", eventRoutes);

//Help Request APIs
app.use("/api/help-requests", helpRequestRoutes);

// additional APIs
app.use("/api/additional", additionalRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
