// src/components/HowItWorks.jsx
{/*export default function HowItWorks() {
  return (
    <section className="py-16 bg-blue-50 text-center">
      <h2 className="text-2xl font-bold">How Flight Insight Works</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="font-semibold">📊 Data Collection</h3>
          <p className="text-gray-600 mt-2">
            We gather real-time data from weather services, air traffic control, and airlines.
          </p>
        </div>
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="font-semibold">⚡ AI Analysis</h3>
          <p className="text-gray-600 mt-2">
            Advanced ML algorithms process historical patterns and live updates.
          </p>
        </div>
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="font-semibold">📱 Smart Notifications</h3>
          <p className="text-gray-600 mt-2">
            Personalized alerts and insights delivered directly to your dashboard.
          </p>
        </div>
      </div>
    </section>
  )
}
  */}

import { useState, useRef, useEffect } from "react";
import { Database, Brain, Bell, ArrowRight, ChevronRight } from "lucide-react";

export default function HowItWorks() {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Animate cards one by one
          [0, 1, 2].forEach((index) => {
            setTimeout(() => {
              setVisibleCards(prev => [...prev, index]);
            }, index * 200);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      emoji: "📊",
      icon: Database,
      title: "Data Collection",
      description: "We gather real-time data from weather services, air traffic control, and airlines.",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100/50",
      shadowColor: "shadow-blue-500/20"
    },
    {
      emoji: "⚡",
      icon: Brain,
      title: "AI Analysis", 
      description: "Advanced ML algorithms process historical patterns and live updates.",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100/50",
      shadowColor: "shadow-purple-500/20"
    },
    {
      emoji: "📱",
      icon: Bell,
      title: "Smart Notifications",
      description: "Personalized alerts and insights delivered directly to your dashboard.",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100/50",
      shadowColor: "shadow-green-500/20"
    }
  ];

  return (
    <section id="how" ref={sectionRef} className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50/30 to-purple-50/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-float-delay"></div>
        <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-float-delay-2"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How Flight Insight <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Works</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our intelligent system transforms aviation data into actionable insights through three powerful steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`group relative transition-all duration-700 ${
                visibleCards.includes(index) 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Step Number */}
              <div className="absolute -top-3 -left-3 z-20">
                <div className={`w-10 h-10 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold shadow-lg`}>
                  {index + 1}
                </div>
              </div>

              {/* Main Card */}
              <div className={`relative bg-gradient-to-br ${step.bgColor} backdrop-blur-sm rounded-2xl p-8 shadow-xl ${step.shadowColor} border border-white/60 group-hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden`}>
                
                {/* Hover Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>

                {/* Icon Section */}
                <div className="relative z-10 text-center mb-6">
                  <div className="relative inline-block">
                    {/* Emoji Background */}
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {step.emoji}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors">
                    {step.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className={`w-6 h-6 text-gradient bg-gradient-to-r ${step.color} bg-clip-text text-transparent`} />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                <div className="absolute bottom-6 left-4 w-1 h-1 bg-white/40 rounded-full group-hover:scale-150 transition-transform duration-300 delay-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: float 6s ease-in-out infinite;
          animation-delay: -2s;
        }

        .animate-float-delay-2 {
          animation: float 6s ease-in-out infinite;
          animation-delay: -4s;
        }
      `}</style>
    </section>
  );
}

