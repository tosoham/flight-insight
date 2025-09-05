import express from "express";
import { signup, login, logout, checkAuth } from "../controllers/auth.controller.js";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authenticate, logout);
router.get("/check-auth", authenticate, checkAuth);

// Example protected endpoints
router.get("/passengers", authenticate, authorizeRole("passenger"), (req, res) => {
  res.json({ msg: "Passenger home" });
});

router.get("/airlines", authenticate, authorizeRole("airline"), (req, res) => {
  res.json({ msg: "Airline-only dashboard" });
});


router.get("/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

export default router;
