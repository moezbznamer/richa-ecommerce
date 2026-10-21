
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProductImageUrl } from '@/utils/imageUtils';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import OfferBadge from './OfferBadge';

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  image_url?: string;
  rating?: number;
  reviews_count?: number;
  brand?: string;
  gender?: string;
  product_type?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [productImage, setProductImage] = useState<string>(product.image_url || '/placeholder.svg');
  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFirstImage = async () => {
      try {
        const { data, error } = await supabase
          .from('images_produit')
          .select('image_url')
          .eq('id_produit', product.id)
          .limit(1)
          .single();

        if (!error && data) {
          setProductImage(getProductImageUrl(data.image_url));
        }
      } catch (error) {
        console.error('Error fetching product image:', error);
      }
    };

    if (product.id) {
      fetchFirstImage();
    }
  }, [product.id]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled:', product.id);
    // TODO: Implement wishlist functionality
  };

  return (
    <motion.div
      className="luxury-card group cursor-pointer relative overflow-hidden h-full"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${product.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Discount Badge */}
      {product.discount_percentage && product.discount_percentage > 0 && (
        <div className="absolute top-2 left-2 z-10">
          <OfferBadge discount={product.discount_percentage} />
        </div>
      )}

      {/* Wishlist Button */}
      <motion.button
        className={`absolute top-2 right-2 p-2 rounded-full z-10 transition-all duration-300 ${
          isWishlisted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
        }`}
        onClick={handleWishlist}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className={`w-3 h-3 lg:w-4 lg:h-4 ${isWishlisted ? 'fill-current' : ''}`} />
      </motion.button>

      {/* Product Image */}
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={productImage}
          alt={product.name}
          className="w-full h-48 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Mobile Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2 lg:space-x-3">
            <motion.button
              className="bg-luxury-gold text-black p-2 lg:p-2 rounded-full touch-manipulation"
              whileHover={{ scale: 1.1 }}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5" />
            </motion.button>
            <motion.button
              className="bg-white text-black p-2 lg:p-2 rounded-full touch-manipulation"
              whileHover={{ scale: 1.1 }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${product.id}`);
              }}
            >
              <Eye className="w-4 h-4 lg:w-5 lg:h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 lg:p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-luxury-gold font-medium uppercase tracking-wider">
            {product.brand || 'RRICHA'}
          </span>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 lg:w-4 lg:h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-xs lg:text-sm text-gray-300">
              {product.rating?.toFixed(1) || '4.8'}
            </span>
          </div>
        </div>

        <h3 className="text-white font-medium mb-2 text-sm lg:text-base group-hover:text-luxury-gold transition-colors line-clamp-2 flex-1">
          {product.name}
        </h3>

        <div className="flex items-center space-x-2 mb-2">
          <span className="text-luxury-gold font-bold text-base lg:text-lg">
             {product.price?.toFixed(2)} DT
          </span>
          {product.original_price && product.original_price > product.price && (
            <span className="text-gray-400 line-through text-xs lg:text-sm">
              {product.original_price.toFixed(2)} DT
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
          <span className="capitalize">{product.gender}</span>
          <span>{product.product_type}</span>
        </div>
      </div>

      {/* Mobile-friendly Price Tag */}
      <div className="hidden lg:block absolute top-3 right-12 bg-luxury-gold text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg">
        {product.price?.toFixed(2)} DT
      </div>
    </motion.div>
  );
};

export default ProductCard;
