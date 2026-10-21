import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart, ChevronLeft, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MobileProductDetailProps {
  produit: {
    id_produit: number;
    nom: string;
    description?: string;
    prix: number;
    taille?: string;
    nombre_en_stock: number;
    type_produit: string;
    couleur_disponible?: string;
  };
  currentImage: string;
  productImages: Array<{ color: string; image_url: string }>;
  onAddToCart: () => Promise<void>;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  quantity: number;
  setQuantity: (qty: number) => void;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
  colorMap: Record<string, string>;
}

const MobileProductDetail = ({
  produit,
  currentImage,
  productImages,
  onAddToCart,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  quantity,
  setQuantity,
  isWishlisted,
  onWishlistToggle,
  colorMap
}: MobileProductDetailProps) => {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const availableSizes = produit.taille 
    ? produit.taille.split(/[\s,]+/).filter(Boolean).map((s: string) => s.trim()) 
    : [];
  
  const availableColors = produit.couleur_disponible 
    ? produit.couleur_disponible.split(/[\s,]+/).filter(Boolean).map((c: string) => c.trim()) 
    : [];

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart();
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Sticky Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/30"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/50"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </motion.button>
          
          <h1 className="text-sm font-semibold text-foreground truncate max-w-[200px]">
            Détails du produit
          </h1>
          
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onWishlistToggle}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
              isWishlisted 
                ? 'bg-red-500/10 text-red-500' 
                : 'bg-muted/50 text-muted-foreground'
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </motion.header>

      {/* Product Image */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-4"
      >
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted shadow-xl">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              src={currentImage}
              alt={produit.nom}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('placeholder.svg')) {
                  target.src = '/placeholder.svg';
                }
              }}
            />
          </AnimatePresence>
          
          {/* Image Dots Indicator */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {productImages.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeImageIndex 
                      ? 'w-6 bg-primary' 
                      : 'w-2 bg-background/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Product Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 mt-6"
      >
        <div className="bg-card rounded-3xl p-5 shadow-lg border border-border/30">
          {/* Rating & Brand */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.5)</span>
            </div>
            <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wide">
              RRICHA
            </span>
          </div>

          {/* Product Name */}
          <h2 className="text-xl font-bold text-foreground leading-tight mb-2">
            {produit.nom}
          </h2>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-black text-primary">
              {Number(produit.prix).toFixed(2)}
            </span>
            <span className="text-lg text-muted-foreground font-medium">DT</span>
          </div>

          {/* Description */}
          {produit.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              {produit.description}
            </p>
          )}

          {/* Color Selection */}
          {availableColors.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Couleur</span>
                <span className="text-xs text-muted-foreground capitalize">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color: string) => {
                  const colorValue = colorMap[color.toLowerCase()] || '#94A3B8';
                  const isSelected = selectedColor === color;
                  const isLight = ['blanc', 'white', 'beige', 'jaune', 'yellow'].includes(color.toLowerCase());
                  
                  return (
                    <motion.button
                      key={color}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-10 h-10 rounded-full transition-all ${
                        isSelected 
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                          : ''
                      } ${isLight ? 'border border-border' : ''}`}
                      style={{ backgroundColor: colorValue }}
                    >
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className={`w-2 h-2 rounded-full ${isLight ? 'bg-gray-900' : 'bg-white'}`} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {availableSizes.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Taille</span>
                <button className="text-xs text-primary font-medium">Guide des tailles</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size: string) => (
                  <motion.button
                    key={size}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[44px] h-11 px-4 rounded-xl font-semibold text-sm transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted text-foreground hover:bg-muted/80'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground">Quantité</span>
              <span className="text-xs text-muted-foreground">
                {produit.nombre_en_stock} en stock
              </span>
            </div>
            <div className="flex items-center">
              <div className="flex items-center bg-muted rounded-xl overflow-hidden">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted-foreground/10"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="w-12 text-center font-bold text-foreground">{quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.min(produit.nombre_en_stock, quantity + 1))}
                  className="w-11 h-11 flex items-center justify-center text-foreground hover:bg-muted-foreground/10"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Truck className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Livraison rapide</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Qualité garantie</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <RotateCcw className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">Retours faciles</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Fixed Bottom CTA */}
      <motion.div 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/30 px-4 py-4 safe-area-bottom"
      >
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyNow}
            disabled={produit.nombre_en_stock === 0}
            className="flex-1 h-14 rounded-2xl bg-muted text-foreground font-bold text-base transition-colors hover:bg-muted/80 disabled:opacity-50"
          >
            Acheter maintenant
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            disabled={produit.nombre_en_stock === 0 || isAddingToCart}
            className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-50"
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Ajouter
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileProductDetail;
