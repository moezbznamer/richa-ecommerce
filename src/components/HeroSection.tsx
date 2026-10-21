
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';
import heroNaruto1 from '@/assets/hero-naruto-1.jpg';
import heroNaruto2 from '@/assets/hero-naruto-2.jpg';
import heroNaruto3 from '@/assets/hero-naruto-3.jpg';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: heroNaruto1,
      title: 'LUXURY STREETWEAR',
      subtitle: 'Elevate Your Style',
      description: 'Discover premium urban fashion that defines modern luxury',
      category: 'man',
      price: '$299',
      badge: 'NEW ARRIVAL'
    },
    {
      id: 2,
      image: heroNaruto2,
      title: 'PREMIUM COLLECTION',
      subtitle: 'Bold & Confident',
      description: 'Handcrafted excellence for the modern gentleman',
      category: 'man',
      price: '$399',
      badge: 'LIMITED EDITION'
    },
    {
      id: 3,
      image: heroNaruto3,
      title: 'SIGNATURE STYLE',
      subtitle: 'Timeless Elegance',
      description: 'Where luxury meets contemporary design',
      category: 'fashion',
      price: '$199',
      badge: 'TRENDING'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-luxury-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </div>
        </motion.div>
      </AnimatePresence>


      {/* Content - RRICHA Logo */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-5xl">
          <motion.div
            key={`content-${currentSlide}`}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="space-y-8"
          >
            {/* RRICHA Logo with Animation */}
            <div className="text-6xl md:text-9xl font-oswald font-bold mb-6 tracking-widest">
              {['R', 'R', 'I', 'C', 'H', 'A'].map((letter, index) => (
                <motion.span
                  key={`${currentSlide}-${index}`}
                  className="inline-block text-luxury-gold"
                  initial={{ 
                    opacity: 0, 
                    y: -100,
                    rotateX: -90,
                    scale: 0.5
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    rotateX: 0,
                    scale: 1
                  }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{
                    scale: 1.2,
                    rotateY: 360,
                    textShadow: "0 0 30px rgba(212, 175, 55, 0.8)",
                    transition: { duration: 0.5 }
                  }}
                  style={{
                    textShadow: "0 0 20px rgba(212, 175, 55, 0.5), 0 0 40px rgba(212, 175, 55, 0.3)",
                    transformStyle: "preserve-3d",
                    perspective: "1000px"
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 glassmorphism rounded-full p-4 text-white hover:text-luxury-gold transition-all duration-300"
      >
        <ChevronLeft size={32} />
      </motion.button>
      
      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 glassmorphism rounded-full p-4 text-white hover:text-luxury-gold transition-all duration-300"
      >
        <ChevronRight size={32} />
      </motion.button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-4">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            whileHover={{ scale: 1.2 }}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-luxury-gold scale-125 animate-luxury-glow' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-luxury-gold/30 rounded-full animate-luxury-pulse hidden lg:block"></div>
      <div className="absolute bottom-40 left-20 w-24 h-24 border border-luxury-gold/20 rounded-full animate-luxury-pulse hidden lg:block"></div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-luxury-gold/50 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
