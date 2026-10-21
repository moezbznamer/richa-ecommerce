import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCards = () => {
  const categories = [
    {
      id: 'man',
      name: 'Man',
      description: 'Bold & Rugged',
      image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=500&fit=crop',
      gradient: 'from-slate-800/90 to-slate-900/90',
      textColor: 'text-white',
      accent: 'border-blue-500'
    },
    {
      id: 'woman',
      name: 'Woman',
      description: 'Elegant & Vibrant',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=500&fit=crop',
      gradient: 'from-rose-300/90 to-orange-300/90',
      textColor: 'text-white',
      accent: 'border-rose-400'
    },
    {
      id: 'girl',
      name: 'Girl',
      description: 'Playful & Colorful',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=500&fit=crop',
      gradient: 'from-pink-300/90 to-purple-300/90',
      textColor: 'text-white',
      accent: 'border-pink-400',
      sparkles: true
    },
    {
      id: 'boy',
      name: 'Boy',
      description: 'Dynamic & Active',
      image: 'https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=400&h=500&fit=crop',
      gradient: 'from-blue-400/90 to-orange-400/90',
      textColor: 'text-white',
      accent: 'border-blue-400'
    },
    {
      id: 'otaku',
      name: 'Otaku',
      description: 'Anime & Manga Style',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop',
      gradient: 'from-purple-800/90 to-pink-900/90',
      textColor: 'text-white',
      accent: 'border-purple-400',
      neon: true
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your perfect style across our curated collections
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 ${
                index === 0 ? 'lg:col-span-2 lg:row-span-2' : 
                index === 1 ? 'lg:row-span-2' : ''
              } ${category.neon ? 'animate-pulse-neon' : ''}`}
            >
              <Link to={`/${category.id}`}>
                <div className="relative h-80 lg:h-96 group">
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${category.image})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient}`} />
                  
                  {/* Sparkles for Girl category */}
                  {category.sparkles && (
                    <div className="absolute inset-0">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white rounded-full animate-sparkle"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className={`text-3xl md:text-4xl font-playfair font-bold mb-2 ${category.textColor}`}>
                        {category.name}
                      </h3>
                      <p className={`text-lg ${category.textColor} opacity-90 mb-4`}>
                        {category.description}
                      </p>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className={`inline-flex items-center ${category.textColor} font-semibold text-lg group-hover:underline`}
                      >
                        Explore Collection →
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Accent Border */}
                  <div className={`absolute inset-0 border-2 ${category.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryCards;
