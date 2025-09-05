import { useState } from "react";
import { 
  // Plane, 
  Clock, 
  // MapPin, 
  // Bell, 
  Upload, 
  // Search, 
  // Calendar, 
  Users, 
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  // Phone,
  // Mail,
  // MessageCircle,
  TrendingUp
} from "lucide-react";

// Toggle Switch Component (not used currently)
function ToggleSwitch({ checked = false, onChange }) {
  const [isChecked, setIsChecked] = useState(checked);
  
  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (onChange) onChange(newValue);
  };
  
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={isChecked}
        onChange={handleToggle}
      />
      <div className={`w-11 h-6 rounded-full transition-all duration-300 ${
        isChecked ? 'bg-green-500' : 'bg-gray-300'
      }`}>
        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-all duration-300 ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}></div>
      </div>
    </label>
  );
}

export default function PassengerHub() {
  // ❌ Tab state not needed now
  // const [selectedTab, setSelectedTab] = useState("Delay Prediction");
  const [selectedInputMode, setSelectedInputMode] = useState("Manual Input");
  const [flightData, setFlightData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ❌ Not used currently
  // const [notifications, setNotifications] = useState({
  //   sms: true,
  //   email: true,
  //   whatsapp: false
  // });

  // ❌ Tabs removed, only one feature now
  // const tabs = [
  //   { id: "Delay Prediction", label: "Delay Prediction", icon: Clock },
  // ];

  const inputModes = [
    { id: "Manual Input", label: "Manual Input", icon: "📝" },
    { id: "Upload Ticket", label: "Upload Ticket", icon: "📄" }
  ];

  // Simulate delay prediction
  const handleDelayPrediction = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setFlightData({
        prediction: "15 min delay",
        confidence: 85,
        reasons: ["Weather conditions", "Air traffic congestion"],
        recommendation: "Arrive 30 minutes early"
      });
      setIsLoading(false);
    }, 2000);
  };

  // ❌ Notifications logic not needed now
  // const handleNotificationToggle = (type, value) => {
  //   setNotifications(prev => ({
  //     ...prev,
  //     [type]: value
  //   }));
  // };

  // const TabIcon = tabs.find(tab => tab.id === selectedTab)?.icon || Clock;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Passenger Hub
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your flights and get AI-powered delay predictions
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-2 rounded-xl shadow-md">
            <div className="flex gap-2">
              {inputModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelectedInputMode(mode.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedInputMode === mode.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-blue-50 text-gray-600"
                  }`}
                >
                  <span>{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="h-6 w-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-800">AI Delay Prediction</h3>
            </div>
            
            {selectedInputMode === "Manual Input" ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Airline</label>
                    <input 
                      type="text" 
                      placeholder="e.g., American Airlines (AA)" 
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Flight Date</label>
                    <input 
                      type="date" 
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">From</label>
                    <input 
                      type="text" 
                      placeholder="e.g., JFK - New York" 
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">To</label>
                    <input 
                      type="text" 
                      placeholder="e.g., LAX - Los Angeles" 
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Departure Time</label>
                    <input 
                      type="time" 
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                
                <button 
                  onClick={handleDelayPrediction}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-5 w-5" />
                      Predict Delay
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Ticket</h4>
                <p className="text-gray-500 mb-4">Drag and drop your flight ticket here, or click to browse</p>
                <p className="text-sm text-gray-400 mb-4">Supports PDF, JPEG, PNG, and text files</p>
                <input type="file" className="hidden" id="ticketUpload" accept=".pdf,.jpg,.jpeg,.png,.txt" />
                <label 
                  htmlFor="ticketUpload" 
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors font-medium"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </label>
              </div>
            )}

            {/* Prediction Results */}
            {flightData && (
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <h4 className="text-xl font-bold text-gray-800">Prediction Results</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-lg font-semibold text-gray-800 mb-2">
                      Expected Delay: <span className="text-red-600">{flightData.prediction}</span>
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      Confidence: <span className="font-semibold text-green-600">{flightData.confidence}%</span>
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium text-gray-700">Main Factors:</p>
                      {flightData.reasons.map((reason, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="h-5 w-5 text-blue-600" />
                      <p className="font-medium text-gray-800">Recommendation</p>
                    </div>
                    <p className="text-gray-600">{flightData.recommendation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pro Tips Section */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Star className="h-6 w-6 text-yellow-500" />
              Pro Tips for Smart Travelers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: "⏰", tip: "Arrive 45 minutes early for domestic flights — most delays occur during peak hours!" },
                { icon: "📱", tip: "Download your airline's app for real-time gate changes and boarding updates." },
                { icon: "🎒", tip: "Pack essentials in carry-on — checked bags may not make connecting flights if delayed." },
                { icon: "🛡️", tip: "Consider travel insurance for trips during weather-prone seasons." }
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border-l-4 border-blue-400">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-gray-700 font-medium">{item.tip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


          {/*
          {/* TRACK FLIGHT TAB
          {selectedTab === "Track Flight" && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="h-6 w-6 text-green-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Live Flight Tracking</h3>
                </div>
                
                <div className="flex gap-4 mb-6">
                  <input 
                    type="text" 
                    placeholder="Flight Number (e.g., AA1234)" 
                    className="flex-1 border-2 border-gray-200 rounded-lg p-3 focus:border-green-500 focus:outline-none transition-colors"
                  />
                  <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Track
                  </button>
                </div>

                {/* Flight Status Card 
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-4">Flight AA1234</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Plane className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">JFK → LAX</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-600" />
                          <span>Departure: 10:30 AM | Arrival: 1:45 PM</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-green-600" />
                          <span>Current: Above Kansas</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium">Gate:</span>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">B12</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Status:</span>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            On Time
                          </span>
                        </div>
                        <button className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Share Status
                        </button>
                      </div>
                    </div>
                    
                    {/* Flight Route Visualization 
                    <div className="bg-white p-4 rounded-xl">
                      <h5 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        Flight Route
                      </h5>
                      <div className="relative">
                        {/* Route Line 
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-center">
                            <div className="w-4 h-4 bg-blue-600 rounded-full mx-auto mb-2"></div>
                            <p className="text-xs font-semibold text-gray-800">JFK</p>
                            <p className="text-xs text-gray-500">New York</p>
                            <p className="text-xs text-gray-400">10:30 AM</p>
                          </div>
                          
                          <div className="flex-1 relative mx-4">
                            {/* Progress line background 
                            <div className="h-1 bg-gray-200 rounded-full"></div>
                            {/* Progress line filled (65% complete) 
                            <div className="absolute top-0 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full" style={{width: '65%'}}></div>
                            
                            {/* Current position indicator 
                            <div className="absolute top-0 flex items-center justify-center" style={{left: '65%', transform: 'translateX(-50%)'}}>
                              <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                              <div className="absolute -top-8 bg-green-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                                Above Kansas
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-center">
                            <div className="w-4 h-4 bg-gray-400 rounded-full mx-auto mb-2"></div>
                            <p className="text-xs font-semibold text-gray-800">LAX</p>
                            <p className="text-xs text-gray-500">Los Angeles</p>
                            <p className="text-xs text-gray-400">1:45 PM</p>
                          </div>
                        </div>
                        
                        {/* Flight Stats 
                        <div className="grid grid-cols-3 gap-3 text-center text-xs">
                          <div className="bg-blue-50 p-2 rounded-lg">
                            <p className="font-semibold text-blue-600">2h 15m</p>
                            <p className="text-gray-500">Elapsed</p>
                          </div>
                          <div className="bg-green-50 p-2 rounded-lg">
                            <p className="font-semibold text-green-600">1h 20m</p>
                            <p className="text-gray-500">Remaining</p>
                          </div>
                          <div className="bg-purple-50 p-2 rounded-lg">
                            <p className="font-semibold text-purple-600">580 mph</p>
                            <p className="text-gray-500">Speed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          */}

          {/* ALTERNATIVES TAB 
          {selectedTab === "Alternatives" && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="h-6 w-6 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Alternative Flight Options</h3>
                </div>
                
                <div className="space-y-4">
                  {[
                    { flight: "AA 2456", dep: "14:30", arr: "17:45", dur: "6h 15m", price: "$285", onTime: "81%", delay: "Low" },
                    { flight: "DL 8001", dep: "15:30", arr: "18:45", dur: "6h 15m", price: "$312", onTime: "83%", delay: "Low" },
                    { flight: "UA 1825", dep: "18:45", arr: "22:15", dur: "6h 30m", price: "$298", onTime: "82%", delay: "Medium" }
                  ].map((flight, index) => (
                    <div key={flight.flight} className="border-2 border-gray-200 p-6 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all bg-gray-50 hover:bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800 mb-2">{flight.flight}</h4>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{flight.dep} → {flight.arr}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Duration: {flight.dur}</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Price:</span>
                            <span className="text-lg font-bold text-green-600">{flight.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">On-Time:</span>
                            <span className="font-semibold text-blue-600">{flight.onTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Delay Risk:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              flight.delay === 'Low' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {flight.delay}
                            </span>
                          </div>
                        </div>
                        <div>
                          <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all font-semibold transform hover:scale-105">
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm text-gray-600 italic flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    Seamless rebooking with partner airlines coming soon. Currently showing available options for manual booking.
                  </p>
                </div>
              </div>
            </div>
          )} 

          {/* NOTIFICATIONS TAB 
          {selectedTab === "Notifications" && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <Bell className="h-6 w-6 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Smart Notifications</h3>
                </div>
                
                <p className="text-gray-600 mb-6">Stay updated with real-time flight information via your preferred channels.</p>

                {/* Phone Verification
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                  <div className="flex gap-3">
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="flex-1 border-2 border-gray-200 rounded-lg p-3 focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                      Verify
                    </button>
                  </div>
                </div>

                {/* Notification Preferences 
                <div className="space-y-4 mb-8">
                  <h4 className="text-lg font-semibold text-gray-800">Notification Channels</h4>
                  {[
                    { 
                      label: "SMS Updates", 
                      description: "Real-time text messages for delays and gate changes",
                      id: "sms", 
                      icon: Phone,
                      color: "text-green-600"
                    },
                    { 
                      label: "Email Notifications", 
                      description: "Detailed updates and booking confirmations",
                      id: "email", 
                      icon: Mail,
                      color: "text-blue-600"
                    },
                    { 
                      label: "WhatsApp Updates", 
                      description: "Rich media updates with flight maps and images",
                      id: "whatsapp", 
                      icon: MessageCircle,
                      color: "text-green-500"
                    }
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <div key={option.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg bg-white ${option.color}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{option.label}</span>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notifications[option.id]}
                            onChange={(e) => handleNotificationToggle(option.id, e.target.checked)}
                          />
                          <div className={`w-11 h-6 rounded-full transition-all duration-300 ${
                            notifications[option.id] ? 'bg-green-500' : 'bg-gray-300'
                          }`}>
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-all duration-300 ${
                              notifications[option.id] ? 'translate-x-5' : 'translate-x-0'
                            }`}></div>
                          </div>
                        </label>
                      </div>
                    );
                  })}
                </div>

                {/* Subscribe Button 
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                  <Bell className="h-5 w-5" />
                  Subscribe to Updates
                </button>

                {/* Privacy Note 
                <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>
                      <strong>Privacy Protected:</strong> Your contact information is encrypted and only used for flight notifications. 
                      You can unsubscribe anytime with a single click.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )} */}
