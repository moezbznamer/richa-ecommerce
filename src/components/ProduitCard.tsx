
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCartDatabase } from '@/hooks/useCartDatabase';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { getProductImageUrl } from '@/utils/imageUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface Produit {
  id_produit: number;
  nom: string;
  description?: string;
  prix: number;
  taille?: string;
  nombre_en_stock: number;
  type_produit: 'man' | 'woman' | 'girl' | 'boy' | 'otaku';
  couleur_disponible?: string;
}

interface ProduitCardProps {
  produit: Produit;
  discountPercentage?: number;
}

const ProduitCard: React.FC<ProduitCardProps> = ({ produit, discountPercentage }) => {
  const { addToCart } = useCartDatabase();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [productImage, setProductImage] = useState<string>('/placeholder.svg');

  useEffect(() => {
    const fetchFirstImage = async () => {
      try {
        const { data, error } = await supabase
          .from('images_produit')
          .select('image_url')
          .eq('id_produit', produit.id_produit)
          .limit(1)
          .single();

        if (!error && data) {
          setProductImage(getProductImageUrl(data.image_url));
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
      }
    };

    fetchFirstImage();
  }, [produit.id_produit]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const availableSizes = produit.taille ? 
      produit.taille.split(/[\s,]+/).filter(Boolean).map((s: string) => s.trim()) : 
      [];
    
    const availableColors = produit.couleur_disponible ? 
      produit.couleur_disponible.split(/[\s,]+/).filter(Boolean).map((c: string) => c.trim()) : 
      [];
    
    const selectedSize = availableSizes.length === 1 ? availableSizes[0] : undefined;
    const selectedColor = availableColors.length === 1 ? availableColors[0] : undefined;
    
    await addToCart(
      produit.id_produit,
      produit.nom,
      Number(produit.prix),
      1,
      selectedSize,
      selectedColor,
      productImage
    );
  };

  const finalPrice = discountPercentage 
    ? Number(produit.prix) * (1 - discountPercentage / 100)
    : Number(produit.prix);

  // Mobile Layout - Clean like Zaful/Shein style
  if (isMobile) {
    return (
      <motion.div
        className="bg-card rounded-xl overflow-hidden cursor-pointer shadow-sm border border-border/30"
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(`/produit/${produit.id_produit}`)}
      >
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={productImage}
            alt={produit.nom}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('placeholder.svg')) {
                target.src = '/placeholder.svg';
              }
            }}
          />
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
              -{discountPercentage}%
            </div>
          )}
        </div>

        {/* Price and Cart Row */}
        <div className="p-3 flex items-center justify-between">
          <div>
            {discountPercentage && discountPercentage > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-foreground">
                  {finalPrice.toFixed(2)} DT
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {Number(produit.prix).toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-foreground">
                {Number(produit.prix).toFixed(2)} DT
              </span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="p-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Desktop Layout - Original design
  return (
    <motion.div
      className="luxury-card overflow-hidden group cursor-pointer"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => navigate(`/produit/${produit.id_produit}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={productImage}
          alt={produit.nom}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('placeholder.svg')) {
              target.src = '/placeholder.svg';
            }
          }}
        />
        {discountPercentage && discountPercentage > 0 && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded-full text-sm font-bold">
            -{discountPercentage}%
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <motion.button
              className="bg-luxury-gold text-black p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="bg-white text-black p-2 rounded-full"
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/produit/${produit.id_produit}`);
              }}
            >
              <Eye className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <button className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Heart className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2">
          {produit.nom}
        </h3>
        
        {produit.description && (
          <p className="text-gray-300 text-sm mb-2 line-clamp-2">
            {produit.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div>
            {produit.taille && (
              <p className="text-gray-300 text-sm">{t('products.size')}: {produit.taille}</p>
            )}
            {produit.couleur_disponible && (
              <p className="text-gray-300 text-sm">{t('products.color')}: {produit.couleur_disponible}</p>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <p className="text-luxury-gold font-bold text-lg">
                {finalPrice.toFixed(2)} DT
              </p>
              {discountPercentage && discountPercentage > 0 && (
                <p className="text-gray-400 line-through text-sm">
                  {Number(produit.prix).toFixed(2)} DT
                </p>
              )}
            </div>
            <p className="text-gray-400 text-sm">{t('products.stock')}: {produit.nombre_en_stock}</p>
          </div>
        </div>

        <motion.button
          onClick={handleAddToCart}
          className="btn-luxury w-full flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={produit.nombre_en_stock === 0}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{produit.nombre_en_stock > 0 ? t('products.addToCart') : t('products.outOfStock')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProduitCard;
