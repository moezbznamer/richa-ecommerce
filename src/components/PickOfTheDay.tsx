
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Clock, Tag } from 'lucide-react';
import { useProduitOffers } from '@/hooks/useProduitOffers';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PickOfTheDay = () => {
  const [currentPick, setCurrentPick] = useState(0);
  const { offers, loading, error } = useProduitOffers();
  const { t } = useTranslation();

  useEffect(() => {
    if (offers.length > 1) {
      const timer = setInterval(() => {
        setCurrentPick((prev) => (prev + 1) % offers.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [offers.length]);

  if (loading) {
    return (
      <section className="py-20 bg-luxury-gradient">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || offers.length === 0) {
    return null;
  }

  const offer = offers[currentPick];
  const produit = offer.produit;

  if (!produit) return null;

  const discountedPrice = produit.prix - (produit.prix * (offer.discount_percentage || 0) / 100);
  const endDate = new Date(offer.date_fin);
  const now = new Date();
  const timeLeft = endDate.getTime() - now.getTime();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minutesLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  return (
    <section className="py-20 bg-luxury-gradient">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Sparkles className="w-8 h-8 text-luxury-gold animate-luxury-pulse" />
            <h2 className="text-4xl md:text-5xl font-oswald font-bold text-white">
              {t('pickOfTheDay.title', 'PICK')} <span className="text-luxury-gold">{t('pickOfTheDay.subtitle', 'OF THE DAY')}</span>
            </h2>
            <Sparkles className="w-8 h-8 text-luxury-gold animate-luxury-pulse" />
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('pickOfTheDay.description', 'Les meilleures offres sélectionnées pour vous')}
          </p>
        </motion.div>

        <motion.div
          key={currentPick}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="luxury-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Image Side */}
              <div className="relative overflow-hidden group">
                <img
                  src={offer.image_url || `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop`}
                  alt={produit.nom || 'Product'}
                  className="w-full h-96 lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Discount Badge */}
                {offer.discount_percentage && offer.discount_percentage > 0 && (
                  <div className="absolute top-4 left-4">
                    <div className="bg-red-500 text-white rounded-full px-4 py-2 font-bold flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>-{offer.discount_percentage}%</span>
                    </div>
                  </div>
                )}

                {/* Countdown Timer */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glassmorphism rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center space-x-2 text-luxury-gold mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold text-sm">{t('pickOfTheDay.timeLeft', 'Temps restant')}</span>
                    </div>
                    <p className="text-white font-bold text-lg">{hoursLeft}h {minutesLeft}m</p>
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="p-8">
                <div className="h-full flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="text-luxury-gold text-sm font-semibold uppercase tracking-wide">
                      {produit.type_produit}
                    </span>
                  </div>

                  <h3 className="text-3xl font-oswald font-bold text-white mb-4">
                    {produit.nom}
                  </h3>

                  {/* Stock Info */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-luxury-gold text-luxury-gold"
                        />
                      ))}
                    </div>
                    <span className="text-gray-400">
                      {offer.nombre_disponible} {t('pickOfTheDay.available', 'disponibles')}
                    </span>
                  </div>

                  {/* Size */}
                  {offer.taille && (
                    <div className="mb-4">
                      <span className="text-gray-400">{t('pickOfTheDay.size', 'Taille')}: </span>
                      <span className="text-white font-semibold">{offer.taille}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-center space-x-3">
                      <span className="text-luxury-gold text-3xl font-bold">
                        {discountedPrice.toFixed(0)} DT
                      </span>
                      {offer.discount_percentage && offer.discount_percentage > 0 && (
                        <>
                          <span className="text-gray-400 text-xl line-through">
                            {produit.prix} DT
                          </span>
                          <span className="text-green-500 font-bold">
                            -{(produit.prix - discountedPrice).toFixed(0)} DT
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/produit/${produit.id_produit}`}
                    className="btn-luxury flex items-center justify-center space-x-2 w-full"
                  >
                    <span>{t('pickOfTheDay.viewOffer', 'VOIR L\'OFFRE')}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Indicators */}
        {offers.length > 1 && (
          <div className="flex justify-center mt-8 space-x-3">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentPick
                    ? 'bg-luxury-gold scale-125'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PickOfTheDay;
