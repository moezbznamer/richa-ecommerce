
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Package, MapPin, CheckCircle2, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { useCartDatabase } from '@/hooks/useCartDatabase';
import { getProductImageUrl } from '@/utils/imageUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const Cart = () => {
  const { cartItems, loading, updateQuantity, removeFromCart, confirmOrder } = useCartDatabase();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [orderForm, setOrderForm] = useState({
    adresse: '',
    telephone: ''
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Calculer le total et les articles sélectionnés
  const getSelectedTotalPrice = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id_panier))
      .reduce((total, item) => total + (item.prix_unitaire * item.quantite), 0);
  };

  const getSelectedTotalItems = () => {
    return cartItems
      .filter(item => selectedItems.has(item.id_panier))
      .reduce((total, item) => total + item.quantite, 0);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(cartItems.map(item => item.id_panier)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: number, checked: boolean) => {
    const newSelectedItems = new Set(selectedItems);
    if (checked) {
      newSelectedItems.add(itemId);
    } else {
      newSelectedItems.delete(itemId);
    }
    setSelectedItems(newSelectedItems);
  };

  if (!user) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Package className="w-16 h-16 sm:w-24 sm:h-24 text-primary mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-oswald font-bold text-foreground mb-4">
              Connexion requise
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm sm:text-base">
              Vous devez être connecté pour accéder à votre panier.
            </p>
            <Link to="/login" className="btn-luxury inline-flex items-center space-x-2 text-sm sm:text-base">
              <span>Se connecter</span>
            </Link>
          </motion.div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 sm:h-32 sm:w-32 border-b-2 border-primary mx-auto"></div>
            <p className="text-foreground mt-4 text-sm sm:text-base">Chargement du panier...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-background flex items-center justify-center px-4 pt-20">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-primary mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-oswald font-bold text-foreground mb-4">
              Votre panier est vide
            </h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm sm:text-base">
              Découvrez notre collection RRICHA et trouvez les pièces parfaites pour votre style.
            </p>
            <Link to="/" className="btn-luxury inline-flex items-center space-x-2 text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Continuer les achats</span>
            </Link>
          </motion.div>
        </div>
      </ResponsiveLayout>
    );
  }

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.adresse.trim() || !orderForm.telephone.trim() || selectedItems.size === 0) {
      if (selectedItems.size === 0) {
        toast.error('Veuillez sélectionner au moins un article');
      } else if (!orderForm.telephone.trim()) {
        toast.error('Veuillez entrer votre numéro de téléphone');
      }
      return;
    }

    setIsConfirming(true);
    const selectedCartItems = cartItems.filter(item => selectedItems.has(item.id_panier));
    const orderId = await confirmOrder(orderForm.adresse, orderForm.telephone, selectedCartItems);
    
    if (orderId) {
      // Retirer les articles sélectionnés de la sélection après confirmation
      setSelectedItems(new Set());
      navigate('/profile', { 
        state: { 
          message: `Commande #${orderId} confirmée avec succès !` 
        }
      });
    }
    setIsConfirming(false);
  };

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-background pt-16 sm:pt-20 pb-24 sm:pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            className="mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl font-oswald font-bold text-foreground mb-2">
              Mon <span className="text-primary">Panier</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              {cartItems.reduce((total, item) => total + item.quantite, 0)} article{cartItems.reduce((total, item) => total + item.quantite, 0) > 1 ? 's' : ''} dans votre panier
              {selectedItems.size > 0 && (
                <span className="text-primary ml-2">
                  ({getSelectedTotalItems()} sélectionné{getSelectedTotalItems() > 1 ? 's' : ''})
                </span>
              )}
            </p>
          </motion.div>

          {/* Mobile-First Layout */}
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Mobile Optimized */}
            <div className="lg:col-span-2">
              <motion.div
                className="luxury-card p-4 sm:p-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-oswald font-bold text-white flex items-center">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Articles
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="select-all"
                      checked={selectedItems.size === cartItems.length && cartItems.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-primary data-[state=checked]:bg-primary"
                    />
                    <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer">
                      Tout sélectionner
                    </label>
                  </div>
                </div>
                
                {/* Mobile Card Layout */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id_panier} className={`bg-gray-900/50 rounded-lg p-4 border transition-all duration-200 ${
                      selectedItems.has(item.id_panier) 
                        ? 'border-primary shadow-lg shadow-primary/20' 
                        : 'border-luxury-gold/20'
                    }`}>
                      <div className="flex items-start space-x-4">
                        {/* Selection Checkbox */}
                        <div className="flex-shrink-0 pt-2">
                          <Checkbox
                            checked={selectedItems.has(item.id_panier)}
                            onCheckedChange={(checked) => handleSelectItem(item.id_panier, checked as boolean)}
                            className="border-primary data-[state=checked]:bg-primary"
                          />
                        </div>
                        
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={getProductImageUrl(item.image_url)}
                            alt={item.nom}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold text-sm sm:text-base mb-1 truncate">
                            {item.nom}
                          </h3>
                          <div className="text-xs sm:text-sm text-gray-400 mb-2 space-y-1">
                            {item.size && <p>Taille: {item.size}</p>}
                            {item.color && <p>Couleur: {item.color}</p>}
                          </div>
                          <p className="text-luxury-gold font-bold text-sm sm:text-base">
                            {item.prix_unitaire.toFixed(2)} DT
                          </p>
                        </div>
                        
                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id_panier)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 min-w-[44px] min-h-[44px]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {/* Quantity Controls - Mobile Optimized */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id_panier, item.quantite - 1)}
                            className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black min-w-[44px] min-h-[44px] p-2"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-white font-semibold text-lg min-w-[2rem] text-center">
                            {item.quantite}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id_panier, item.quantite + 1)}
                            className="border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-black min-w-[44px] min-h-[44px] p-2"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-luxury-gold font-bold text-base sm:text-lg">
                          {(item.prix_unitaire * item.quantite).toFixed(2)} DT
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Order Summary & Confirmation - Mobile Optimized */}
            <div className="lg:col-span-1">
              <motion.div
                className="luxury-card p-4 sm:p-6 lg:sticky lg:top-24"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xl sm:text-2xl font-oswald font-bold text-white mb-4 sm:mb-6">
                  Résumé
                </h2>
                
                {/* Summary */}
                 <div className="space-y-3 sm:space-y-4 mb-6 pb-6 border-b border-gray-700">
                   {selectedItems.size > 0 ? (
                     <>
                       <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                         <span>Sous-total ({getSelectedTotalItems()} articles sélectionnés)</span>
                         <span>{getSelectedTotalPrice().toFixed(2)} DT</span>
                       </div>
                       <div className="flex justify-between text-gray-300 text-sm sm:text-base">
                         <span>Livraison</span>
                         <span>Gratuite</span>
                       </div>
                       <div className="flex justify-between text-white font-bold text-lg sm:text-xl">
                         <span>Total</span>
                         <span className="text-luxury-gold">{getSelectedTotalPrice().toFixed(2)} DT</span>
                       </div>
                     </>
                   ) : (
                     <div className="text-center py-4">
                       <CheckCircle2 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                       <p className="text-muted-foreground text-sm">
                         Sélectionnez des articles pour voir le total
                       </p>
                     </div>
                   )}
                 </div>

                {/* Order Form */}
                <form onSubmit={handleConfirmOrder} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 text-sm sm:text-base flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Adresse de livraison *
                    </label>
                    <textarea
                      value={orderForm.adresse}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, adresse: e.target.value }))}
                      placeholder="Entrez votre adresse complète..."
                      required
                      className="luxury-search w-full h-20 resize-none text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 text-sm sm:text-base flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Numéro de téléphone *
                    </label>
                    <Input
                      type="tel"
                      value={orderForm.telephone}
                      onChange={(e) => setOrderForm(prev => ({ ...prev, telephone: e.target.value }))}
                      placeholder="Entrez votre numéro de téléphone..."
                      required
                      className="luxury-search w-full text-sm sm:text-base"
                    />
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isConfirming || !orderForm.adresse.trim() || !orderForm.telephone.trim() || selectedItems.size === 0}
                      className="btn-luxury w-full min-h-[48px] text-sm sm:text-base"
                    >
                      {isConfirming ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border-2 border-black border-t-transparent rounded-full" />
                          <span>Confirmation...</span>
                        </div>
                      ) : (
                        'Confirmer la commande'
                      )}
                    </Button>
                    
                    <div className="space-y-2">
                      <Link
                        to="/"
                        className="btn-luxury-outline w-full text-center inline-block min-h-[48px] flex items-center justify-center text-sm sm:text-base"
                      >
                        Continuer les achats
                      </Link>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Checkout Button */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-luxury-black border-t border-luxury-gold/30 p-4 z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">
            {selectedItems.size > 0 ? 'Total sélectionné:' : 'Sélectionnez des articles'}
          </span>
          <span className="text-luxury-gold font-bold text-xl">
            {selectedItems.size > 0 ? `${getSelectedTotalPrice().toFixed(2)} DT` : '0.00 DT'}
          </span>
        </div>
        <Button
          onClick={() => document.getElementById('order-form')?.scrollIntoView({ behavior: 'smooth' })}
          className="btn-luxury w-full min-h-[48px]"
        >
          Finaliser la commande
        </Button>
      </div>
    </ResponsiveLayout>
  );
};

export default Cart;
