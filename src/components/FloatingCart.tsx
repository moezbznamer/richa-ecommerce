
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartDatabase } from '@/hooks/useCartDatabase';
import { getProductImageUrl } from '@/utils/imageUtils';

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } = useCartDatabase();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Floating Cart Button */}
      <motion.div
        className="floating-cart"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
      >
        <ShoppingCart size={24} />
        {totalItems > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold"
          >
            {totalItems}
          </motion.span>
        )}
      </motion.div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Cart Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-md h-full bg-luxury-black border-l border-luxury-gold/30 z-51 overflow-hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-luxury-gold/20">
                  <h2 className="text-2xl font-oswald font-bold text-luxury-gold">
                    PANIER
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:text-luxury-gold transition-colors p-2"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400">Votre panier est vide</p>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="btn-luxury mt-4"
                      >
                        CONTINUER LES ACHATS
                      </button>
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <motion.div
                        key={item.id_panier}
                        layout
                        className="bg-luxury-card rounded-lg p-4 border border-luxury-gold/20"
                      >
                        <div className="flex items-start space-x-4">
                          <img
                            src={getProductImageUrl(item.image_url)}
                            alt={item.nom}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-sm mb-1">
                              {item.nom}
                            </h3>
                            <div className="text-gray-400 text-xs mb-2 space-y-1">
                              {item.size && <p>Taille: {item.size}</p>}
                              {item.color && <p>Couleur: {item.color}</p>}
                            </div>
                            <p className="text-luxury-gold font-bold">
                              {item.prix_unitaire.toFixed(2)} DT
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id_panier)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateQuantity(item.id_panier, item.quantite - 1)}
                              className="w-8 h-8 rounded-full border border-luxury-gold/50 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/20 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-white font-semibold w-8 text-center">
                              {item.quantite}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id_panier, item.quantite + 1)}
                              className="w-8 h-8 rounded-full border border-luxury-gold/50 flex items-center justify-center text-luxury-gold hover:bg-luxury-gold/20 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="text-luxury-gold font-bold">
                            {(item.prix_unitaire * item.quantite).toFixed(2)} DT
                          </p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                  <div className="border-t border-luxury-gold/20 p-6 space-y-4">
                    <div className="flex items-center justify-between text-lg">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-luxury-gold font-bold text-xl">
                        {totalPrice.toFixed(2)} DT
                      </span>
                    </div>
                    <Link to="/cart" onClick={() => setIsOpen(false)}>
                      <button className="btn-luxury w-full text-center">
                        VOIR LE PANIER
                      </button>
                    </Link>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="btn-luxury-outline w-full text-center"
                    >
                      CONTINUER LES ACHATS
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingCart;
