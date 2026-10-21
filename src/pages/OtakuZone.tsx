import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Moon, Feather } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ResponsiveLayout from '@/components/ResponsiveLayout';

const OtakuZone = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [sharinganActive, setSharinganActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const otakuCategories = [
    { id: 'merch', title: 'Merch', subtitle: 'Exclusive Anime Gear', icon: '🎌' },
    { id: 'cosplay', title: 'Cosplay', subtitle: 'Transform Your Style', icon: '👘' },
    { id: 'lore', title: 'Anime Lore', subtitle: 'Deep Universe Stories', icon: '📜' },
    { id: 'limited', title: 'Limited Edition', subtitle: 'Rare Collectibles', icon: '⚡' }
  ];

  return (
    <ResponsiveLayout>
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-950 via-red-900 to-black">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Chakra Pulses */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-red-500/30"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full border-2 border-red-400/40"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />

          {/* Floating Particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-red-400/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, -100, -20],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3
              }}
            />
          ))}

          {/* Red Moon */}
          <motion.div
            className="absolute top-20 right-20 w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg shadow-red-500/50"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Crows Animation */}
        <AnimatePresence>
          {isLoaded && (
            <>
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ x: window.innerWidth + 100, y: 100 + i * 50 }}
                  animate={{
                    x: -100,
                    y: 100 + i * 50 + Math.sin(Date.now() / 1000 + i) * 20
                  }}
                  transition={{
                    duration: 8 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "linear"
                  }}
                >
                  <Feather className="w-6 h-6 text-black transform rotate-12" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="relative z-10 pt-20 pb-12">
          {/* Hero Section with Ninja Silhouette */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="relative inline-block mb-8">
              {/* Ninja Silhouette */}
              <motion.div
                className="w-32 h-48 mx-auto mb-6 relative"
                whileHover={{ scale: 1.05 }}
                onHoverStart={() => setSharinganActive(true)}
                onHoverEnd={() => setSharinganActive(false)}
              >
                <div className="absolute inset-0 bg-black opacity-80 rounded-lg ninja-silhouette" />
                {/* Sharingan Eyes */}
                <motion.div
                  className="absolute top-8 left-8 flex space-x-4"
                  animate={sharinganActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: sharinganActive ? Infinity : 0 }}
                >
                  <Eye className="w-4 h-4 text-red-500" />
                  <Eye className="w-4 h-4 text-red-500" />
                </motion.div>
                {/* Cloak Animation */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-900/50 to-transparent rounded-b-lg"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </div>

            <motion.h1
              className="text-6xl font-bold text-red-500 mb-4 font-oswald tracking-wider"
              style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.5)' }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              OTAKU ZONE
            </motion.h1>
            <motion.p
              className="text-xl text-red-300/80 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Enter the forbidden realm where anime dreams become reality. 
              Join the secret brotherhood of style.
            </motion.p>
          </motion.div>

          {/* Category Cards */}
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {otakuCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 100, rotateX: -45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ 
                    delay: 2 + index * 0.2, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    rotateY: 5,
                    boxShadow: "0 20px 40px rgba(239, 68, 68, 0.3)"
                  }}
                  onHoverStart={() => setHoveredCard(category.id)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card className="bg-black/40 border-red-500/30 backdrop-blur-sm relative overflow-hidden group">
                    {/* VHS Glitch Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"
                      animate={hoveredCard === category.id ? {
                        x: [-100, 100, -100],
                        opacity: [0, 0.5, 0]
                      } : {}}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                    
                    {/* Smoky Trail */}
                    <motion.div
                      className="absolute -top-2 -left-2 w-4 h-4 bg-red-500/30 rounded-full blur-sm"
                      animate={hoveredCard === category.id ? {
                        scale: [0, 1.5, 0],
                        opacity: [0, 0.7, 0]
                      } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />

                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div
                        className="text-4xl mb-4"
                        animate={hoveredCard === category.id ? { 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {category.icon}
                      </motion.div>
                      <h3 className="text-xl font-bold text-red-400 mb-2 font-oswald tracking-wide">
                        {category.title}
                      </h3>
                      <p className="text-red-300/70 text-sm mb-4">
                        {category.subtitle}
                      </p>
                      <Button 
                        variant="outline" 
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:border-red-400 transition-all duration-300"
                      >
                        Explore
                      </Button>
                    </CardContent>

                    {/* Akatsuki Cloud Pattern */}
                    <motion.div
                      className="absolute bottom-0 right-0 w-16 h-16 opacity-10"
                      style={{
                        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20,20 Q40,10 60,20 Q80,10 90,30 Q85,50 70,60 Q50,70 30,60 Q10,50 20,20 Z' fill='%23ef4444'/%3E%3C/svg%3E")`,
                        backgroundSize: 'cover'
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer Quote */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4 }}
          >
            <p className="text-red-400/60 italic text-lg font-playfair">
              "In the world of ninjas, those who break the rules are scum, 
              but those who abandon their friends are worse than scum."
            </p>
          </motion.div>
        </div>

        {/* Custom styling handled via Tailwind classes */}
      </div>
    </ResponsiveLayout>
  );
};

export default OtakuZone;