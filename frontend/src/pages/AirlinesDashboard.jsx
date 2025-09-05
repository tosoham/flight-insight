// import { useState, useEffect } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   PieChart,
//   Pie,
//   Cell,
//   AreaChart,
//   Area,
// } from "recharts";
// import { TrendingUp, TrendingDown, Plane, Clock, Users, AlertTriangle } from "lucide-react";
// import  FlightScheduleSection  from "../components/FlightScheduleSection";

// // Counter component with animation
// function AnimatedCounter({ value, duration = 2000, suffix = "" }) {
//   const [count, setCount] = useState(0);
  
//   useEffect(() => {
//     let startTimestamp = null;
//     const step = (timestamp) => {
//       if (!startTimestamp) startTimestamp = timestamp;
//       const progress = Math.min((timestamp - startTimestamp) / duration, 1);
//       setCount(Math.floor(progress * value));
//       if (progress < 1) {
//         window.requestAnimationFrame(step);
//       }
//     };
//     window.requestAnimationFrame(step);
//   }, [value, duration]);
  
//   return <span>{count}{suffix}</span>;
// }

// export default function Airlines() {
//   const [activeTab, setActiveTab] = useState("overview");

//   // Enhanced sample data
//   const performanceData = [
//     { name: "Your Airline", value: 78, color: "#3b82f6" },
//     { name: "Delta", value: 82, color: "#ef4444" },
//     { name: "United", value: 75, color: "#f59e0b" },
//     { name: "American", value: 79, color: "#10b981" },
//     { name: "Industry Avg", value: 77, color: "#6b7280" },
//   ];

//   const trendData = [
//     { month: "Jan", delays: 123, onTime: 76, cancelled: 12, satisfaction: 4.1 },
//     { month: "Feb", delays: 128, onTime: 72, cancelled: 15, satisfaction: 3.9 },
//     { month: "Mar", delays: 118, onTime: 81, cancelled: 8, satisfaction: 4.2 },
//     { month: "Apr", delays: 135, onTime: 65, cancelled: 18, satisfaction: 3.8 },
//     { month: "May", delays: 110, onTime: 88, cancelled: 6, satisfaction: 4.4 },
//     { month: "Jun", delays: 95, onTime: 92, cancelled: 4, satisfaction: 4.6 },
//   ];

//   const delayReasons = [
//     { name: "Weather", value: 35, color: "#3b82f6" },
//     { name: "Technical Issues", value: 25, color: "#ef4444" },
//     { name: "Crew Related", value: 20, color: "#f59e0b" },
//     { name: "Air Traffic Control", value: 15, color: "#10b981" },
//     { name: "Other", value: 5, color: "#8b5cf6" },
//   ];

//   const routeData = [
//     { route: "NYC → LAX", delays: 32, onTime: 68, trend: "down" },
//     { route: "ATL → ORD", delays: 28, onTime: 72, trend: "up" },
//     { route: "DFW → DEN", delays: 24, onTime: 76, trend: "down" },
//     { route: "LAX → JFK", delays: 22, onTime: 78, trend: "stable" },
//     { route: "ORD → MIA", delays: 19, onTime: 81, trend: "up" },
//   ];

//   const predictiveData = [
//     { hour: "00:00", predicted: 85, actual: 82 },
//     { hour: "04:00", predicted: 92, actual: 89 },
//     { hour: "08:00", predicted: 75, actual: 73 },
//     { hour: "12:00", predicted: 68, actual: 71 },
//     { hour: "16:00", predicted: 62, actual: 65 },
//     { hour: "20:00", predicted: 78, actual: 76 },
//   ];

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-3 rounded-lg shadow-lg border">
//           <p className="font-medium">{`${label}`}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ color: entry.color }}>
//               {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'onTime' ? '%' : ''}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
//       <div className="max-w-7xl mx-auto mt-15">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <Plane className="h-8 w-8 text-blue-600" />
//             <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//               Flight Delay Prediction Dashboard
//             </h1>
//           </div>
//           <p className="text-gray-600 text-lg">
//             AI-powered analytics to optimize airline operations and predict delays
//           </p>
//         </div>

