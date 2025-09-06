import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AIRLINE_ALLOWLIST } from "../config/airlineAllowlist.js";
import { User } from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const ONE_HOUR_MS = 60 * 60 * 1000;
const IS_PROD = process.env.NODE_ENV === "production";

// --- SIGNUP (always passenger) ---
export async function signup(req, res) {
  try {
    let { fullName, email, password, confirmPassword } = req.body || {};
    fullName = (fullName || "").trim();
    email = (email || "").toLowerCase().trim();

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: "missing_fields" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "password_mismatch" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "weak_password", minLength: 8 });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "email_exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      passwordHash: hash,
      role: "passenger",
    });

    const safeUser = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.status(201).json({ message: "signup_ok", user: safeUser });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ error: "server_error" });
  }
}


// --- LOGIN (hardcoded airline first, else DB user) ---
export const login = async (req, res) => {
  try {
    let { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }
    email = email.toLowerCase().trim();

    // ---------- 1) HARD-CODED AIRLINE LOGIN ----------
    if (AIRLINE_ALLOWLIST[email] && password === AIRLINE_ALLOWLIST[email].password) {
      const acct = AIRLINE_ALLOWLIST[email];

      const payload = {
        id: email,
        role: "airline",
        airlineId: acct.airlineId,
        airlineName: acct.airlineName,
        plan: acct.plan,                         // "free" | "subscribed"
        subscribed: acct.plan === "subscribed",  // boolean for quick checks
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: IS_PROD,
        sameSite: "strict",
        maxAge: ONE_HOUR_MS,
      });

      return res.json({ message: "Login successful", user: payload, token });
    }

    // ---------- 2) NORMAL DB USER (PASSENGER) ----------
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const payload = { id: user._id, role: user.role || "passenger" };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: "strict",
      maxAge: ONE_HOUR_MS,
    });

    return res.json({ message: "Login successful", user: payload, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// --- LOGOUT (clear cookie) ---
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: IS_PROD,
      maxAge: 0,
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const checkAuth = (req, res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check Auth controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}
