
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useProduits } from '@/hooks/useProduits';
import ProduitCard from './ProduitCard';
import { Link } from 'react-router-dom';

interface ProduitShowcaseProps {
  category?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

const ProduitShowcase: React.FC<ProduitShowcaseProps> = ({ 
  category, 
  title = "NOS PRODUITS", 
  subtitle = "Découvrez notre collection exclusive",
  limit = 8 
}) => {
  const { produits, loading, error } = useProduits();

  React.useEffect(() => {
    // Fetch products when component mounts or category changes
  }, [category]);

  if (loading) {
    return (
      <section className="py-20 bg-luxury-black">
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
      <section className="py-20 bg-luxury-black">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            Erreur lors du chargement des produits: {error}
          </div>
        </div>
      </section>
    );
  }

  // Filter products by category if specified
  const filteredProduits = category 
    ? produits.filter(produit => produit.type_produit === category)
    : produits;

  const displayedProduits = filteredProduits.slice(0, limit);

  return (
    <section className="py-20 bg-luxury-black">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-oswald font-bold text-white mb-4">
            {title.split(' ')[0]} <span className="text-luxury-gold">{title.split(' ').slice(1).join(' ')}</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {displayedProduits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {displayedProduits.map((produit, index) => (
              <motion.div
                key={produit.id_produit}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProduitCard produit={produit} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mb-12">
            Aucun produit disponible pour le moment
          </div>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Link to="/produits" className="btn-luxury inline-flex items-center space-x-2">
            <span>Voir tous les produits</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProduitShowcase;