//         {/* Enhanced Tabs */}
//         <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
//           {[
//             { id: "overview", label: "Overview", icon: "📊" },
//             { id: "analysis", label: "Analysis", icon: "🔍" },
//             { id: "prediction", label: "Prediction", icon: "🔮" },
//             { id: "schedule", label: "Schedule", icon: "🗓️" },
//             { id: "insights", label: "Insights", icon: "💡" }
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
//                 activeTab === tab.id
//                   ? "bg-blue-600 text-white shadow-md transform scale-105"
//                   : "hover:bg-blue-50 text-gray-600"
//               }`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               <span>{tab.icon}</span>
//               {tab.label}
//             </button>
//           ))}
//         </div>

//         {/* OVERVIEW TAB */}
//         {activeTab === "overview" && (
//           <div className="space-y-6">
//             {/* KPI Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500 font-medium">On-Time Performance</p>
//                     <h3 className="text-3xl font-bold text-green-600 mt-1">
//                       <AnimatedCounter value={78} suffix="%" />
//                     </h3>
//                     <div className="flex items-center mt-2 text-sm text-green-600">
//                       <TrendingUp className="h-4 w-4 mr-1" />
//                       +2.1% vs last month
//                     </div>
//                   </div>
//                   <div className="bg-green-100 p-3 rounded-full">
//                     <Clock className="h-6 w-6 text-green-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500 font-medium">Avg Delay Time</p>
//                     <h3 className="text-3xl font-bold text-red-600 mt-1">
//                       <AnimatedCounter value={23} suffix=" min" />
//                     </h3>
//                     <div className="flex items-center mt-2 text-sm text-green-600">
//                       <TrendingDown className="h-4 w-4 mr-1" />
//                       -4 min vs last month
//                     </div>
//                   </div>
//                   <div className="bg-red-100 p-3 rounded-full">
//                     <AlertTriangle className="h-6 w-6 text-red-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500 font-medium">Total Flights</p>
//                     <h3 className="text-3xl font-bold text-blue-600 mt-1">
//                       <AnimatedCounter value={1247} />
//                     </h3>
//                     <p className="text-sm text-gray-500 mt-2">This month</p>
//                   </div>
//                   <div className="bg-blue-100 p-3 rounded-full">
//                     <Plane className="h-6 w-6 text-blue-600" />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm text-gray-500 font-medium">Customer Rating</p>
//                     <h3 className="text-3xl font-bold text-purple-600 mt-1">
//                       <AnimatedCounter value={4.2} duration={2000} />/5
//                     </h3>
//                     <div className="flex items-center mt-2 text-sm text-green-600">
//                       <TrendingUp className="h-4 w-4 mr-1" />
//                       +0.3 vs last month
//                     </div>
//                   </div>
//                   <div className="bg-purple-100 p-3 rounded-full">
//                     <Users className="h-6 w-6 text-purple-600" />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Charts */}
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//               {/* Performance Comparison */}
//               <div className="bg-white p-6 rounded-2xl shadow-lg">
//                 <div className="flex justify-between items-center mb-6">
//                   <h4 className="text-xl font-bold text-gray-800">Industry Performance Comparison</h4>
//                   <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                     Export Report
//                   </button>
//                 </div>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                     <defs>
//                       <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
//                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="name" tick={{ fontSize: 12 }} />
//                     <YAxis tick={{ fontSize: 12 }} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Trend Analysis */}
//               <div className="bg-white p-6 rounded-2xl shadow-lg">
//                 <h4 className="text-xl font-bold text-gray-800 mb-6">Performance Trends</h4>
//                 <ResponsiveContainer width="100%" height={350}>
//                   <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                     <defs>
//                       <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
//                         <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
//                       </linearGradient>
//                       <linearGradient id="colorDelays" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
//                         <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                     <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//                     <YAxis tick={{ fontSize: 12 }} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area type="monotone" dataKey="onTime" stackId="1" stroke="#22c55e" fill="url(#colorOnTime)" />
//                     <Area type="monotone" dataKey="delays" stackId="2" stroke="#ef4444" fill="url(#colorDelays)" />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ANALYSIS TAB */}
//         {activeTab === "analysis" && (
//           <div className="space-y-6">
//             <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//               {/* Delay Reasons */}
//               <div className="bg-white p-6 rounded-2xl shadow-lg">
//                 <h4 className="text-xl font-bold text-gray-800 mb-6">Delay Reasons Breakdown</h4>
//                 <ResponsiveContainer width="100%" height={400}>
//                   <PieChart>
//                     <Pie
//                       data={delayReasons}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={120}
//                       innerRadius={60}
//                       paddingAngle={2}
//                     >
//                       {delayReasons.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={entry.color} />
//                       ))}
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Route Analysis */}
//               <div className="bg-white p-6 rounded-2xl shadow-lg">
//                 <h4 className="text-xl font-bold text-gray-800 mb-6">Top Affected Routes</h4>
//                 <div className="space-y-4">
//                   {routeData.map((route, index) => (
//                     <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
//                       <div className="flex items-center gap-3">
//                         <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
//                           {index + 1}
//                         </div>
//                         <span className="font-medium text-gray-800">{route.route}</span>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <div className="text-right">
//                           <p className="text-red-600 font-bold">{route.delays} delays</p>
//                           <p className="text-green-600 text-sm">{route.onTime}% on-time</p>
//                         </div>
//                         <div className="w-6 h-6">
//                           {route.trend === "up" && <TrendingUp className="text-green-500" />}
//                           {route.trend === "down" && <TrendingDown className="text-red-500" />}
//                           {route.trend === "stable" && <div className="w-6 h-1 bg-gray-400 rounded"></div>}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* PREDICTION TAB */}
//         {activeTab === "prediction" && (
//           <div className="space-y-6">
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <h4 className="text-xl font-bold text-gray-800 mb-6">Hourly Prediction vs Actual Performance</h4>
//               <ResponsiveContainer width="100%" height={400}>
//                 <LineChart data={predictiveData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
//                   <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
//                   <YAxis tick={{ fontSize: 12 }} />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend />
//                   <Line 
//                     type="monotone" 
//                     dataKey="predicted" 
//                     stroke="#3b82f6" 
//                     strokeWidth={3}
//                     dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
//                     name="AI Predicted"
//                   />
//                   <Line 
//                     type="monotone" 
//                     dataKey="actual" 
//                     stroke="#22c55e" 
//                     strokeWidth={3}
//                     strokeDasharray="5 5"
//                     dot={{ fill: '#22c55e', strokeWidth: 2, r: 6 }}
//                     name="Actual Performance"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white">
//                 <h5 className="font-bold mb-2">Prediction Accuracy</h5>
//                 <p className="text-3xl font-bold"><AnimatedCounter value={94} suffix="%" /></p>
//                 <p className="text-blue-100 text-sm">Last 30 days average</p>
//               </div>
//               <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl text-white">
//                 <h5 className="font-bold mb-2">Early Warning</h5>
//                 <p className="text-3xl font-bold"><AnimatedCounter value={87} suffix="%" /></p>
//                 <p className="text-green-100 text-sm">Delays predicted 2h+ ahead</p>
//               </div>
//               <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl text-white">
//                 <h5 className="font-bold mb-2">Cost Savings</h5>
//                 <p className="text-3xl font-bold">$<AnimatedCounter value={2.4} suffix="M" /></p>
//                 <p className="text-purple-100 text-sm">Estimated monthly savings</p>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* ===== SCHEDULE TAB ===== */}
// {activeTab === "schedule" && (
//   <div className="space-y-6">
//     {/* Flight Schedule (filters + table) */}
//     <FlightScheduleSection/>
//   </div>
// )}

