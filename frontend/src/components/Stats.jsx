// src/components/Stats.jsx
{/*export default function Stats() {
  return (
    <section className="py-16 text-center bg-white">
      <h2 className="text-2xl font-bold">Trusted by Airlines and Passengers Worldwide</h2>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
        <div><p className="text-3xl font-bold text-blue-600">95%</p><p>Prediction Accuracy</p></div>
        <div><p className="text-3xl font-bold text-green-600">2M+</p><p>Flights Tracked</p></div>
        <div><p className="text-3xl font-bold text-orange-600">500+</p><p>Airlines Supported</p></div>
        <div><p className="text-3xl font-bold text-gray-800">24/7</p><p>Real-time Monitoring</p></div>
      </div>
    </section>
  )
}
  */}

import { useState, useEffect, useRef } from "react";
import { TrendingUp, Plane, Building2, Clock } from "lucide-react";

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    accuracy: 0,
    flights: 0,
    airlines: 0,
    monitoring: 0
  });
  const sectionRef = useRef(null);

  // Intersection Observer to trigger animation when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Counting animation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const targets = {
      accuracy: 95,
      flights: 2000000, // 2M
      airlines: 500,
      monitoring: 24
    };

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounts({
        accuracy: Math.floor(targets.accuracy * progress),
        flights: Math.floor(targets.flights * progress),
        airlines: Math.floor(targets.airlines * progress),
        monitoring: Math.floor(targets.monitoring * progress)
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  const statsData = [
    {
      value: counts.accuracy,
      suffix: "%",
      label: "Prediction Accuracy",
      description: "AI-powered precision",
      icon: TrendingUp,
      color: "text-blue-600",
      bgPattern: "bg-blue-600"
    },
    {
      value: formatNumber(counts.flights),
      suffix: "+",
      label: "Flights Tracked",
      description: "Real-time monitoring",
      icon: Plane,
      color: "text-emerald-600",
      bgPattern: "bg-emerald-600"
    },
    {
      value: counts.airlines,
      suffix: "+",
      label: "Airlines Supported",
      description: "Global partnerships",
      icon: Building2,
      color: "text-orange-600",
      bgPattern: "bg-orange-600"
    },
    {
      value: counts.monitoring,
      suffix: "/7",
      label: "Real-time Monitoring",
      description: "Always watching",
      icon: Clock,
      color: "text-purple-600",
      bgPattern: "bg-purple-600"
    }
  ];

  return (
    <section id="why-us" ref={sectionRef} className="py-20 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-grid-move"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Trusted by Airlines &
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400">
              Passengers Worldwide
            </span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Stats Display */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="group relative"
              style={{
                animationDelay: `${index * 200}ms`,
                animation: isVisible ? 'slideInScale 0.8s ease-out forwards' : 'none'
              }}
            >
              
              {/* Glowing Border */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgPattern.replace('bg-', 'from-')}/20 ${stat.bgPattern.replace('bg-', 'to-')}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-sm`}></div>
              
              {/* Main Content */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 group-hover:bg-white/10 transition-all duration-500 group-hover:scale-105">
                
                {/* Icon */}
                <div className="flex justify-between items-start mb-8">
                  <div className={`p-3 bg-white/10 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-right">
                    <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                  </div>
                </div>

                {/* Number */}
                <div className="mb-4">
                  <span className={`text-4xl lg:text-6xl font-black ${stat.color} tabular-nums block leading-none group-hover:scale-105 transition-transform duration-300`}>
                    {stat.value}{stat.suffix}
                  </span>
                </div>

                {/* Label */}
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">{stat.label}</h3>
                  <p className="text-gray-400 text-sm font-medium">{stat.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 w-full bg-white/10 rounded-full h-1 overflow-hidden">
                  <div 
                    className={`h-full ${stat.bgPattern} transition-all duration-1000 ease-out rounded-full`}
                    style={{ 
                      width: isVisible ? '100%' : '0%',
                      transitionDelay: `${index * 200 + 500}ms`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>

      <style jsx>{`
        @keyframes slideInScale {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        .animate-grid-move {
          animation: grid-move 20s linear infinite;
        }

        .tabular-nums {
          font-variant-numeric: tabular-nums;
        }
      `}</style>
    </section>
  );
}