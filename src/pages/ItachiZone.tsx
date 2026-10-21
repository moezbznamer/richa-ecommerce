import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Wind, ShoppingCart, Sword, Star } from 'lucide-react';
import ProduitCard from '../components/ProduitCard';
import BackToHomeButton from '../components/BackToHomeButton';
import { useProduits } from '../hooks/useProduits';
import { useProduitOffers } from '../hooks/useProduitOffers';

const ItachiZone = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sharinganActive, setSharinganActive] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [smokeEffect, setSmokeEffect] = useState(true);
  const [crows, setCrows] = useState<{ id: number; x: number; y: number; delay: number; speed: number }[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [showCrows, setShowCrows] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const { produits, loading, fetchProduits } = useProduits();
  const { offers } = useProduitOffers();

  // Filter otaku products from database (including typo variations)
  const otakuProducts = produits.filter(product => {
    const type = product.type_produit as string;
    return type === 'otaku' || type === 'otku' || type === 'outku';
  });

  useEffect(() => {
    setIsLoaded(true);
    fetchProduits();
    
    // Generate crows for entrance animation (one-time)
    const crowsArray = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100 - 20,
      y: Math.random() * 60 + 20,
      delay: Math.random() * 2,
      speed: 3 + Math.random() * 2
    }));
    setCrows(crowsArray);

    // Hide crows after 4 seconds (one-time animation)
    setTimeout(() => setShowCrows(false), 4000);

    // Scroll listener for parallax
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Random glitch effects
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 200);
      }
    }, 3000);

    // Smoke effect timeout
    setTimeout(() => setSmokeEffect(false), 3000);

    // Crow cawing sound effect on load
    try {
      const crowAudio = new Audio();
      // Simple crow caw sound (synthetic)
      crowAudio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmVaEgAzd7tqGjFJI';
      crowAudio.volume = 0.2;
      setTimeout(() => {
        crowAudio.play().catch(() => {});
      }, 500);
    } catch (error) {
      console.log('Crow sound not available');
    }

    // Background ambient sounds
    try {
      const audio = new Audio();
      audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmVaEgAzd7tqGjFJI';
      audio.volume = 0.1;
      audio.loop = true;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch (error) {
      console.log('Audio not available');
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(glitchInterval);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const playHoverSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmVaEgAzd7tqGjFJI');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {
      console.log('Sound not available');
    }
  };

  const createOfferMap = () => {
    const offerMap = new Map();
    offers.forEach(offer => {
      if (offer.produit) {
        offerMap.set(offer.produit, offer.discount_percentage);
      }
    });
    return offerMap;
  };

  const offerMap = createOfferMap();

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-red-950 via-red-900 to-black overflow-hidden font-cinzel">
      {/* Glitch Overlay */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              background: ['transparent', '#dc2626', 'transparent']
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Smoke Effect on Load */}
      <AnimatePresence>
        {smokeEffect && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/80"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, delay: 1 }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle, rgba(128,128,128,0.8) 0%, transparent 70%)'
              }}
              animate={{
                scale: [1, 3, 5],
                opacity: [0.8, 0.4, 0]
              }}
              transition={{ duration: 3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heartbeat Pulsing Background */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(ellipse at center, rgba(185, 28, 28, 0.4) 0%, rgba(127, 29, 29, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%)',
            'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.6) 0%, rgba(153, 27, 27, 0.4) 50%, rgba(0, 0, 0, 0.9) 100%)',
            'radial-gradient(ellipse at center, rgba(185, 28, 28, 0.4) 0%, rgba(127, 29, 29, 0.3) 50%, rgba(0, 0, 0, 0.8) 100%)'
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1]
        }}
      />

      {/* Flying Crows Entrance Animation (One-Time) */}
      <AnimatePresence>
        {showCrows && (
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-30">
            {crows.map((crow) => (
              <motion.div
                key={crow.id}
                className="absolute text-black text-3xl"
                initial={{ 
                  x: '-20%', 
                  y: `${crow.y}%`,
                  opacity: 0,
                  scale: 0.8
                }}
                animate={{
                  x: '120%',
                  y: `${crow.y + Math.sin(crow.id * 0.5) * 20}%`,
                  opacity: [0, 0.8, 0.6, 0],
                  scale: [0.8, 1, 1, 0.9],
                  rotate: [0, 5, -5, 0, 10, -10]
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5
                }}
                transition={{
                  duration: crow.speed,
                  ease: "easeInOut",
                  delay: crow.delay,
                  opacity: { times: [0, 0.2, 0.8, 1] },
                  scale: { times: [0, 0.2, 0.8, 1] }
                }}
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.8))'
                }}
              >
                {/* SVG Crow for better visual */}
                <svg 
                  width="32" 
                  height="32" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                  className="text-black opacity-90"
                >
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 1L13.5 2.5C13.1 2.9 13.1 3.4 13.5 3.8L14.2 4.5L14.5 5L15 5.5L15.5 6L16 6.5C16.4 6.9 16.4 7.4 16 7.8L15 8.8L14.5 9.3L14 9.8L13.5 10.3C13.1 10.7 13.1 11.2 13.5 11.6L15 13.1V14.5C15 15.3 14.3 16 13.5 16S12 15.3 12 14.5V13.1L10.5 11.6C10.1 11.2 10.1 10.7 10.5 10.3L11 9.8L11.5 9.3L12 8.8L11 7.8C10.6 7.4 10.6 6.9 11 6.5L11.5 6L12 5.5L12.5 5L12.8 4.5L13.5 3.8C13.9 3.4 13.9 2.9 13.5 2.5L12 1L6 7V9H3V11H6L10 15L11 16L12 17L13 16L14 15L18 11H21V9H21Z"/>
                </svg>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Animated Fog at Bottom */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(64,64,64,0.6) 30%, transparent 100%)',
          transform: `translateY(${scrollY * 0.3}px)`
        }}
        animate={{
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Sharingan Cursor Effect */}
      <style>{`
        .sharingan-cursor {
          cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%23dc2626" stroke="%23000" stroke-width="2"/><circle cx="16" cy="16" r="8" fill="%23000"/><path d="M16,8 L16,24 M8,16 L24,16 M11,11 L21,21 M11,21 L21,11" stroke="%23dc2626" stroke-width="1.5" fill="none"/></svg>'), auto;
        }
      `}</style>

      <div className="sharingan-cursor">
        {/* Hero Section with Sharingan Banner */}
        <motion.div
          className="relative z-10 min-h-screen flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          {/* Animated Title Banner */}
          <motion.div
            className="pt-20 text-center relative"
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
            onMouseEnter={() => {
              setSharinganActive(true);
              playHoverSound();
            }}
            onMouseLeave={() => setSharinganActive(false)}
          >
            <motion.div
              className="relative inline-block"
              animate={sharinganActive ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              {/* Sharingan Eye */}
              <motion.div
                className="absolute -left-16 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full border-2 border-red-600"
                animate={sharinganActive ? {
                  backgroundColor: ['#000', '#dc2626', '#000'],
                  boxShadow: ['0 0 0 rgba(220, 38, 38, 0)', '0 0 30px rgba(220, 38, 38, 0.8)', '0 0 0 rgba(220, 38, 38, 0)'],
                  rotate: [0, 360]
                } : { backgroundColor: '#000' }}
                transition={{
                  duration: 2,
                  repeat: sharinganActive ? Infinity : 0,
                  ease: "linear"
                }}
              >
                <div className="absolute inset-2 rounded-full bg-red-600 opacity-80" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-black" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-1 bg-black" />
              </motion.div>

              <motion.h1
                className="text-7xl font-creepster font-bold text-red-100 mb-4 tracking-wider"
                style={{
                  textShadow: '0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4), 0 4px 8px rgba(0, 0, 0, 0.8)'
                }}
                animate={{
                  textShadow: [
                    '0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4), 0 4px 8px rgba(0, 0, 0, 0.8)',
                    '0 0 30px rgba(239, 68, 68, 1), 0 0 60px rgba(239, 68, 68, 0.6), 0 4px 8px rgba(0, 0, 0, 0.8)',
                    '0 0 20px rgba(220, 38, 38, 0.8), 0 0 40px rgba(220, 38, 38, 0.4), 0 4px 8px rgba(0, 0, 0, 0.8)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                FORBIDDEN OTAKU SCROLLS
              </motion.h1>
            </motion.div>

            <motion.p
              className="text-2xl text-red-200 opacity-80 mb-8 font-cinzel tracking-wide"
              animate={{
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Enter the Shadow Realm of Legendary Gear
            </motion.p>
          </motion.div>

          {/* Products Section */}
          <motion.div
            className="flex-1 relative z-20 bg-black/20 backdrop-blur-sm border-t border-red-800/30 mt-20"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 2.5 }}
          >
            <div className="container mx-auto px-4 py-16">
              {/* Section Titles with Shake Animation */}
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3 }}
              >
                <motion.h2
                  className="text-5xl font-creepster font-bold text-red-100 mb-4 tracking-wider"
                  style={{
                    textShadow: '0 0 15px rgba(220, 38, 38, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)'
                  }}
                  animate={{
                    x: [0, -2, 2, 0],
                    textShadow: [
                      '0 0 15px rgba(220, 38, 38, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)',
                      '0 0 25px rgba(239, 68, 68, 0.8), 0 2px 4px rgba(0, 0, 0, 0.8)',
                      '0 0 15px rgba(220, 38, 38, 0.6), 0 2px 4px rgba(0, 0, 0, 0.8)'
                    ]
                  }}
                  transition={{
                    x: { duration: 0.1, repeat: Infinity, repeatDelay: 3 },
                    textShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  LEGENDARY COLLECTION
                </motion.h2>
                <motion.p
                  className="text-red-200 opacity-80 text-xl font-cinzel"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  Forbidden Artifacts from the Hidden Villages
                </motion.p>
              </motion.div>
              
              {/* Products Grid */}
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <motion.div
                    className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 3.5 }}
                >
                  {otakuProducts.map((product, index) => (
                    <motion.div
                      key={product.id_produit}
                      className="relative group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Simple Card with Otaku Theme */}
                      <div className="relative bg-black/80 border border-red-800/30 rounded-lg p-4 transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-900/20">
                        
                        {/* Simple Red Glow on Hover */}
                        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 bg-red-500 transition-opacity duration-300" />

                        {/* Product Card */}
                        <ProduitCard
                          produit={product}
                          discountPercentage={offerMap.get(product.id_produit)}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Bottom Quote with Parallax */}
          <motion.div
            className="text-center py-12 bg-black/80 relative"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`
            }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 4 }}
          >
            <motion.p
              className="text-red-100 text-2xl italic opacity-80 font-cinzel mb-4"
              animate={{
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              "Those who cannot acknowledge themselves will eventually fail"
            </motion.p>
            <p className="text-red-300 text-lg opacity-60 font-cinzel">- Itachi Uchiha</p>
          </motion.div>
        </motion.div>

        {/* Ambient Wind Effects */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="fixed text-gray-400 opacity-20 pointer-events-none"
            style={{
              top: `${20 + i * 20}%`,
              left: i % 2 === 0 ? '-10%' : '110%'
            }}
            animate={{
              x: i % 2 === 0 ? ['0%', '120%'] : ['0%', '-120%'],
              opacity: [0, 0.3, 0.1, 0]
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2
            }}
          >
            <Wind size={24 + i * 4} />
          </motion.div>
        ))}
      </div>

      {/* Back to Home Button */}
      <BackToHomeButton />
    </div>
  );
};

export default ItachiZone;