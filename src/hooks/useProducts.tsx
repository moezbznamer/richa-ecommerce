
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FilterOptions } from '@/components/SearchAndFilter';

interface Product {
  id: number;
  name: string;
  price: number;
  original_price?: number;
  discount_percentage?: number;
  image_url?: string;
  rating?: number;
  reviews_count?: number;
  brand?: string;
  gender?: string;
  product_type?: string;
  description?: string;
  color?: string;
  size?: string;
  stock_quantity?: number;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (searchQuery = '', filters: FilterOptions | null = null) => {
    try {
      setLoading(true);
      let query = supabase.from('produit').select('*');

      // Apply search
      if (searchQuery) {
        query = query.or(`nom.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Apply filters
      if (filters) {
        if (filters.gender) {
          query = query.eq('type_produit', filters.gender);
        }
        if (filters.minPrice > 0) {
          query = query.gte('prix', filters.minPrice);
        }
        if (filters.maxPrice < 1000) {
          query = query.lte('prix', filters.maxPrice);
        }
        if (filters.size) {
          query = query.eq('taille', filters.size);
        }
        if (filters.color) {
          query = query.ilike('couleur_disponible', `%${filters.color}%`);
        }
      }

      const { data, error } = await query.order('id_produit', { ascending: false });

      if (error) throw error;

      // Transform produit data to Product format
      const transformedProducts = data?.map(produit => ({
        id: produit.id_produit,
        name: produit.nom || '',
        price: Number(produit.prix),
        brand: 'RRICHA',
        gender: produit.type_produit,
        product_type: produit.type_produit,
        description: produit.description,
        color: produit.couleur_disponible,
        size: produit.taille,
        stock_quantity: produit.nombre_en_stock,
        rating: 4.5,
        reviews_count: 25
      })) || [];

      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('produit')
        .select('*')
        .eq('id_produit', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Produit non trouvé');
        }
        throw error;
      }
      
      if (!data) {
        throw new Error('Produit non trouvé');
      }
      
      // Transform to Product format
      return {
        id: data.id_produit,
        name: data.nom || '',
        price: Number(data.prix),
        brand: 'RRICHA',
        gender: data.type_produit,
        product_type: data.type_produit,
        description: data.description,
        color: data.couleur_disponible,
        size: data.taille,
        stock_quantity: data.nombre_en_stock,
        rating: 4.5,
        reviews_count: 25
      };
    } catch (err) {
      console.error('Error fetching product:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    fetchProductById,
  };
};
