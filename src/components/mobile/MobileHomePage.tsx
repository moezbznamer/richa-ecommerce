import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileHeader from './MobileHeader';
import PromoBanner from './PromoBanner';
import MobileProductGrid from './MobileProductGrid';
import MarketingSection from './MarketingSection';
import HeroBanner from './HeroBanner';
import MobileBottomNav from '../MobileBottomNav';
import { useProduits } from '@/hooks/useProduits';
import { useProduitOffers } from '@/hooks/useProduitOffers';

// Import hero images
import heroImage1 from '@/assets/hero-anime-1.jpg';
import heroImage2 from '@/assets/hero-naruto-1.jpg';

const MobileHomePage = () => {
  const { t } = useTranslation();
  const { produits, loading } = useProduits();
  const { offers } = useProduitOffers();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Create discount map from offers
  const discountMap = new Map<number, number>();
  offers.forEach(offer => {
    if (offer.id_produit && offer.discount_percentage) {
      discountMap.set(offer.id_produit, offer.discount_percentage);
    }
  });

  // Split products for different sections
  const trendingProducts = produits.slice(0, 4);
  const newArrivals = produits.slice(4, 8);

  const menuItems = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.men'), href: '/man' },
    { name: t('nav.women'), href: '/woman' },
    { name: t('nav.kids'), href: '/kids' },
    { name: t('nav.otaku'), href: '/otaku' },
    { name: 'Design Perso', href: '/custom-design' },
    { name: 'Offres Spéciales', href: '/offers' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <MobileHeader 
        onMenuClick={() => setIsMenuOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      {/* Promo Banner */}
      <PromoBanner text="🔥 Livraison gratuite à partir de 150 DT" />

      {/* Main Content */}
      <main>
        {/* Trending Section */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <MobileProductGrid 
              products={trendingProducts}
              discountMap={discountMap}
              title="Tendance du moment"
            />

            {/* Marketing Section */}
            <MarketingSection 
              title="Qualité Premium"
              subtitle="Découvrez notre collection exclusive de vêtements haut de gamme, conçus pour vous sublimer."
            />

            {/* Hero Banner */}
            <HeroBanner 
              imageUrl={heroImage1}
              title="Collection Été 2024"
              subtitle="Styles uniques pour une saison inoubliable"
              buttonText="Découvrir"
              buttonLink="/all-produits"
            />

            {/* New Arrivals */}
            <MobileProductGrid 
              products={newArrivals}
              discountMap={discountMap}
              title="Nouveautés"
            />

            {/* Second Banner */}
            <HeroBanner 
              imageUrl={heroImage2}
              title="Collection Otaku"
              subtitle="Pour les fans de culture japonaise"
              buttonText="Voir la collection"
              buttonLink="/otaku"
            />

            {/* Marketing */}
            <MarketingSection 
              title="Créez votre style"
              subtitle="Personnalisez vos vêtements avec notre service de design sur mesure."
            />
          </>
        )}
      </main>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-background z-50 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="text-xl font-oswald font-bold text-primary">RICHA</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-foreground"
                >
                  <X size={24} />
                </button>
              </div>
              
              <nav className="py-4">
                {menuItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-4 text-foreground hover:bg-muted transition-colors text-lg"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              className="bg-background p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-foreground"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHomePage;
