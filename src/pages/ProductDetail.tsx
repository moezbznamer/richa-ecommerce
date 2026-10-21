
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/hooks/useProducts';
import { useCartDatabase } from '@/hooks/useCartDatabase';
import { useProductImages } from '@/hooks/useProductImages';
import { getProductImageUrl } from '@/utils/imageUtils';
import BackToHomeButton from '@/components/BackToHomeButton';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProductById } = useProducts();
  const { addToCart } = useCartDatabase();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>('/placeholder.svg');

  const { images: productImages, getImageByColor, getFirstImage } = useProductImages(
    product?.id || 0
  );

  useEffect(() => {
    if (id) {
      fetchProductById(parseInt(id))
        .then((productData) => {
          setProduct(productData);
          // Set default selections if available
          if (productData.size) {
            const sizes = productData.size.split(/[\s,]+/).filter(Boolean);
            if (sizes.length > 0) {
              setSelectedSize(sizes[0]);
            }
          }
          if (productData.color) {
            const colors = productData.color.split(/[\s,]+/).filter(Boolean);
            if (colors.length > 0) {
              setSelectedColor(colors[0]);
            }
          }
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
          toast.error('Produit non trouvé');
        })
        .finally(() => setLoading(false));
    }
  }, [id, fetchProductById]);

  // Update image when color changes
  useEffect(() => {
    if (selectedColor && productImages.length > 0) {
      const imageForColor = getImageByColor(selectedColor);
      if (imageForColor) {
        setCurrentImage(getProductImageUrl(imageForColor.image_url));
      } else {
        const firstImg = getFirstImage();
        setCurrentImage(firstImg ? getProductImageUrl(firstImg.image_url) : '/placeholder.svg');
      }
    } else if (productImages.length > 0) {
      const firstImg = getFirstImage();
      setCurrentImage(firstImg ? getProductImageUrl(firstImg.image_url) : '/placeholder.svg');
    }
  }, [selectedColor, productImages, getImageByColor, getFirstImage]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart(
        product.id,
        product.name,
        product.price,
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
    toast.success(isWishlisted ? 'Retiré de la liste de souhaits' : 'Ajouté à la liste de souhaits');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
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
  const availableSizes = product.size ? 
    product.size.split(/[\s,]+/).filter(Boolean).map((s: string) => s.trim()) : 
    [];
  
  const availableColors = product.color ? 
    product.color.split(/[\s,]+/).filter(Boolean).map((c: string) => c.trim()) : 
    [];

  return (
    <div className="min-h-screen bg-background">
      <BackToHomeButton />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover"
              />
              {product.discount_percentage > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold">
                  -{product.discount_percentage}% OFF
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Brand and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                {product.brand || 'RRICHA'}
              </span>
              <div className="flex items-center space-x-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-foreground font-medium">
                  {product.rating?.toFixed(1) || '4.5'}
                </span>
                <span className="text-muted-foreground">
                  ({product.reviews_count || 0} avis)
                </span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground font-playfair">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-primary">
                {product.price} DT
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  {product.original_price} DT
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description || 'Aucune description disponible.'}
            </p>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-card rounded-lg">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="text-foreground ml-2 capitalize">{product.product_type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Stock:</span>
                <span className="text-foreground ml-2">{product.stock_quantity} disponible(s)</span>
              </div>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-foreground font-semibold">Taille</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-foreground font-semibold">Couleur</h3>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color: string) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-200 capitalize ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border text-foreground hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="text-foreground font-semibold">Quantité</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-foreground font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity || 99, quantity + 1))}
                    className="p-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="btn-luxury flex-1 h-12 text-lg font-semibold"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ajouter au panier
              </Button>
              <Button
                onClick={handleWishlist}
                variant="outline"
                className={`h-12 px-6 border-2 transition-all duration-200 ${
                  isWishlisted
                    ? 'border-red-500 bg-red-500 text-white'
                    : 'border-primary text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
