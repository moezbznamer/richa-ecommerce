
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProduits } from '@/hooks/useProduits';
import { useProduitOffers } from '@/hooks/useProduitOffers';
import ProduitCard from '@/components/ProduitCard';
import SearchAndFilter, { FilterOptions } from '@/components/SearchAndFilter';
import MobileSearchFilter from '@/components/MobileSearchFilter';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useTranslation } from 'react-i18next';

interface ProduitCollectionProps {
  categorie: 'man' | 'woman' | 'girl' | 'boy' | 'otaku';
  title: string;
  description: string;
}

const ProduitCollection = ({ categorie, title, description }: ProduitCollectionProps) => {
  const { produits, loading, fetchProduits } = useProduits();
  const { offers } = useProduitOffers();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    gender: categorie,
    product_type: '',
    minPrice: 0,
    maxPrice: 1000,
    size: '',
    color: '',
    brand: '',
  });

  useEffect(() => {
    fetchProduits(categorie, searchQuery);
  }, [categorie, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters({ ...newFilters, gender: categorie });
  };

  // Create a map of product offers for quick lookup
  const offerMap = new Map(offers.map(offer => [offer.id_produit, offer.discount_percentage || 0]));

  return (
    <ResponsiveLayout>
      {/* Mobile Header */}
      <div className="lg:hidden">
        <div className="bg-luxury-gradient py-8 px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white font-playfair text-center"
          >
            {title}
          </motion.h1>
        </div>
        <MobileSearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          searchQuery={searchQuery}
          filters={filters}
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-luxury-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-6xl font-bold text-white font-playfair mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            {description}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-12 pb-24 lg:pb-12">
        {/* Desktop Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 hidden lg:block"
        >
          <SearchAndFilter
            onSearch={handleSearch}
            onFilter={handleFilter}
            searchQuery={searchQuery}
            filters={filters}
          />
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-luxury-gold border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6"
          >
            {produits.map((produit, index) => (
              <motion.div
                key={produit.id_produit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProduitCard 
                  produit={produit} 
                  discountPercentage={offerMap.get(produit.id_produit) || 0}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && produits.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <h3 className="text-2xl text-white mb-4">Aucun produit trouvé</h3>
            <p className="text-gray-400">Essayez d'ajuster votre recherche ou vos filtres</p>
          </motion.div>
        )}
      </div>
    </ResponsiveLayout>
  );
};

export default ProduitCollection;
