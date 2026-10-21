
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useProduitOffers } from '@/hooks/useProduitOffers';
import ProduitCard from './ProduitCard';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PromotionalProductShowcase = () => {
  const { offers, loading, error } = useProduitOffers();
  const { t } = useTranslation();

  if (loading) {
    return (
      <section className="py-20 bg-luxury-black dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-luxury-black dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            {t('common.error')}: {error}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-luxury-black dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-oswald font-bold text-white dark:text-gray-100 mb-4">
            {t('offers.title')}
          </h2>
          <p className="text-gray-300 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t('offers.subtitle')}
          </p>
        </motion.div>

        {offers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {offers.slice(0, 4).map((offer, index) => (
              <motion.div
                key={offer.id_offer}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {offer.produit && (
                  <ProduitCard 
                    produit={offer.produit} 
                    discountPercentage={offer.discount_percentage || 0}
                  />
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500 mb-12">
            {t('offers.noOffers')}
          </div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link to="/offers" className="btn-luxury inline-flex items-center space-x-2">
            <span>{t('offers.viewAll')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PromotionalProductShowcase;
