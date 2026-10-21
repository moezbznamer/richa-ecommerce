
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Offer {
  id: number;
  product_id: number;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  products?: {
    id: number;
    name: string;
    price: number;
    original_price?: number;
    image_url?: string;
    brand?: string;
    description?: string;
    rating?: number;
    reviews_count?: number;
  };
}

export const useOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      // Get products from produit table and transform them to offers format
      const { data: produitsData, error: produitsError } = await supabase
        .from('produit')
        .select('*')
        .gt('nombre_en_stock', 0)
        .limit(8);

      if (produitsError) throw produitsError;

      // Transform produits to offers format
      const transformedOffers = produitsData?.map(produit => ({
        id: produit.id_produit,
        product_id: produit.id_produit,
        discount_percentage: 20, // Default discount for display
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        products: {
          id: produit.id_produit,
          name: produit.nom || '',
          price: Number(produit.prix),
          brand: 'RRICHA',
          description: produit.description,
          rating: 4.5,
          reviews_count: 25
        }
      })) || [];

      setOffers(transformedOffers);
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return { offers, loading, error, refetch: fetchOffers };
};
