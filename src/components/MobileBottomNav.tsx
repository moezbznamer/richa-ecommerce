
import { motion } from 'framer-motion';
import { Home, User, ShoppingCart, Grid3X3, Search } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

const MobileBottomNav = () => {
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  const navItems = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Catégories', href: '/categories', icon: Grid3X3 },
    { name: 'Recherche', href: '#', icon: Search, action: () => setIsSearchOpen(true) },
    { 
      name: 'Panier', 
      href: '/cart', 
      icon: ShoppingCart,
      badge: cartItemsCount > 0 ? cartItemsCount : undefined
    },
    { name: 'Profil', href: '/profile', icon: User },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <motion.nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-luxury-black/95 backdrop-blur-lg border-t border-luxury-gold/20 lg:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-around items-center py-2 px-4 max-w-lg mx-auto">
          {navItems.map((item) => (
            <motion.div
              key={item.name}
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex flex-col items-center relative"
            >
              {item.action ? (
                <button
                  onClick={item.action}
                  className={`p-3 rounded-xl transition-all duration-200 relative ${
                    isActive(item.href)
                      ? 'bg-luxury-gold text-black'
                      : 'text-gray-400 hover:text-luxury-gold'
                  }`}
                >
                  <item.icon size={20} />
                  {item.badge && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </button>
              ) : (
                <Link
                  to={item.href}
                  className={`p-3 rounded-xl transition-all duration-200 relative ${
                    isActive(item.href)
                      ? 'bg-luxury-gold text-black'
                      : 'text-gray-400 hover:text-luxury-gold'
                  }`}
                >
                  <item.icon size={20} />
                  {item.badge && (
                    <motion.span
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </Link>
              )}
              <span className={`text-xs mt-1 transition-colors duration-200 ${
                isActive(item.href) ? 'text-luxury-gold' : 'text-gray-500'
              }`}>
                {item.name}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 lg:hidden"
          onClick={() => setIsSearchOpen(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="absolute bottom-0 left-0 right-0 bg-luxury-card rounded-t-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
            <h3 className="text-luxury-gold text-xl font-semibold mb-4">Rechercher des produits</h3>
            <input
              type="text"
              placeholder="Que recherchez-vous ?"
              className="w-full bg-luxury-black border border-luxury-gold/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button className="flex-1 bg-luxury-gold text-black py-3 rounded-xl font-semibold">
                Rechercher
              </button>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl"
              >
                Annuler
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Bottom padding for content to avoid overlap */}
      <div className="h-20 lg:hidden"></div>
    </>
  );
};

export default MobileBottomNav;
