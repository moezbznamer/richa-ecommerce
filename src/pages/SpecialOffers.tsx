
import { motion } from 'framer-motion';
import { useOffers } from '@/hooks/useOffers';
import ProductCard from '@/components/ProductCard';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useTranslation } from 'react-i18next';

const SpecialOffers = () => {
  const { offers, loading, error } = useOffers();
  const { t } = useTranslation();

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-luxury-black dark:bg-gray-900 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full"></div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-luxury-black dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center text-red-500">
            <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
            <p>{error}</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-luxury-black dark:bg-gray-900">
        {/* Hero Section */}
        <section className="relative py-20 bg-luxury-gradient">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6 font-playfair"
            >
              {t('offers.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              {t('offers.subtitle')}
            </motion.p>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {offers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {offers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {offer.products && (
                      <ProductCard
                        product={{
                          id: offer.products.id,
                          name: offer.products.name,
                          price: offer.products.price,
                          original_price: offer.products.original_price,
                          discount_percentage: offer.discount_percentage,
                          image_url: offer.products.image_url,
                          rating: offer.products.rating,
                          reviews_count: offer.products.reviews_count,
                          brand: offer.products.brand,
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <h3 className="text-2xl text-white dark:text-gray-100 mb-4">
                  {t('offers.noOffers')}
                </h3>
                <p className="text-gray-400 dark:text-gray-500">
                  Revenez bientôt pour découvrir nos prochaines promotions !
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

export default SpecialOffers;
