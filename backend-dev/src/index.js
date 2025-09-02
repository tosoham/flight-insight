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
app.use(cors({ origin: true, credentials: true })); // allow frontend cookies
app.use(cookieParser());
app.use(express.json()); // <-- important for req.body
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))

// Routes
app.use("/api/auth", authRoutes);

// Start only after DB connects
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
}).catch(err => {
  console.error("❌ Failed to connect DB", err);
});
