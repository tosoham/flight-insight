import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Menu, X, Plane } from "lucide-react";
import { Link } from "react-router-dom";

import {
  selectUser,
  selectRole,
  selectIsAuthenticated,
  login as loginAction,
  logout as logoutAction,
} from "../redux/authSlice";

const isProd = import.meta.env.MODE === "production";
const API_URL = isProd ? "" : (import.meta.env.VITE_API_URL ?? "http://localhost:5001");

export default function Navbar() {
  const dispatch = useDispatch();

  // ===== Redux auth (no local session state) =====
  const user = useSelector(selectUser);
  const role = useSelector(selectRole);
  const isAuthed = useSelector(selectIsAuthenticated);

  const firstName = user?.fullName?.split(" ")[0] ?? null;
  const isPassenger = role === "passenger";
  const ctaText = isPassenger ? "Track My Flight" : "Dashboard";
  // Adjust these routes to your actual app paths:
  const getStartedTo = isAuthed
    ? isPassenger
      ? "/passengers"
      : "/airlines"
    : "/signin";

  // (Optional) Keep Navbar in sync with server cookie.
  // If you already do this in App.jsx, you can remove this effect.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/check-auth`, {
          credentials: "include",
        });
        if (!alive) return;
        if (res.ok) {
          const data = await res.json(); // { user, role }
          dispatch(loginAction(data));
        } else {
          dispatch(logoutAction());
        }
      } catch {
        dispatch(logoutAction());
      }
    })();
    return () => {
      alive = false;
    };
  }, [dispatch]);

  // ===== Existing UI state =====
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (window.location.pathname !== "/") {
      window.location.href = `/#${targetId}`;
      return;
    }
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMenuOpen(false);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.location.href = "/";
    }
    setIsMenuOpen(false);
  };

  // ===== Logout (server + Redux) =====
  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors
    } finally {
      dispatch(logoutAction()); // clears Redux + sessionStorage (via reducer)
      setIsMenuOpen(false);
      window.location.href = "/";
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-gray-200/50"
          : "bg-gradient-to-r from-gray-900/80 via-gray-800/70 to-gray-900/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
              <Plane className="w-6 h-6 text-white transform rotate-45" />
            </div>
            <div>
              <Link
                to="/"
                onClick={handleHomeClick}
                className="text-xl font-bold text-white hover:text-blue-200 transition-colors"
              >
                Flight Insight
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              onClick={handleHomeClick}
              className="text-white hover:-translate-y-1 transition-transform font-medium"
            >
              Home
            </Link>

            <a
              href="/#solutions"
              onClick={(e) => handleSmoothScroll(e, "solutions")}
              className="text-white hover:-translate-y-1 transition-transform font-medium cursor-pointer"
            >
              Solutions
            </a>

            <a
              href="/#why-us"
              onClick={(e) => handleSmoothScroll(e, "why-us")}
              className="text-white hover:-translate-y-1 transition-transform font-medium cursor-pointer"
            >
              Why Us?
            </a>

            <a
              href="/#how"
              onClick={(e) => handleSmoothScroll(e, "how")}
              className="text-white hover:-translate-y-1 transition-transform font-medium cursor-pointer"
            >
              How We Do It
            </a>

            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-200">
              {!isAuthed ? (
                <>
                  <Link
                    to="/signin"
                    className="text-white hover:-translate-y-1 transition-transform font-medium"
                  >
                    Sign In
                  </Link>
                  <Link to={getStartedTo}>
                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
               <>
  {firstName && (
    <span className="text-white/80 font-medium">Hi, {firstName}</span>
  )}
  <button
    onClick={handleLogout}
    className="text-white/90 hover:text-white transition-colors font-medium"
  >
    Logout
  </button>
  <Link to={getStartedTo}>
    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
      {ctaText}
    </button>
  </Link>
</>

              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          <div className="pt-4 space-y-2">
            <a
              href="/"
              onClick={handleHomeClick}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
            >
              Home
            </a>

            <a
              href="/#solutions"
              onClick={(e) => handleSmoothScroll(e, "solutions")}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium cursor-pointer"
            >
              Solutions
            </a>

            <a
              href="/#why-us"
              onClick={(e) => handleSmoothScroll(e, "why-us")}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium cursor-pointer"
            >
              Why Us
            </a>

            <a
              href="/#how"
              onClick={(e) => handleSmoothScroll(e, "how")}
              className="block px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium cursor-pointer"
            >
              How We Do It
            </a>

            <div className="pt-4 space-y-2 border-t border-gray-200/20">
              {!isAuthed ? (
                <>
                  <Link
                    to="/signin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to={getStartedTo}
                    onClick={() => setIsMenuOpen(false)}
                    className="block w-full"
                  >
                    <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
                      Get Started
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  {firstName && (
                    <div className="px-4 text-white/80">Hi, {firstName}</div>
                  )}
                  <Link to={getStartedTo} onClick={() => setIsMenuOpen(false)} className="block w-full">
  <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all">
    {ctaText}
  </button>
</Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
