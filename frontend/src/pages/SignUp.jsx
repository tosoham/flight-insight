import { useState } from "react";
import { Eye, EyeOff, Plane, Mail, Lock, User, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const isProd = import.meta.env.MODE === "production";
const API_URL = isProd ? "" : (import.meta.env.VITE_API_URL || "http://localhost:5001");

import { useDispatch } from "react-redux";
import { signupSuccess } from "../redux/authSlice";


export default function SignUp() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setErrorMsg("");
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");

  const fullName = formData.fullName.trim();
  const email = formData.email.trim().toLowerCase();
  const password = formData.password;
  const confirmPassword = formData.confirmPassword;

  if (password !== confirmPassword) {
    setErrorMsg("Passwords do not match.");
    return;
  }
  if (password.length < 8) {
    setErrorMsg("Password must be at least 8 characters.");
    return;
  }
  if (!fullName) {
    setErrorMsg("Please enter your full name.");
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // credentials is fine here; cookie isn’t strictly needed for signup,
      // but including it won’t hurt in dev
      credentials: "include",
      body: JSON.stringify({
        fullName,
        email,
        password,
        confirmPassword,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Map backend errors to friendly text
      if (data?.error === "email_exists") setErrorMsg("An account with this email already exists.");
      else if (data?.error === "missing_fields") setErrorMsg("Please fill in all required fields.");
      else if (data?.error === "password_mismatch") setErrorMsg("Passwords do not match.");
      else if (data?.error === "weak_password") setErrorMsg("Password is too weak.");
      else setErrorMsg(data?.error || "Signup failed. Please try again.");
      return;
    }

    // ✅ Redux hint for UI (optional): remember email to prefill Sign In
    dispatch(signupSuccess({ email }));

    // ✅ Go to Sign In (prefill via route state)
    navigate("/signin", { replace: true, state: { email } });
  } catch (err) {
    setErrorMsg("Network error. Please check your connection and try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations ... (keep your existing SVG/orbs) */}

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-4 shadow-xl">
            <Plane className="w-8 h-8 text-white transform rotate-45" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Flight Insight</h1>
          <p className="text-blue-200">Create your account to predict flight delays</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Error banner */}
          {errorMsg && (
            <div className="mb-6 rounded-lg bg-red-500/20 text-red-100 px-4 py-3 border border-red-400/40">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="mb-6">
              <label htmlFor="fullName" className="block text-white font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className="block text-white font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-white font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Create a password (min 8 chars)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-white font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-8">
              <label className="flex items-start space-x-3 text-blue-200">
                <input type="checkbox" className="rounded border-white/20 bg-white/10 mt-1" required />
                <span className="text-sm leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-blue-300 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-300 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:from-blue-600 hover:to-indigo-600 hover:scale-105"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span>{loading ? "Creating..." : "Create Account"}</span>
            </button>
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-blue-200">
            Already have an account?{" "}
            <Link to="/signin" className="text-white font-semibold hover:text-blue-300">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* If you aren't using styled-jsx, change this to plain <style> or move to a CSS file */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-20px) rotate(45deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float 6s ease-in-out infinite; animation-delay: -2s; }
        .animate-float-delay-2 { animation: float 8s ease-in-out infinite; animation-delay: -4s; }
        .animate-float-delay-3 { animation: float 7s ease-in-out infinite; animation-delay: -1s; }
      `}</style>
    </div>
  );
}
