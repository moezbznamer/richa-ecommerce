import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProduits } from '@/hooks/useProduits';
import { useCartDatabase } from '@/hooks/useCartDatabase';
import { useProductImages } from '@/hooks/useProductImages';
import { getProductImageUrl } from '@/utils/imageUtils';
import BackToHomeButton from '@/components/BackToHomeButton';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileProductDetail from '@/components/mobile/MobileProductDetail';

const ProduitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProduitById } = useProduits();
  const { addToCart } = useCartDatabase();
  const isMobile = useIsMobile();
  
  const [produit, setProduit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('/placeholder.svg');
  
  const { images: productImages, getImageByColor, getFirstImage } = useProductImages(
    produit?.id_produit || 0
  );

  // Color mapping for circular buttons
  const colorMap: Record<string, string> = {
    'rouge': '#DC2626',
    'red': '#DC2626',
    'bleu': '#2563EB',
    'blue': '#2563EB',
    'noir': '#0F172A',
    'black': '#0F172A',
    'blanc': '#F8FAFC',
    'white': '#F8FAFC',
    'vert': '#16A34A',
    'green': '#16A34A',
    'jaune': '#EAB308',
    'yellow': '#EAB308',
    'rose': '#EC4899',
    'pink': '#EC4899',
    'gris': '#64748B',
    'gray': '#64748B',
    'grey': '#64748B',
    'marron': '#92400E',
    'brown': '#92400E',
    'beige': '#D4B896',
    'orange': '#EA580C',
  };

  useEffect(() => {
    if (id) {
      fetchProduitById(parseInt(id))
        .then((produitData) => {
          setProduit(produitData);
          // Set default selections if available
          if (produitData.taille) {
            const sizes = produitData.taille.split(/[\s,]+/).filter(Boolean);
            if (sizes.length > 0) {
              setSelectedSize(sizes[0]);
            }
          }
          if (produitData.couleur_disponible) {
            const colors = produitData.couleur_disponible.split(/[\s,]+/).filter(Boolean);
            if (colors.length > 0) {
              setSelectedColor(colors[0]);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching produit:', error);
          toast.error('Produit non trouvé');
        })
        .finally(() => setLoading(false));
    }
    // Important: only refetch/reset defaults when the URL product id changes
  }, [id]);

  // Handle image updates - only when color changes OR initial load
  useEffect(() => {
    if (productImages.length === 0) return;
    
    // If a color is selected, find matching image
    if (selectedColor) {
      const imageForColor = productImages.find(img => 
        img.color.toLowerCase() === selectedColor.toLowerCase()
      );
      
      if (imageForColor) {
        setCurrentImage(getProductImageUrl(imageForColor.image_url));
        return;
      }
    }
    
    // Only set initial image if we still have placeholder
    if (currentImage === '/placeholder.svg') {
      const firstImg = productImages[0];
      setCurrentImage(getProductImageUrl(firstImg.image_url));
    }
  }, [selectedColor, productImages]);

  const handleAddToCart = async () => {
    if (!produit) return;
    
    try {
      await addToCart(
        produit.id_produit,
        produit.nom,
        Number(produit.prix),
        quantity,
        selectedSize || undefined,
        selectedColor || undefined,
        currentImage
      );
      toast.success('Produit ajouté au panier !');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Retiré des favoris' : 'Ajouté aux favoris');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-foreground mb-4">Produit non trouvé</h2>
          <Button onClick={() => navigate('/')} className="btn-luxury">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  // Get available sizes and colors from product
  const availableSizes = produit.taille ? 
    produit.taille.split(/[\s,]+/).filter(Boolean).map((s: string) => s.trim()) : 
    [];
  
  const availableColors = produit.couleur_disponible ? 
    produit.couleur_disponible.split(/[\s,]+/).filter(Boolean).map((c: string) => c.trim()) : 
    [];

  // Mobile Layout
  if (isMobile) {
    return (
      <MobileProductDetail
        produit={produit}
        currentImage={currentImage}
        productImages={productImages}
        onAddToCart={handleAddToCart}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        quantity={quantity}
        setQuantity={setQuantity}
        isWishlisted={isWishlisted}
        onWishlistToggle={handleWishlist}
        colorMap={colorMap}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="group text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 max-w-7xl mx-auto">
          {/* Product Image Section with Modern Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6 lg:sticky lg:top-24 lg:h-fit"
          >
            {/* Main Image with Floating Effect */}
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/10 rounded-[2rem] blur-3xl group-hover:bg-primary/20 transition-all duration-500"></div>
              <div className="relative overflow-hidden rounded-[2rem] bg-card shadow-2xl border border-border/50">
                <motion.img
                  key={selectedColor}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  src={currentImage}
                  alt={produit.nom}
                  className="w-full aspect-square object-cover cursor-zoom-in"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('placeholder.svg')) {
                      target.src = '/placeholder.svg';
                    }
                  }}
                />
                
                {/* Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Wishlist Button - Modern Floating Design */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleWishlist}
                  className={`absolute top-6 right-6 p-4 rounded-2xl backdrop-blur-xl transition-all duration-300 shadow-lg ${
                    isWishlisted
                      ? 'bg-red-500 text-white shadow-red-500/50'
                      : 'bg-background/90 text-foreground hover:bg-background hover:shadow-xl'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </motion.button>
              </div>
            </div>

            {/* Color Selection - Modern Pills Design */}
            {availableColors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl p-6 shadow-lg border border-border/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                    Couleur
                  </h3>
                  <span className="text-sm text-primary font-semibold capitalize px-3 py-1 bg-primary/10 rounded-full">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color: string) => {
                    const colorValue = colorMap[color.toLowerCase()] || '#94A3B8';
                    const isSelected = selectedColor === color;
                    
                    return (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.15, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedColor(color)}
                        className={`relative w-14 h-14 rounded-2xl transition-all duration-300 shadow-md hover:shadow-xl ${
                          isSelected ? 'ring-4 ring-primary ring-offset-4 ring-offset-background scale-110' : ''
                        }`}
                        style={{ backgroundColor: colorValue }}
                      >
                        {(color.toLowerCase() === 'blanc' || color.toLowerCase() === 'white' || color.toLowerCase() === 'beige') && (
                          <span className="absolute inset-0 rounded-2xl border-2 border-border/30"></span>
                        )}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className={`w-3 h-3 rounded-full shadow-lg ${
                              ['blanc', 'white', 'beige', 'jaune', 'yellow'].includes(color.toLowerCase()) 
                                ? 'bg-gray-900' 
                                : 'bg-white'
                            }`}></div>
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Product Info Section - Modern Layout */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col space-y-8"
          >
            {/* Brand & Rating */}
            <div className="flex items-center justify-between">
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full"
              >
                RRICHA
              </motion.span>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-yellow-500/10 rounded-full"
              >
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                <span className="font-bold text-foreground">4.8</span>
                <span className="text-muted-foreground text-sm">(25)</span>
              </motion.div>
            </div>

            {/* Product Name with Gradient */}
            <div>
              <h1 className="text-5xl lg:text-6xl font-black text-foreground leading-tight tracking-tight">
                {produit.nom}
              </h1>
            </div>

            {/* Price with Badge */}
            <div className="inline-flex items-baseline space-x-3 w-fit">
              <span className="text-5xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {Number(produit.prix).toFixed(2)}
              </span>
              <span className="text-3xl text-muted-foreground font-bold">DT</span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {produit.description || 'Un vêtement élégant et confortable pour toutes les occasions.'}
            </p>

            {/* Size Selection - Modern Cards */}
            {availableSizes.length > 0 && (
              <div className="space-y-4 p-6 bg-card rounded-2xl border border-border/50 shadow-lg">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Sélectionner la taille
                </h3>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size: string) => (
                    <motion.button
                      key={size}
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[3.5rem] px-5 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-xl ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground scale-105'
                          : 'bg-background text-foreground hover:bg-muted border-2 border-border'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector - Modern Design */}
            <div className="space-y-4 p-6 bg-card rounded-2xl border border-border/50 shadow-lg">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Quantité
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-background border-2 border-border rounded-2xl overflow-hidden shadow-md">
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--muted))" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 text-foreground transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </motion.button>
                  <span className="px-8 py-4 text-foreground font-black text-xl min-w-[4rem] text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "hsl(var(--muted))" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.min(produit.nombre_en_stock, quantity + 1))}
                    className="p-4 text-foreground transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground block">Stock disponible</span>
                  <span className="text-lg font-bold text-foreground">{produit.nombre_en_stock}</span>
                </div>
              </div>
            </div>

            {/* Add to Cart Button - Premium Design */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl"></div>
              <Button
                onClick={handleAddToCart}
                disabled={produit.nombre_en_stock === 0}
                className="relative w-full h-16 text-lg font-black rounded-2xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all duration-300"
                size="lg"
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                {produit.nombre_en_stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
              </Button>
            </motion.div>

            {/* Product Details - Modern Grid */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-card rounded-2xl border border-border/50 shadow-lg"
              >
                <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Type</span>
                <p className="text-base font-bold text-foreground capitalize">{produit.type_produit}</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 bg-card rounded-2xl border border-border/50 shadow-lg"
              >
                <span className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Disponibilité</span>
                <p className={`text-base font-bold ${produit.nombre_en_stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {produit.nombre_en_stock > 0 ? 'En stock' : 'Épuisé'}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProduitDetail;
