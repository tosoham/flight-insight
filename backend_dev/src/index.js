import express from "express";
import authRoutes from "./routes/auth.route.js";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Allow frontend (5173) to send cookies to backend (5000)
app.use(cors({
  origin: "http://localhost:5173", // exact frontend origin
  credentials: true,               // allow cookies
}));

// API routes
app.use("/api/auth", authRoutes);

// DB connect + start
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
  });
}).catch(err => {
  console.error("❌ DB connect failed", err);
});
