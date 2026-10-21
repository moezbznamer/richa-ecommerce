import { useState, useEffect } from 'react';
import { Menu, Search, Heart, ShoppingCart, User, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

// URL du panneau admin
const ADMIN_PANEL_URL = '/admin';

interface MobileHeaderProps {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
}

const MobileHeader = ({ onMenuClick, onSearchClick }: MobileHeaderProps) => {
  const { getCartItemsCount } = useCart();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const cartItemsCount = getCartItemsCount();

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

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left - Menu */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="p-2 text-foreground hover:text-primary transition-colors"
        >
          <Menu size={24} />
        </motion.button>

        {/* Center - Logo */}
        <Link to="/" className="absolute left-1/2 transform -translate-x-1/2">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-oswald font-bold text-primary tracking-wider"
          >
            RICHA
          </motion.div>
        </Link>

        {/* Right - Icons */}
        <div className="flex items-center gap-1">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onSearchClick}
            className="p-2 text-foreground hover:text-primary transition-colors"
          >
            <Search size={20} />
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-2 text-foreground hover:text-primary transition-colors"
          >
            <Heart size={20} />
          </motion.button>

          {/* Admin Panel - only for admins */}
          {isAdmin && (
            ADMIN_PANEL_URL.startsWith('http') ? (
              <a href={ADMIN_PANEL_URL} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-primary hover:text-primary/80 transition-colors relative"
                >
                  <Shield size={20} />
                  <ExternalLink size={8} className="absolute top-1 right-1 opacity-60" />
                </motion.button>
              </a>
            ) : (
              <Link to={ADMIN_PANEL_URL}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 text-primary hover:text-primary/80 transition-colors"
                >
                  <Shield size={20} />
                </motion.button>
              </Link>
            )
          )}
          
          <Link to="/cart">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-foreground hover:text-primary transition-colors relative"
            >
              <ShoppingCart size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </motion.button>
          </Link>
          
          <Link to="/profile">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              <User size={20} />
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default MobileHeader;
