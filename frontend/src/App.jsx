import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import HowItWorks from "./components/HowItWorks";
import Footer from "./components/Footer";
import WhoIsItFor from "./components/WhoIsItFor";

// Pages
import PassengerHub from "./pages/PassengerHub";
import AirlinesDashboard from "./pages/AirlinesDashboard"; // <-- Import the Airlines Dashboard page
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { useDispatch } from "react-redux";
import { login, logout as logoutAction } from "../src/redux/authSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/check-auth`, { credentials: "include" });
        if (!alive) return;
        if (res.ok) {
          const data = await res.json(); // { role, user }
          dispatch(login(data));
        } else {
          dispatch(logoutAction());
        }
      } catch {
        dispatch(logoutAction());
      }
    })();
    return () => { alive = false; };
  }, [dispatch]);

  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Routes>
        {/* Authentication routes - without navbar/footer */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Main app routes - with navbar/footer */}
        <Route path="/*" element={
          <>
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Home route */}
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <WhoIsItFor/>
                      <Stats />
                      <HowItWorks />
                    </>
                  }
                />

                {/* PassengerHub page route */}
                <Route path="/passengers" element={<PassengerHub />} />

                {/* Airlines Dashboard route */}
                <Route path="/airlines" element={<AirlinesDashboard />} />
              </Routes>
            </main>
            <Footer />
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
