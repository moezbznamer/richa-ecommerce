
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';

const ProductShowcase = () => {
  const products = [
    {
      id: 1,
      name: 'Premium Black Hoodie',
      price: 299,
      originalPrice: 399,
      rating: 4.9,
      reviews: 127,
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
      category: 'Streetwear',
      isNew: true,
      discount: 25
    },
    {
      id: 2,
      name: 'Luxury Designer Jacket',
      price: 599,
      originalPrice: 799,
      rating: 4.8,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
      category: 'Outerwear',
      isNew: false,
      discount: 25
    },
    {
      id: 3,
      name: 'Gold Chain Necklace',
      price: 199,
      originalPrice: 299,
      rating: 5.0,
      reviews: 203,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=500&fit=crop',
      category: 'Accessories',
      isNew: true,
      discount: 33
    },
    {
      id: 4,
      name: 'Premium Denim Jeans',
      price: 149,
      originalPrice: 199,
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop',
      category: 'Denim',
      isNew: false,
      discount: 25
    }
  ];

  return (
    <section className="py-20 bg-luxury-gradient">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-oswald font-bold text-white mb-4">
            <span className="text-luxury-gold">FEATURED</span> COLLECTION
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of premium streetwear and luxury accessories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="luxury-card group"
            >
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-luxury-gold text-black p-3 rounded-full hover:bg-gold-dark transition-colors"
                  >
                    <Eye size={20} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-luxury-gold text-black p-3 rounded-full hover:bg-gold-dark transition-colors"
                  >
                    <ShoppingCart size={20} />
                  </motion.button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 space-y-2">
                  {product.isNew && (
                    <span className="bg-luxury-gold text-black px-3 py-1 rounded-full text-sm font-bold">
                      NEW
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold block">
                      -{product.discount}%
                    </span>
                  )}
                </div>

                {/* Wishlist */}
                <button className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-luxury-gold hover:text-black transition-colors">
                  <Heart size={18} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-luxury-gold text-sm font-semibold uppercase tracking-wide">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-luxury-gold text-luxury-gold" />
                    <span className="text-white text-sm font-medium">{product.rating}</span>
                    <span className="text-gray-400 text-sm">({product.reviews})</span>
                  </div>
                </div>

                <h3 className="text-white text-lg font-semibold mb-3 group-hover:text-luxury-gold transition-colors">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-luxury-gold text-xl font-bold">
                      ${product.price}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-gray-400 text-sm line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-luxury-gold text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-gold-dark transition-colors"
                  >
                    ADD TO CART
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="btn-luxury-outline text-lg">
            VIEW ALL PRODUCTS
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductShowcase;
