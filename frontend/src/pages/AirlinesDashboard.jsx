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
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, Plane, Clock, Users, AlertTriangle,
  Calendar,  
  MapPin, 
  User, 
  Navigation, 
  Timer,
  Send,
  Info,
  CheckCircle, } from "lucide-react";
import FlightScheduleSection from "../components/FlightScheduleSection";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
    day_of_week: "",
    flight_number: "",
    tail_number: "",
    origin_airport: "",
    destination_airport: "",
    scheduled_departure: "",
    departure_time: "",
    departure_delay: "",
    taxi_out: "",
    scheduled_time: "",
    distance: "",
    scheduled_arrival: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handler for CSV upload (to be implemented)
  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // TODO: Implement CSV parsing and batch prediction logic
    alert(`Selected file: ${file.name}`);
  };

  // 🔹 Handle form updates (null/NaN → 0)
  // 🔹 Handle form updates with date validation
const NUMERIC_FIELDS = [
  "flight_number",
  "scheduled_departure",
  "departure_time",
  "departure_delay",
  "taxi_out",
  "scheduled_time",
  "distance",
  "scheduled_arrival",
];

const handleChange = (e) => {
  const { name, value } = e.target;

  if (name === "date") {
    // ✅ Allow only digits and slashes while typing
    if (!/^[0-9/]*$/.test(value)) return;

    // Don't validate if user just typed "/" at the end
    if (value.endsWith("/")) {
      setFormData((prev) => ({ ...prev, [name]: value }));
      return;
    }

    // Split into [dd, mm, yyyy]
    const parts = value.split("/");
    let [dd, mm, yyyy] = parts;

    // ✅ Cap values only if present
    if (dd && parseInt(dd, 10) > 31) dd = "31";
    if (mm && parseInt(mm, 10) > 12) mm = "12";
    if (yyyy && yyyy.length > 4) yyyy = yyyy.slice(0, 4);

    // ✅ Rebuild formatted value
    const formatted = [dd, mm, yyyy].filter(Boolean).join("/");

    setFormData((prev) => ({ ...prev, [name]: formatted }));
  } else if (NUMERIC_FIELDS.includes(name)) {
    // Only allow numbers (and optional minus for negative values)
    if (value === "" || value === "-") {
      setFormData((prev) => ({ ...prev, [name]: "" }));
      return;
    }
    if (!/^-?\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value.replace(/^0+(?!$)/, "") }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  // 🔹 Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      // Parse date (dd/mm/yyyy)
      const [day, month, year] = (formData.date || "").split("/").map((x) => parseInt(x, 10));

      // Helper to safely parse numbers (NaN → 0)
      const toInt = (val) => {
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num;
      };

      // Build backend payload with UPPERCASE keys
      const payload = {
        YEAR: toInt(year),
        MONTH: toInt(month),
        DAY: toInt(day),
        DAY_OF_WEEK: toInt(formData.day_of_week),
        AIRLINE: formData.airline || "",
        FLIGHT_NUMBER: toInt(formData.flight_number),
        TAIL_NUMBER: formData.tail_number || "",
        ORIGIN_AIRPORT: formData.origin_airport || "",
        DESTINATION_AIRPORT: formData.destination_airport || "",
        SCHEDULED_DEPARTURE: toInt(formData.scheduled_departure),
        DEPARTURE_TIME: toInt(formData.departure_time),
        DEPARTURE_DELAY: toInt(formData.departure_delay),
        TAXI_OUT: toInt(formData.taxi_out),
        SCHEDULED_TIME: toInt(formData.scheduled_time),
        DISTANCE: toInt(formData.distance),
        SCHEDULED_ARRIVAL: toInt(formData.scheduled_arrival),
      };

      // Call backend
      const res = await fetch(`${BACKEND_URL}/predict-mojo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Handle backend response { "Arrival Delay": value }
      const data = await res.json();
      setPrediction(data?.["Arrival Delay (MOJO)"] ?? "No result");
      console.log("Prediction result", data);

    } catch (err) {
      console.error("Prediction error", err);
      setPrediction("Error occurred, try again");
    } finally {
      setLoading(false);
      // Reset form after prediction (always)
      setFormData({
        date: "",
        airline: "",
        day_of_week: "",
        flight_number: "",
        tail_number: "",
        origin_airport: "",
        destination_airport: "",
        scheduled_departure: "",
        departure_time: "",
        departure_delay: "",
        taxi_out: "",
        scheduled_time: "",
        distance: "",
        scheduled_arrival: "",
      });
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
        <div className="flex justify-center mb-8">
        <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm w-fit">           
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
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                {/* --- CSV Upload Button --- */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                  <h2 className="text-3xl font-bold text-gray-800">AI Flight Delay Prediction</h2>
                  <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow hover:from-blue-700 hover:to-indigo-700 cursor-pointer transition-all duration-200">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                    Upload CSV
                    <input
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleCSVUpload}
                    />
                  </label>
                </div>
                <div className="space-y-8">
                  {/* Flight Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Flight Information</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          Date
                        </label>
                        <input 
                          type="text" 
                          name="date" 
                          placeholder="dd/mm/yyyy" 
                          value={formData.date} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300" 
                        />
                      </div>

                      <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        Day of Week
                      </label>
                      <select 
                        name="day_of_week" 
                        value={formData.day_of_week} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                      >
                        <option value="">Select Day of Week</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                      </select>
                    </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Plane className="w-4 h-4 text-blue-500" />
                          Airline
                        </label>
                        <select 
                          name="airline" 
                          value={formData.airline} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                        >
                          <option value="">Select Airline</option>
                          <option value="UA">United Airlines</option>
                            <option value="AA">American Airlines</option>
                            <option value="US">US Airways</option>
                            <option value="F9">Frontier Airlines</option>
                            <option value="B6">JetBlue Airways</option>
                            <option value="OO">SkyWest Airlines</option>
                            <option value="AS">Alaska Airlines</option>
                            <option value="NK">Spirit Airlines</option>
                            <option value="WN">Southwest Airlines</option>
                            <option value="DL">Delta Airlines</option>
                            <option value="EV">Atlantic Southeast</option>
                            <option value="HA">Hawaiian Airlines</option>
                            <option value="MQ">American Eagle</option>
                            <option value="VX">Virgin America</option>

                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-500" />
                          Tail Number
                        </label>
                        <select 
                          name="tail_number" 
                          value={formData.tail_number} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300"
                        >
                          <option value="">Select Tail Number</option>
                          <option value="AA123">AA123</option>
                          <option value="DL456">DL456</option>
                          <option value="UA789">UA789</option>
                          <option value="WN012">WN012</option>
                          <option value="N635NK">N635NK</option>
                          <option value="N927WN">N927WN</option>
                          <option value="F9123">F9123</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-blue-500" />
                          Flight Number
                        </label>
                        <input 
                          type="text" 
                          name="flight_number" 
                          placeholder="e.g.,1 to 9855" 
                          value={formData.flight_number} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Departure Details Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Send className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Departure Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-500" />
                          Origin Airport
                        </label>
                        <select 
                          name="origin_airport" 
                          value={formData.origin_airport} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300"
                        >
                          <option value="">Select Origin Airport</option>
                          <option value="JFK">JFK</option>
                          <option value="LAX">LAX</option>
                          <option value="ORD">ORD</option>
                          <option value="10721">10721</option>
                          <option value="12016">12016</option>
                          <option value="12945">12945</option>
                          <option value="LIH">LIH</option>
                          <option value="TTN">TTN</option>
                          <option value="AZO">AZO</option>
                          <option value="MLU">MLU</option>
                          <option value="CAE">CAE</option>
                          <option value="OTH">OTH</option>
                          <option value="11648">11648</option>

                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          Scheduled Departure
                        </label>
                        <input 
                          type="text" 
                          name="scheduled_departure" 
                          placeholder="e.g., 1 to 2359" 
                          value={formData.scheduled_departure} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          Departure Time
                        </label>
                        <input 
                          type="text" 
                          name="departure_time" 
                          placeholder="e.g range ( 1 - 2400)" 
                          value={formData.departure_time} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Timer className="w-4 h-4 text-green-500" />
                          Departure Delay (mins)
                        </label>
                        <input 
                          type="text" 
                          name="departure_delay" 
                          placeholder="e.g., -82 to 1988" 
                          value={formData.departure_delay} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Timer className="w-4 h-4 text-green-500" />
                          Taxi Out (mins)
                        </label>
                        <input 
                          type="text" 
                          name="taxi_out" 
                          placeholder="e.g ( 1 to 225)" 
                          value={formData.taxi_out} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Arrival Details Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">Arrival Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          Destination Airport
                        </label>
                        <select 
                          name="destination_airport" 
                          value={formData.destination_airport} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300"
                        >
                          <option value="">Select Destination Airport</option>
                          <option value="ATL">ATL</option>
                          <option value="SFO">SFO</option>
                          <option value="MIA">MIA</option>
                          <option value="MOB">MOB</option>
                          <option value="FNT">FNT</option>
                          <option value="ISN">ISN</option>
                          <option value="FAY">FAY</option>
                          <option value="BTV">BTV</option>
                          <option value="RDD">RDD</option>
                          <option value="ACV">ACV</option>
                          <option value="13076">13076</option>
                          <option value="11150">11150</option>
                          <option value="11140">11140</option>

                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-500" />
                          Scheduled Arrival
                        </label>
                        <input 
                          type="text" 
                          name="scheduled_arrival" 
                          placeholder="e.g range ( 1 - 2400)" 
                          value={formData.scheduled_arrival} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Timer className="w-4 h-4 text-purple-500" />
                          Scheduled Time (mins)
                        </label>
                        <input 
                          type="text" 
                          name="scheduled_time" 
                          placeholder="e.g., 18 to 718" 
                          value={formData.scheduled_time} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300" 
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Navigation className="w-4 h-4 text-purple-500" />
                          Distance (miles)
                        </label>
                        <input 
                          type="text" 
                          name="distance" 
                          placeholder="e.g., 31,..2475...4983" 
                          value={formData.distance} 
                          onChange={handleChange} 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-300" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center pt-6">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        loading 
                          ? "bg-gray-400 cursor-not-allowed" 
                          : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl"
                      }`}
                    >
                      {loading ? (
                        <>
                          Analyzing Flight...
                        </>
                      ) : (
                        <>
                          <Plane className="w-5 h-5" />
                          Get AI Prediction
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Loader */}
                {loading && (
                  <div className="mt-8 flex flex-col items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mb-4"></div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-700 mb-2">Analyzing your flight data...</p>
                      <p className="text-sm text-gray-500">Our AI is processing multiple factors to predict delays</p>
                    </div>
                  </div>
                )}

                {/* Results */}

                {!loading && prediction !== null && (
                <div className="mt-8 animate-fadeIn">
                  <div
                    className={`p-6 rounded-2xl border-2 text-center shadow-lg ${
                      Math.round(Number(prediction)) < 15
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
                        : Math.round(Number(prediction)) === 15
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                        : "bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-center mb-4">
                      {Math.round(Number(prediction)) < 15 ? (
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-blue-600" />
                        </div>
                      ) : Math.round(Number(prediction)) === 15 ? (
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                      )}
                    </div>

                    {/* CASE 1: Flight Early */}
                    {Math.round(Number(prediction)) < 15 && (
                      <div>
                        <h4 className="text-2xl font-bold text-blue-800 mb-2">Flight Early ✈️</h4>
                        {15 - Math.round(Number(prediction)) > 0 ? (
                          <p className="text-blue-700 text-lg mb-2">
                            Before time by{" "}
                            <span className="font-bold">
                              {-(Math.round(Number(prediction)))} minutes
                            </span>
                          </p>
                        ) : (
                          <p className="text-blue-700 text-lg mb-2">
                            Could vary by <span className="font-bold">±5 minutes</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* CASE 2: Flight On Time */}
                    {Math.round(Number(prediction)) === 15 && (
                      <div>
                        <h4 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
                          Flight On Time ✈️
                          <span
                            className="relative group cursor-pointer"
                            title="May arrive up to 5 minutes earlier or later"
                          >
                            <Info className="w-5 h-5 text-green-600" />
                          </span>
                        </h4>
                        <p className="text-green-700 text-lg mb-2">
                          Could vary by <span className="font-bold">±5 minutes</span>
                        </p>
                      </div>
                    )}

                    {/* CASE 3: Flight Delayed */}
                    {Math.round(Number(prediction)) > 15 && (
                      <div>
                        <h4 className="text-2xl font-bold text-red-800 mb-2">Delay Expected ⚠️</h4>
                        <p className="text-red-700 text-lg mb-2">
                          Predicted delay:{" "}
                          <span className="font-bold">
                            {Math.round(Number(prediction))} minutes
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              </div>
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
