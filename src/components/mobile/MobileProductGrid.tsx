import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getProductImageUrl } from '@/utils/imageUtils';

interface Produit {
  id_produit: number;
  nom: string;
  prix: number;
  couleur_disponible?: string;
}

interface MobileProductGridProps {
  products: Produit[];
  discountMap?: Map<number, number>;
  title?: string;
}

const MobileProductGrid = ({ products, discountMap, title }: MobileProductGridProps) => {
  const [productImages, setProductImages] = useState<Map<number, string>>(new Map());

  useEffect(() => {
    const fetchImages = async () => {
      const imageMap = new Map<number, string>();
      
      for (const product of products) {
        const { data } = await supabase
          .from('images_produit')
          .select('image_url')
          .eq('id_produit', product.id_produit)
          .limit(1)
          .single();
        
        if (data?.image_url) {
          imageMap.set(product.id_produit, getProductImageUrl(data.image_url));
        }
      }
      
      setProductImages(imageMap);
    };

    if (products.length > 0) {
      fetchImages();
    }
  }, [products]);

  const getVariantCount = (couleur?: string) => {
    if (!couleur) return 0;
    return couleur.split(',').length;
  };

  return (
    <section className="px-4 py-6">
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl font-semibold text-center text-foreground mb-6"
        >
          {title}
        </motion.h2>
      )}

      <div className="grid grid-cols-2 gap-3">
        {products.map((product, index) => {
          const discount = discountMap?.get(product.id_produit);
          const originalPrice = product.prix;
          const discountedPrice = discount 
            ? originalPrice * (1 - discount / 100) 
            : null;
          const variantCount = getVariantCount(product.couleur_disponible);

          return (
            <motion.div
              key={product.id_produit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/produit/${product.id_produit}`}>
                <div className="bg-card rounded-xl overflow-hidden shadow-sm border border-border">
                  {/* Image Container */}
                  <div className="relative aspect-[3/4] bg-muted">
                    <img
                      src={productImages.get(product.id_produit) || '/placeholder.svg'}
                      alt={product.nom}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('placeholder.svg')) {
                          target.src = '/placeholder.svg';
                        }
                      }}
                    />
                    
                    {/* Favorite Button */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <Heart size={16} className="text-foreground" />
                    </motion.button>

                    {/* Discount Badge */}
                    {discount && (
                      <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
                        -{discount}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
                      {product.nom}
                    </h3>
                    
                    {/* Prices */}
                    <div className="flex items-center gap-2 mb-2">
                      {discountedPrice ? (
                        <>
                          <span className="text-xs text-muted-foreground line-through">
                            {originalPrice.toFixed(2)} DT
                          </span>
                          <span className="text-sm font-bold text-primary">
                            {discountedPrice.toFixed(2)} DT
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-foreground">
                          {originalPrice.toFixed(2)} DT
                        </span>
                      )}
                    </div>

                    {/* Variant Indicators */}
                    {variantCount > 1 && (
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(variantCount, 4) }).map((_, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded-full bg-muted border border-border"
                          />
                        ))}
                        {variantCount > 4 && (
                          <span className="text-xs text-muted-foreground">
                            +{variantCount - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default MobileProductGrid;