//         {/* INSIGHTS TAB */}
//         {activeTab === "insights" && (
//           <div className="space-y-6">
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <h4 className="text-xl font-bold text-gray-800 mb-6">🤖 AI-Powered Recommendations</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {[
//                   {
//                     title: "Crew Optimization",
//                     description: "Optimize crew scheduling algorithms to reduce delays by approximately 15%",
//                     impact: "High",
//                     timeframe: "2-3 weeks",
//                     color: "blue"
//                   },
//                   {
//                     title: "Maintenance Scheduling",
//                     description: "Increase preventive maintenance checks on aircraft older than 10 years",
//                     impact: "Medium",
//                     timeframe: "1 month",
//                     color: "orange"
//                   },
//                   {
//                     title: "ATC Collaboration",
//                     description: "Implement data sharing with air traffic control for better flow management",
//                     impact: "High",
//                     timeframe: "6-8 weeks",
//                     color: "green"
//                   },
//                   {
//                     title: "Customer Communication",
//                     description: "Deploy proactive passenger notification system for delay predictions",
//                     impact: "Medium",
//                     timeframe: "2 weeks",
//                     color: "purple"
//                   }
//                 ].map((recommendation, index) => (
//                   <div key={index} className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-xl">
//                     <h5 className="font-bold text-gray-800 mb-2">{recommendation.title}</h5>
//                     <p className="text-gray-600 mb-3">{recommendation.description}</p>
//                     <div className="flex gap-2">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         recommendation.impact === 'High' 
//                           ? 'bg-red-100 text-red-700' 
//                           : 'bg-yellow-100 text-yellow-700'
//                       }`}>
//                         {recommendation.impact} Impact
//                       </span>
//                       <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
//                         {recommendation.timeframe}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl text-white">
//               <h4 className="text-2xl font-bold mb-4">🚀 Next Steps</h4>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h5 className="font-bold mb-2">Immediate Actions</h5>
//                   <ul className="space-y-2 text-indigo-100">
//                     <li>• Deploy weather prediction model for NYC-LAX route</li>
//                     <li>• Implement real-time crew tracking system</li>
//                     <li>• Set up automated passenger notifications</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h5 className="font-bold mb-2">Long-term Strategy</h5>
//                   <ul className="space-y-2 text-indigo-100">
//                     <li>• Develop machine learning model for route optimization</li>
//                     <li>• Integrate with external weather and traffic APIs</li>
//                     <li>• Build predictive maintenance scheduling system</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
   RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TrendingUp, TrendingDown, Plane, Clock, Users, AlertTriangle } from "lucide-react";
import FlightScheduleSection from "../components/FlightScheduleSection";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

// ---------- helper: get current user from /api/auth/me (JWT cookie) ----------
async function fetchMe() {
  try {
    const res = await fetch(`${API_URL}/api/auth/me`, { credentials: "include" });
    console.log("fetch /me", res);
    if (!res.ok) return null;
    const json = await res.json();
    return json?.user || null; // { role, airlineName, plan, subscribed, ... }
  } catch {
    return null;
  }
}

// Counter component with animation
function AnimatedCounter({ value, duration = 2000, suffix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}

export default function Airlines() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  // 🔹 Form state
  const [formData, setFormData] = useState({
    date: "",
    airline: "",
    flight_number: "",
    tail_number: "",
    origin_airport: "",
    destination_airport: "",
    scheduled_departure: "",
    departure_time: "",
    departure_delay: "",
    taxi_out: "",
    wheels_off: "",
    scheduled_time: "",
    elapsed_time: "",
    air_time: "",
    distance: "",
    wheels_on: "",
    taxi_in: "",
    scheduled_arrival: "",
    arrival_time: "",
    air_system_delay: "",
    security_delay: "",
    airline_delay: "",
    late_aircraft_delay: "",
    weather_delay: "",
    origin_lat: "",
    origin_lon: "",
    dest_lat: "",
    dest_lon: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Handle form updates (null/NaN → 0)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value || "0" }));
  };

  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);
    try {
      const res = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setPrediction(data?.prediction || "No result");
    } catch (err) {
      console.error("Prediction error", err);
      setPrediction("Error occurred, try again");
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = !!user?.subscribed; // plan-aware gating

  useEffect(() => {
    (async () => {
      const me = await fetchMe();
      setUser(me);
    })();
  }, []);

  // Enhanced sample data (unchanged)
  const performanceData = [
    { name: "Your Airline", value: 78, color: "#3b82f6" },
    { name: "Delta", value: 82, color: "#ef4444" },
    { name: "United", value: 75, color: "#f59e0b" },
    { name: "American", value: 79, color: "#10b981" },
    { name: "Industry Avg", value: 77, color: "#6b7280" },
  ];

  const trendData = [
    { month: "Jan", delays: 123, onTime: 76, cancelled: 12, satisfaction: 4.1 },
    { month: "Feb", delays: 128, onTime: 72, cancelled: 15, satisfaction: 3.9 },
    { month: "Mar", delays: 118, onTime: 81, cancelled: 8, satisfaction: 4.2 },
    { month: "Apr", delays: 135, onTime: 65, cancelled: 18, satisfaction: 3.8 },
    { month: "May", delays: 110, onTime: 88, cancelled: 6, satisfaction: 4.4 },
    { month: "Jun", delays: 95, onTime: 92, cancelled: 4, satisfaction: 4.6 },
  ];

  const delayReasons = [
    { name: "Weather", value: 35, color: "#3b82f6" },
    { name: "Technical Issues", value: 25, color: "#ef4444" },
    { name: "Crew Related", value: 20, color: "#f59e0b" },
    { name: "Air Traffic Control", value: 15, color: "#10b981" },
    { name: "Other", value: 5, color: "#8b5cf6" },
  ];

  const routeData = [
    { route: "NYC → LAX", delays: 32, onTime: 68, trend: "down" },
    { route: "ATL → ORD", delays: 28, onTime: 72, trend: "up" },
    { route: "DFW → DEN", delays: 24, onTime: 76, trend: "down" },
    { route: "LAX → JFK", delays: 22, onTime: 78, trend: "stable" },
    { route: "ORD → MIA", delays: 19, onTime: 81, trend: "up" },
  ];

  const predictiveData = [
    { hour: "00:00", predicted: 85, actual: 82 },
    { hour: "04:00", predicted: 92, actual: 89 },
    { hour: "08:00", predicted: 75, actual: 73 },
    { hour: "12:00", predicted: 68, actual: 71 },
    { hour: "16:00", predicted: 62, actual: 65 },
    { hour: "20:00", predicted: 78, actual: 76 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'onTime' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto mt-15">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Flight Delay Prediction Dashboard
            </h1>

            {/* Plan badge */}
            <span
              className={`ml-3 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isSubscribed
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
              }`}
              title={isSubscribed ? "Subscribed plan" : "Free plan"}
            >
              {isSubscribed ? "Subscribed" : "Free"}
            </span>
          </div>
          <p className="text-gray-600 text-lg">
            AI-powered analytics to optimize airline operations and predict delays
          </p>
          {user?.airlineName && (
            <p className="text-sm text-gray-500 mt-1">Airline: {user.airlineName}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
          {[
            { id: "overview", label: "Overview", icon: "📊" },
            { id: "analysis", label: "Analysis", icon: "🔍" },
            { id: "prediction", label: "Prediction", icon: "🔮" },
            { id: "schedule", label: "Schedule", icon: "🗓️" },
            { id: "insights", label: "Insights", icon: "💡" }
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "hover:bg-blue-50 text-gray-600"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">On-Time Performance</p>
                    <h3 className="text-3xl font-bold text-green-600 mt-1">
                      <AnimatedCounter value={78} suffix="%" />
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +2.1% vs last month
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Avg Delay Time</p>
                    <h3 className="text-3xl font-bold text-red-600 mt-1">
                      <AnimatedCounter value={23} suffix=" min" />
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      -4 min vs last month
                    </div>
                  </div>
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Total Flights</p>
                    <h3 className="text-3xl font-bold text-blue-600 mt-1">
                      <AnimatedCounter value={1247} />
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">This month</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Customer Rating</p>
                    <h3 className="text-3xl font-bold text-purple-600 mt-1">
                      <AnimatedCounter value={4.2} duration={2000} />/5
                    </h3>
                    <div className="flex items-center mt-2 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +0.3 vs last month
                    </div>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts row: LEFT gated, RIGHT always visible */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* LEFT: Competitor Comparison (GATED) */}
              <div className="bg-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-xl font-bold text-gray-800">
                    {isSubscribed ? "Industry Performance Comparison" : "Your Performance"}
                  </h4>

                  {isSubscribed ? (
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Export Report
                    </button>
                  ) : null}
                </div>
                

                {isSubscribed ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  
                ) : (
                  <div className="p-5 rounded-xl bg-gray-50 border border-dashed">
                    <p className="text-sm text-gray-600 mb-3">
                      You’re on the <b>Free</b> plan. Competitor comparison is locked.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-white border">
                        <p className="text-xs text-gray-500">On-Time Performance</p>
                        <p className="text-2xl font-bold text-green-600">78%</p>
                        <p className="text-xs text-green-600 mt-1">+2.1% vs last month</p>
                      </div>
                      <div className="p-4 rounded-lg bg-white border">
                        <p className="text-xs text-gray-500">Avg Delay Time</p>
                        <p className="text-2xl font-bold text-red-600">23 min</p>
                        <p className="text-xs text-green-600 mt-1">-4 min vs last month</p>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      Upgrade to <b>Subscribed</b> to see competitor benchmarks and export reports.
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT: Trend Analysis (always visible) */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Performance Trends</h4>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorOnTime" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorDelays" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="onTime" stackId="1" stroke="#22c55e" fill="url(#colorOnTime)" />
                    <Area type="monotone" dataKey="delays" stackId="2" stroke="#ef4444" fill="url(#colorDelays)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            

            {/* Executive Report (only for subscribed) */}
            {isSubscribed && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">Executive Report</h4>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Download PDF
                    </button>
                    <button className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      Share Link
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-xl">
                    <p className="text-xs text-gray-500">On-Time (30d)</p>
                    <p className="text-2xl font-bold text-green-600">82%</p>
                    <p className="text-xs text-gray-500 mt-1">vs industry 77%</p>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <p className="text-xs text-gray-500">Delay Drivers</p>
                    <p className="text-sm font-medium mt-1">Weather (35%), Tech (25%), Crew (20%)</p>
                  </div>
                  <div className="p-4 border rounded-xl">
                    <p className="text-xs text-gray-500">Recommendations</p>
                    <p className="text-sm mt-1">Crew rostering, ATC coordination, predictive maintenance</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYSIS TAB */}
        {activeTab === "analysis" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Delay Reasons */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Delay Reasons Breakdown</h4>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={delayReasons}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      paddingAngle={2}
                    >
                      {delayReasons.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Route Analysis */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-6">Top Affected Routes</h4>
                <div className="space-y-4">
                  {routeData.map((route, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="font-medium text-gray-800">{route.route}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-red-600 font-bold">{route.delays} delays</p>
                          <p className="text-green-600 text-sm">{route.onTime}% on-time</p>
                        </div>
                        <div className="w-6 h-6">
                          {route.trend === "up" && <TrendingUp className="text-green-500" />}
                          {route.trend === "down" && <TrendingDown className="text-red-500" />}
                          {route.trend === "stable" && <div className="w-6 h-1 bg-gray-400 rounded"></div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PREDICTION TAB */}
        {activeTab === "prediction" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h4 className="text-xl font-bold text-gray-800 mb-6">AI Delay Prediction</h4>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* Basic Flight Info */}
              <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Basic Flight Info</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="date" placeholder="dd/mm/yyyy" value={formData.date} onChange={handleChange} className="border p-2 rounded" />

                  {/* Airline dropdown */}
                  <select name="airline" value={formData.airline} onChange={handleChange} className="border p-2 rounded">
                    <option value="">Select Airline</option>
                    <option value="AA">American Airlines</option>
                    <option value="DL">Delta</option>
                    <option value="UA">United</option>
                    <option value="WN">Southwest</option>
                  </select>

                  <select name="airline" value={formData.tail_number} onChange={handleChange} className="border p-2 rounded">
                    <option value="">Select Tail Number</option>
                    <option value="AA">American Airlines</option>
                    <option value="DL">Delta</option>
                    <option value="UA">United</option>
                    <option value="WN">Southwest</option>
                  </select>

                  <input type="text" name="flight_number" placeholder="Flight Number" value={formData.flight_number} onChange={handleChange} className="border p-2 rounded" />
                </div>
              </div>

              {/* Departure Details */}
              <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Departure Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Origin Airport dropdown */}
                  <select name="origin_airport" value={formData.origin_airport} onChange={handleChange} className="border p-2 rounded">
                    <option value="">Origin Airport</option>
                    <option value="JFK">JFK - New York</option>
                    <option value="LAX">LAX - Los Angeles</option>
                    <option value="ORD">ORD - Chicago</option>
                  </select>

                  <input type="text" name="scheduled_departure" placeholder="Scheduled Departure" value={formData.scheduled_departure} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="departure_time" placeholder="Departure Time" value={formData.departure_time} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="departure_delay" placeholder="Departure Delay" value={formData.departure_delay} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="taxi_out" placeholder="Taxi Out" value={formData.taxi_out} onChange={handleChange} className="border p-2 rounded" />
                  {/* <input type="text" name="wheels_off" placeholder="Wheels Off" value={formData.wheels_off} onChange={handleChange} className="border p-2 rounded" /> */}
                </div>
              </div>

              {/* Arrival Details */}
              <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Arrival Details</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Destination Airport dropdown */}
                  <select name="destination_airport" value={formData.destination_airport} onChange={handleChange} className="border p-2 rounded">
                    <option value="">Destination Airport</option>
                    <option value="ATL">ATL - Atlanta</option>
                    <option value="SFO">SFO - San Francisco</option>
                    <option value="MIA">MIA - Miami</option>
                  </select>

                  <input type="text" name="scheduled_arrival" placeholder="Scheduled Arrival" value={formData.scheduled_arrival} onChange={handleChange} className="border p-2 rounded" />
                  {/* <input type="text" name="arrival_time" placeholder="Arrival Time" value={formData.arrival_time} onChange={handleChange} className="border p-2 rounded" /> */}
                  <input type="text" name="scheduled_time" placeholder="Scheduled Time" value={formData.scheduled_time} onChange={handleChange} className="border p-2 rounded" />
                  {/* <input type="text" name="elapsed_time" placeholder="Elapsed Time" value={formData.elapsed_time} onChange={handleChange} className="border p-2 rounded" /> */}
                  {/* <input type="text" name="air_time" placeholder="Air Time" value={formData.air_time} onChange={handleChange} className="border p-2 rounded" /> */}
                  <input type="text" name="distance" placeholder="Distance" value={formData.distance} onChange={handleChange} className="border p-2 rounded" />
                  {/* <input type="text" name="wheels_on" placeholder="Wheels On" value={formData.wheels_on} onChange={handleChange} className="border p-2 rounded" /> */}
                  {/* <input type="text" name="taxi_in" placeholder="Taxi In" value={formData.taxi_in} onChange={handleChange} className="border p-2 rounded" /> */}
                </div>
              </div>

              {/* Delay Information */}
              {/* <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Delay Information</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="air_system_delay" placeholder="Air System Delay" value={formData.air_system_delay} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="security_delay" placeholder="Security Delay" value={formData.security_delay} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="airline_delay" placeholder="Airline Delay" value={formData.airline_delay} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="late_aircraft_delay" placeholder="Late Aircraft Delay" value={formData.late_aircraft_delay} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="weather_delay" placeholder="Weather Delay" value={formData.weather_delay} onChange={handleChange} className="border p-2 rounded" />
                </div>
              </div> */}

              {/* Geolocation */}
              {/* <div>
                <h5 className="text-lg font-semibold text-gray-700 mb-4">Geolocation</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" name="origin_lat" placeholder="Origin Latitude" value={formData.origin_lat} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="origin_lon" placeholder="Origin Longitude" value={formData.origin_lon} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="dest_lat" placeholder="Destination Latitude" value={formData.dest_lat} onChange={handleChange} className="border p-2 rounded" />
                  <input type="text" name="dest_lon" placeholder="Destination Longitude" value={formData.dest_lon} onChange={handleChange} className="border p-2 rounded" />
                </div>
              </div> */}

              {/* Submit Button */}
              <div class="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className={`w-64 py-2 rounded transition ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {loading ? "Predicting..." : "Get Prediction"}
              </button>
              </div>
            </form>

            {/* Loader / Result */}
            {loading && (
              <div className="mt-6 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              </div>
            )}

            {!loading && prediction && (
              <div className="mt-6 p-4 bg-blue-50 border rounded-lg text-center">
                <p className="text-lg font-semibold text-gray-800">Predicted Delay: {prediction}</p>
              </div>
            )}
          </div>
        </div>
      )}


        {/* ===== SCHEDULE TAB ===== */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <FlightScheduleSection/>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === "insights" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-6">🤖 AI-Powered Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Crew Optimization",
                    description: "Optimize crew scheduling algorithms to reduce delays by approximately 15%",
                    impact: "High",
                    timeframe: "2-3 weeks",
                    color: "blue"
                  },
                  {
                    title: "Maintenance Scheduling",
                    description: "Increase preventive maintenance checks on aircraft older than 10 years",
                    impact: "Medium",
                    timeframe: "1 month",
                    color: "orange"
                  },
                  {
                    title: "ATC Collaboration",
                    description: "Implement data sharing with air traffic control for better flow management",
                    impact: "High",
                    timeframe: "6-8 weeks",
                    color: "green"
                  },
                  {
                    title: "Customer Communication",
                    description: "Deploy proactive passenger notification system for delay predictions",
                    impact: "Medium",
                    timeframe: "2 weeks",
                    color: "purple"
                  }
                ].map((recommendation, index) => (
                  <div key={index} className="p-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-xl">
                    <h5 className="font-bold text-gray-800 mb-2">{recommendation.title}</h5>
                    <p className="text-gray-600 mb-3">{recommendation.description}</p>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        recommendation.impact === 'High' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {recommendation.impact} Impact
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {recommendation.timeframe}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl text-white">
              <h4 className="text-2xl font-bold mb-4">🚀 Next Steps</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-bold mb-2">Immediate Actions</h5>
                  <ul className="space-y-2 text-indigo-100">
                    <li>• Deploy weather prediction model for NYC-LAX route</li>
                    <li>• Implement real-time crew tracking system</li>
                    <li>• Set up automated passenger notifications</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-bold mb-2">Long-term Strategy</h5>
                  <ul className="space-y-2 text-indigo-100">
                    <li>• Develop machine learning model for route optimization</li>
                    <li>• Integrate with external weather and traffic APIs</li>
                    <li>• Build predictive maintenance scheduling system</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
