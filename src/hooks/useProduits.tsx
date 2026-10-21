
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Produit {
  id_produit: number;
  nom: string;
  description?: string;
  prix: number;
  taille?: string;
  nombre_en_stock: number;
  type_produit: 'man' | 'woman' | 'girl' | 'boy' | 'otaku';
  couleur_disponible?: string;
  created_at?: string;
  updated_at?: string;
}

export const useProduits = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduits = useCallback(async (categorie?: string, searchQuery = '') => {
    try {
      setLoading(true);
      let query = supabase.from('produit').select('*');

      // Apply category filter
      if (categorie) {
        query = query.eq('type_produit', categorie);
      }

      // Only show products in stock
      query = query.gt('nombre_en_stock', 0);

      // Apply search filter if provided
      if (searchQuery) {
        query = query.or(`nom.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data: produitsData, error: queryError } = await query.order('id_produit', { ascending: false });

      if (queryError) throw queryError;

      // Type assertion to ensure proper typing
      const typedProduits = (produitsData || []).map((produit) => ({
        ...produit,
        nom: produit.nom || '',
        prix: Number(produit.prix) || 0,
        type_produit: produit.type_produit as 'man' | 'woman' | 'girl' | 'boy' | 'otaku',
      }));

      setProduits(typedProduits);
      setError(null);
    } catch (err) {
      console.error('Error fetching produits:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch produits');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProduitById = useCallback(async (id: number) => {
    try {
      const { data: produit, error: queryError } = await supabase
        .from('produit')
        .select('*')
        .eq('id_produit', id)
        .single();

      if (queryError) {
        if (queryError.code === 'PGRST116') {
          throw new Error('Produit non trouvé');
        }
        throw queryError;
      }

      if (!produit) {
        throw new Error('Produit non trouvé');
      }

      return {
        ...produit,
        nom: produit.nom || '',
        prix: Number(produit.prix) || 0,
        type_produit: produit.type_produit as 'man' | 'woman' | 'girl' | 'boy' | 'otaku',
      };
    } catch (err) {
      console.error('Error fetching produit:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProduits();
  }, [fetchProduits]);

  return {
    produits,
    loading,
    error,
    fetchProduits,
    fetchProduitById,
  };
};
