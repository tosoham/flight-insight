import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Plane, Clock, BarChart3 } from "lucide-react";

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background images for slideshow
  const backgroundImages = [
     "Variant2.png", // Airplane in sky
    "Variant3.png",  // Airport terminal
    "flight2.jpg"  // Airport terminal
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [backgroundImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + backgroundImages.length) % backgroundImages.length);
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Slideshow Background */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Aviation background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Slideshow Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-300 hover:scale-110"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {backgroundImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-left text-white w-full pl-4 md:pl-8 lg:pl-12 xl:pl-16 flex flex-col justify-center h-full pt-20 md:pt-35">
        
        <h1 className="text-6xl md:text-8xl font-bold leading-tight mb-4 animate-slide-up">
          AI-Powered Insights for 
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 animate-gradient">
            Stress-Free Flights.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-4xl leading-relaxed animate-slide-up-delay">
          Revolutionizing aviation with cutting-edge AI insights. Reduce delays, optimize operations, 
          and keep passengers informed with real-time intelligence and predictive analytics.
        </p>

      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-green-400/60 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-16 w-2 h-2 bg-purple-400/60 rounded-full animate-bounce delay-2000"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping delay-3000"></div>
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-yellow-400/60 rounded-full animate-pulse delay-4000"></div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 1s ease-out 0.2s both;
        }
        
        .animate-slide-up-delay {
          animation: slide-up 1s ease-out 0.4s both;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.6s both;
        }
        
        .animate-gradient {
          background-size: 400% 400%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}