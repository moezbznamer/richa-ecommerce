
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, User, Baby, UserCheck, Zap } from 'lucide-react';
import BackToHomeButton from '@/components/BackToHomeButton';

const Categories = () => {
  const categories = [
    {
      title: 'Men Collection',
      href: '/man',
      icon: User,
      image: '/placeholder.svg',
      description: 'Discover masculine style',
      color: 'from-blue-600 to-blue-800',
    },
    {
      title: 'Women Collection',
      href: '/woman',
      icon: Users,
      image: '/placeholder.svg',
      description: 'Elegant feminine fashion',
      color: 'from-pink-500 to-purple-600',
    },
    {
      title: 'Boys Collection',
      href: '/kids',
      icon: UserCheck,
      image: '/placeholder.svg',
      description: 'Cool styles for boys',
      color: 'from-green-500 to-teal-600',
    },
    {
      title: 'Girls Collection',
      href: '/kids',
      icon: Baby,
      image: '/placeholder.svg',
      description: 'Sweet styles for girls',
      color: 'from-rose-400 to-pink-500',
    },
    {
      title: 'Otaku Zone',
      href: '/otaku-zone',
      icon: Zap,
      image: '/placeholder.svg',
      description: 'Anime & Manga inspired fashion',
      color: 'from-purple-600 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-luxury-black pb-20 lg:pb-0">
      <BackToHomeButton />

      {/* Header */}
      <div className="bg-luxury-gradient py-12 lg:py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl lg:text-6xl font-bold text-white font-playfair mb-4"
          >
            Shop by Category
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto px-4"
          >
            Explore our curated collections for every style and occasion
          </motion.p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={category.href}
                className="block group"
              >
                <motion.div
                  className="relative overflow-hidden rounded-2xl bg-luxury-card border border-luxury-gold/20 hover:border-luxury-gold/40 transition-all duration-300"
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`}></div>
                  
                  {/* Content */}
                  <div className="relative p-6 lg:p-8 text-center">
                    <div className="mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-luxury-gold/10 rounded-2xl mb-4">
                        <category.icon className="w-8 h-8 lg:w-10 lg:h-10 text-luxury-gold" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {category.description}
                    </p>
                    
                    <div className="inline-flex items-center text-luxury-gold font-semibold group-hover:translate-x-2 transition-transform">
                      Shop Now
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-luxury-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
