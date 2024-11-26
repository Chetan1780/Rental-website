import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "/images/pexels-mikebirdy-100656.jpg",
      title: "Drive Your Dream Car Today",
      description: "Rent top-tier vehicles for any occasion with ease and flexibility."
    },
    {
      image: "/images/pexels-mikebirdy-170811.jpg",
      title: "Explore New Destinations",
      description: "Find the perfect car for your next adventure at unbeatable prices."
    },
    {
      image: "/images/pexels-pixabay-210019.jpg",
      title: "Convenience Meets Comfort",
      description: "Experience hassle-free car rentals tailored to your needs."
    }
  ];
  

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-[80vh] flex flex-col lg:flex-row items-center justify-center bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white overflow-hidden">
      {/* Left Side - Content */}
      <div className="lg:w-1/2 flex flex-col items-start justify-center px-8 sm:px-12 z-20 space-y-6 relative">
  <div>
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-yellow-500 shadow-2xl transform transition-all duration-300 hover:scale-110 hover:text-white">
      Rentify
    </h1>
    <p className="text-lg sm:text-xl mt-4 max-w-md text-gray-300">
      Discover the perfect car for your next adventure. Rent a car with ease and explore at your own pace.
    </p>
  </div>

  <div className="flex flex-col sm:flex-row gap-6 mt-6">
    <Link to="api/cars">
      <button className="bg-yellow-500 text-black py-3 px-8 rounded-full text-lg hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-lg">
        Book A Car
      </button>
    </Link>
    <Link to="/about">
      <button className="bg-transparent border-2 border-yellow-500 text-yellow-500 py-3 px-8 rounded-full text-lg hover:bg-yellow-500 hover:text-white transition-all transform hover:scale-105 shadow-lg">
        Learn More
      </button>
    </Link>
  </div>
</div>


      {/* Right Side - Image Slider */}
      <div className="lg:w-1/2 w-full h-full flex justify-center items-center relative z-10">
        <div className="relative w-full h-[500px] max-w-lg overflow-hidden rounded-2xl shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <img
                src={slides[currentSlide].image}
                alt={`Slide ${currentSlide + 1}`}
                className="w-full h-full object-cover brightness-75 pointer-events-none"
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>
              <div className="absolute bottom-10 left-10 text-white max-w-md pointer-events-none">
                <h2 className="text-3xl font-bold mb-2">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-lg">
                  {slides[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronLeft className="text-white" size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all"
          >
            <ChevronRight className="text-white" size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index 
                    ? "bg-yellow-500 w-6" 
                    : "bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
