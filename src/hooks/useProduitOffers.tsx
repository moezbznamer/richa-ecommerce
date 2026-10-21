
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProduitOffer {
  id_offer: number;
  id_produit: number;
  image_url?: string;
  taille?: string;
  date_debut: string;
  date_fin: string;
  nombre_disponible: number;
  discount_percentage?: number;
  produit?: {
    id_produit: number;
    nom: string;
    prix: number;
    taille?: string;
    nombre_en_stock: number;
    type_produit: 'man' | 'woman' | 'girl' | 'boy' | 'otaku';
    couleur_disponible?: string;
  };
}

export const useProduitOffers = () => {
  const [offers, setOffers] = useState<ProduitOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('produit_offer')
        .select(`
          *,
          produit:id_produit (
            id_produit,
            nom,
            prix,
            taille,
            nombre_en_stock,
            type_produit,
            couleur_disponible
          )
        `)
        .lte('date_debut', today)
        .gte('date_fin', today)
        .gt('nombre_disponible', 0)
        .order('discount_percentage', { ascending: false });

      if (error) throw error;

      // Type assertion for the joined data
      const typedOffers = (data || []).map(offer => ({
        ...offer,
        produit: offer.produit ? {
          ...offer.produit,
          type_produit: offer.produit.type_produit as 'man' | 'woman' | 'girl' | 'boy' | 'otaku'
        } : undefined
      }));

      setOffers(typedOffers);
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
