import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, ShoppingCart, Menu, X, Heart, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';

// URL du panneau admin
const ADMIN_PANEL_URL = '/admin';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const { getCartItemsCount } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data } = await supabase.rpc('is_admin', { user_id: user.id });
      setIsAdmin(data === true);
    };
    checkAdminStatus();
  }, [user]);

  const menuItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.men'), href: '/man' },
    { name: t('nav.women'), href: '/woman' },
    { name: t('nav.kids'), href: '/kids' },
    { name: t('nav.otaku'), href: '/otaku' },
    { name: 'Design Perso', href: '/custom-design' },
    { name: 'Otaku Zone', href: '/otaku-zone' },
  ];

  const searchResults = [
    'Black T-Shirt',
    'Gold Chain',
    'Luxury Hoodie',
    'Designer Jeans',
    'Premium Sneakers'
  ].filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));

  const cartItemsCount = getCartItemsCount();

  return (
    <motion.nav 
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-4xl font-oswald font-bold text-luxury-gold tracking-wider"
            >
              RICHA
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="nav-link font-medium text-lg"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search & Icons */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Search */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 text-foreground hover:text-primary transition-colors rounded-full hover:bg-foreground/10"
              >
                <Search size={24} />
              </motion.button>
              
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -10 }}
                    className="absolute right-0 top-full mt-4 w-80 bg-luxury-card rounded-xl shadow-2xl border border-gray-700 overflow-hidden"
                  >
                    <div className="p-4">
                      <input
                        type="text"
                        placeholder="Search luxury items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="luxury-search w-full"
                        autoFocus
                      />
                      {searchQuery && searchResults.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {searchResults.map((result, index) => (
                            <div
                              key={index}
                              className="p-3 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors"
                            >
                              <span className="text-white">{result}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Admin Panel Link - only for admins */}
            {isAdmin && (
              ADMIN_PANEL_URL.startsWith('http') ? (
                <a href={ADMIN_PANEL_URL} target="_blank" rel="noopener noreferrer">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 text-luxury-gold hover:text-luxury-gold/80 transition-colors rounded-full hover:bg-luxury-gold/10 flex items-center gap-1"
                    title="Ouvrir le Panneau Admin"
                  >
                    <Shield size={24} />
                    <ExternalLink size={12} className="opacity-60" />
                  </motion.button>
                </a>
              ) : (
                <Link to={ADMIN_PANEL_URL}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 text-luxury-gold hover:text-luxury-gold/80 transition-colors rounded-full hover:bg-luxury-gold/10"
                    title="Admin Dashboard"
                  >
                    <Shield size={24} />
                  </motion.button>
                </Link>
              )
            )}

            {/* Login/Profile Button */}
            {user ? (
              <Link to="/profile">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 text-foreground hover:text-primary transition-colors rounded-full hover:bg-foreground/10"
                >
                  <User size={24} />
                </motion.button>
              </Link>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 text-foreground hover:text-primary transition-colors rounded-full hover:bg-foreground/10"
                >
                  <User size={24} />
                </motion.button>
              </Link>
            )}

            {/* Wishlist */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 text-foreground hover:text-primary transition-colors rounded-full hover:bg-foreground/10"
            >
              <Heart size={24} />
            </motion.button>

            {/* Cart */}
            <Link to="/cart">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-foreground hover:text-primary transition-colors rounded-full hover:bg-foreground/10 relative"
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-luxury-gold text-black text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </motion.button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-3 text-foreground hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-luxury-card border-t border-gray-800"
          >
            <div className="px-4 py-6 space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="block px-4 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-lg font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Controls */}
              <div className="pt-4 border-t border-gray-700 space-y-4">
                <div className="flex items-center justify-between px-4">
                  <span className="text-foreground text-sm">Language</span>
                  <LanguageSelector />
                </div>
                
                <div className="flex items-center justify-between px-4">
                  <span className="text-foreground text-sm">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
              
              {/* Mobile Auth Link */}
              <div className="pt-4 border-t border-gray-700">
                {isAdmin && (
                  ADMIN_PANEL_URL.startsWith('http') ? (
                    <a
                      href={ADMIN_PANEL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-3 text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-colors text-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield size={20} />
                      Panneau Admin
                      <ExternalLink size={14} className="opacity-60" />
                    </a>
                  ) : (
                    <Link
                      to={ADMIN_PANEL_URL}
                      className="flex items-center gap-2 px-4 py-3 text-luxury-gold hover:bg-luxury-gold/10 rounded-lg transition-colors text-lg font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield size={20} />
                      Admin Dashboard
                    </Link>
                  )
                )}
                {user ? (
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors text-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
