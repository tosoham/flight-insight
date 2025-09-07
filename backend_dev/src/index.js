// backend/src/index.js (or backend/index.js)
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import { connectDB } from "./db/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const isProd = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5001;   // use 5001 as default

// --- middleware ---
app.set("trust proxy", 1);               // needed behind nginx/caddy/ALB
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// CORS only for local dev (5173/3000). In prod we use same-origin "/api".
if (!isProd) {
  app.use(
    cors({
      origin: ["http://localhost:5173", "http://localhost:3000"],
      credentials: true,
    })
  );
}

// health check (handy for deploy tests)
app.get("/api/healthz", (req, res) => res.send("ok"));

// API routes
app.use("/api/auth", authRoutes);

// --- start ---
connectDB()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${port} (${isProd ? "prod" : "dev"})`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connect failed", err);
    process.exit(1);
  });
