import { useEffect, useState } from "react";
import { Eye, EyeOff, Plane, Mail, Lock, LogIn } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../redux/authSlice";

const isProd = import.meta.env.MODE === "production";
const API_URL = "http://13.235.19.124:5173";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Prefill email from signup redirect or saved email
  useEffect(() => {
    const fromSignup = location.state?.email;
    const savedEmail = localStorage.getItem("savedEmail") || "";
    setFormData((p) => ({
      ...p,
      email: "",
    }));
  }, [location.state]);

  const handleInputChange = (e) => {
    setErrorMsg("");
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1) Login (sets httpOnly cookie)
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg =
          data?.message === "Invalid credentials"
            ? "Invalid email or password."
            : data?.message === "Missing fields"
            ? "Please enter both email and password."
            : data?.message || "Sign in failed. Please try again.";
        setErrorMsg(msg);
        return;
      }

      //Fetch session info (/check-auth)
      const fetchInfo = await fetch(`${API_URL}/api/auth/check-auth`, {
        credentials: "include",
      });
      if (!fetchInfo.ok) {
        setErrorMsg("Login succeeded but session not found. Please try again.");
        return;
      }
      const session = await fetchInfo.json(); // { role, user }

      // 3) Update Redux (slice will persist to sessionStorage)
      dispatch(loginAction(session));

      // 4) Role-based redirect (adjust paths to your routes)
      const redirect =
        session?.role === "airline"
          ? "/airlines"
          : session?.role === "passenger"
          ? "/passengers"
          : "/";
      navigate(redirect, { replace: true });
    } catch (err) {
      setErrorMsg("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background (keep your existing decorations) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 opacity-20">
          <Plane className="w-8 h-8 text-blue-300 transform rotate-45 animate-float" />
        </div>
        <div className="absolute top-40 right-16 opacity-30">
          <Plane className="w-6 h-6 text-white transform rotate-12 animate-float-delay" />
        </div>
        <div className="absolute bottom-32 left-20 opacity-25">
          <Plane className="w-10 h-10 text-indigo-300 transform -rotate-12 animate-float-delay-2" />
        </div>
        <div className="absolute bottom-20 right-32 opacity-20">
          <Plane className="w-7 h-7 text-blue-200 transform rotate-45 animate-float-delay-3" />
        </div>
        <div className="absolute top-60 left-1/2 opacity-15">
          <Plane className="w-9 h-9 text-indigo-200 transform -rotate-45 animate-float" />
        </div>

        {/* Clouds & paths ... keep as-is */}
        <div className="absolute top-16 right-1/4 opacity-10">
          <div className="w-20 h-8 bg-white rounded-full"></div>
          <div className="w-16 h-6 bg-white rounded-full ml-4 -mt-4"></div>
        </div>
        <div className="absolute bottom-40 left-1/3 opacity-10">
          <div className="w-24 h-10 bg-white rounded-full"></div>
          <div className="w-18 h-7 bg-white rounded-full ml-6 -mt-6"></div>
        </div>
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="flightPath" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
              <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0,200 Q 300,100 600,180 T 1200,160"
            stroke="url(#flightPath)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="10,5"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-100"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 0,400 Q 400,300 800,380 T 1200,360"
            stroke="url(#flightPath)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="15,8"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-120"
              dur="10s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl mb-4 shadow-xl">
            <Plane className="w-8 h-8 text-white transform rotate-45" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">
            Sign in to your Flight Insight account
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          {/* Error banner */}
          {errorMsg && (
            <div className="mb-6 rounded-lg bg-red-500/20 text-red-100 px-4 py-3 border border-red-400/40">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-white font-medium mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-white font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3 pl-12 pr-12 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center space-x-2 text-blue-200">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-white/20 bg-white/10"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <Link
                to="/forgot"
                className="text-sm text-blue-300 hover:text-white transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform ${
                loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105"
              } shadow-lg hover:shadow-blue-500/25 flex items-center justify-center space-x-2`}
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
        </div>

        {/* Sign Up link */}
        <div className="text-center mt-6">
          <p className="text-blue-200">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-white font-semibold hover:text-blue-300 transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(45deg);
          }
          50% {
            transform: translateY(-20px) rotate(45deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 6s ease-in-out infinite;
          animation-delay: -2s;
        }
        .animate-float-delay-2 {
          animation: float 8s ease-in-out infinite;
          animation-delay: -4s;
        }
        .animate-float-delay-3 {
          animation: float 7s ease-in-out infinite;
          animation-delay: -1s;
        }
      `}</style>
    </div>
  );
}
