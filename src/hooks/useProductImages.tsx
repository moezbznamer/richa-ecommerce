import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductImage {
  id: number;
  id_produit: number;
  color: string;
  image_url: string;
}

export const useProductImages = (productId: number) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('images_produit')
          .select('*')
          .eq('id_produit', productId);

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error('Error fetching product images:', error);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchImages();
    }
  }, [productId]);

  const getImageByColor = (color: string) => {
    return images.find(img => img.color.toLowerCase() === color.toLowerCase());
  };

  const getFirstImage = () => {
    return images[0] || null;
  };

  return {
    images,
    loading,
    getImageByColor,
    getFirstImage
  };
};
