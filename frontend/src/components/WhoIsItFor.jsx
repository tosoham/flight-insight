import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Building2, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  Brain,
  Plane,
  Clock,
  Search,
  ChevronRight,
  Star,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";

export default function WhoIsItFor() {
  const [activeTab, setActiveTab] = useState(0);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);



  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          // Animate features one by one
          setTimeout(() => {
            [0, 1, 2].forEach((index) => {
              setTimeout(() => {
                setVisibleFeatures(prev => [...prev, index]);
              }, index * 300);
            });
          }, 500);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Reset visible features when tab changes
  useEffect(() => {
    setVisibleFeatures([]);
    setTimeout(() => {
      [0, 1, 2].forEach((index) => {
        setTimeout(() => {
          setVisibleFeatures(prev => [...prev, index]);
        }, index * 200);
      });
    }, 300);
  }, [activeTab]);

  const userTypes = [
    {
      id: "passengers",
      title: "Passengers",
      subtitle: "Stay informed and prepared with real-time flight tracking and smart alternatives",
      icon: Users,
      color: "blue",
      gradient: "from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-50",
      features: [
        {
          icon: Plane,
          title: "Real-time Flight Tracking",
          description: "Live updates on your flight status and location",
          color: "text-blue-600",
          bgColor: "bg-blue-100"
        },
        {
          icon: Brain,
          title: "Smart Delay Predictions",
          description: "Get early warnings about potential delays",
          color: "text-indigo-600",
          bgColor: "bg-indigo-100"
        },
        {
          icon: Search,
          title: "Alternative Flight Options",
          description: "Find backup flights when delays occur",
          color: "text-purple-600",
          bgColor: "bg-purple-100"
        }
      ]
    },
    {
      id: "airlines",
      title: "Airlines",
      subtitle: "Advanced analytics and insights to optimize operations and reduce delays",
      icon: Building2,
      color: "emerald",
      gradient: "from-emerald-600 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      features: [
        {
          icon: BarChart3,
          title: "Performance Analytics",
          description: "Compare with competitors and track improvement trends",
          color: "text-emerald-600",
          bgColor: "bg-emerald-100"
        },
        {
          icon: AlertTriangle,
          title: "Delay Root Cause Analysis",
          description: "Identify and mitigate common delay factors",
          color: "text-orange-600",
          bgColor: "bg-orange-100"
        },
        {
          icon: TrendingUp,
          title: "Predictive Insights",
          description: "Proactive delay management and resource allocation",
          color: "text-teal-600",
          bgColor: "bg-teal-100"
        }
      ]
    }
  ];

  const currentUser = userTypes[activeTab];

  return (
    <section id="solutions" ref={sectionRef} className="py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Built For<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-800"> Everyone</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Flight Insight serves two key user groups with tailored solutions for their unique needs
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/60">
            <div className="flex space-x-2">
              {userTypes.map((user, index) => (
                <button
                  key={user.id}
                  onClick={() => setActiveTab(index)}
                  className={`relative flex items-center space-x-3 px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === index
                      ? `bg-gradient-to-r ${user.gradient} text-white shadow-lg transform scale-105`
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <user.icon className={`w-6 h-6 ${activeTab === index ? 'text-white' : 'text-gray-500'}`} />
                  <span className="text-lg">{user.title}</span>
                  {activeTab === index && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
            
            {/* User Type Header */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${currentUser.gradient} rounded-2xl mb-6 shadow-xl`}>
                <currentUser.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                For {currentUser.title}
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {currentUser.subtitle}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {currentUser.features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-700 ${
                    visibleFeatures.includes(index)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Feature Card */}
                  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/60 group-hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden h-full">
                    
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentUser.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
                    
                    {/* Icon */}
                    <div className="relative z-10 mb-4">
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h4 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-lg leading-relaxed group-hover:text-gray-700 transition-colors">
                        {feature.description}
                      </p>
                    </div>

                    {/* Premium Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`w-3 h-3 bg-gradient-to-r ${currentUser.gradient} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                    </div>

                    {/* Bottom Arrow */}
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <ChevronRight className={`w-6 h-6 ${feature.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              {/* here added /passengers to view the page, change acordingly */}
              <Link to="/signin">
              <button className={`bg-gradient-to-r ${currentUser.gradient} hover:shadow-2xl hover:shadow-${currentUser.color}-500/25 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-3`}>
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { number: "10K+", label: "Active Users", icon: Users },
            { number: "99.9%", label: "Uptime", icon: Shield },
            { number: "24/7", label: "Support", icon: Clock },
            { number: "Real-time", label: "Updates", icon: Zap }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl mb-4 group-hover:bg-gray-200 transition-colors">
                <stat.icon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 8s ease-in-out infinite;
          animation-delay: -2.7s;
        }

        .animate-float-delay-2 {
          animation: float 8s ease-in-out infinite;
          animation-delay: -5.3s;
        }
      `}</style>
    </section>
  );
}