import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { useProductImages } from '@/hooks/useProductImages';
import { getProductImageUrl } from '@/utils/imageUtils';

interface ProductImageGalleryProps {
  productId: number;
  productName: string;
}

const ProductImageGallery = ({ productId, productName }: ProductImageGalleryProps) => {
  const { images } = useProductImages(productId);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageUrls = images.map(img => getProductImageUrl(img.image_url));

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  if (imageUrls.length === 0) {
    return (
      <div className="w-full h-96 bg-card rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative overflow-hidden rounded-2xl bg-card">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentImage}
            src={imageUrls[currentImage]}
            alt={`${productName} - Image ${currentImage + 1}`}
            className="w-full h-96 lg:h-[600px] object-cover cursor-zoom-in"
            onClick={() => setIsZoomed(!isZoomed)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </>
        )}

        {/* Zoom Icon */}
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
        >
          <ZoomIn className="w-5 h-5 text-foreground" />
        </button>

        {/* Image Counter */}
        {imageUrls.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-foreground">
            {currentImage + 1} / {imageUrls.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {imageUrls.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                currentImage === index
                  ? 'border-primary scale-105'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img
                src={url}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoomed Image Modal */}
      {isZoomed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={imageUrls[currentImage]}
            alt={`${productName} - Zoomed`}
            className="max-w-full max-h-full object-contain"
          />
        </motion.div>
      )}
    </div>
  );
};

export default ProductImageGallery;
