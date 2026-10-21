import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CartItem {
  id_panier: number;
  id_produit: number;
  nom: string;
  prix_unitaire: number;
  quantite: number;
  image_url?: string;
  size?: string;
  color?: string;
}

export const useCartDatabase = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Récupérer l'ID utilisateur de la table utilisateur
  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email) return;
      
      try {
        const { data, error } = await supabase
          .from('utilisateur')
          .select('id_utilisateur')
          .eq('email', user.email)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user ID:', error);
          return;
        }

        if (data) {
          setUserId(data.id_utilisateur);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserId();
  }, [user]);

  // Charger le panier depuis la base de données
  useEffect(() => {
    const loadCart = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('panier')
          .select(`
            id_panier,
            id_produit,
            quantite,
            prix_unitaire,
            size,
            color,
            produit!inner(nom, prix)
          `)
          .eq('id_utilisateur', userId)
          .eq('statut', 'actif');

        if (error) {
          console.error('Error loading cart:', error);
          if (error.code !== 'PGRST116') {
            throw error;
          }
        }

        // Get images for all products
        const productIds = data?.map(item => item.id_produit) || [];
        const { data: imagesData } = await supabase
          .from('images_produit')
          .select('id_produit, color, image_url')
          .in('id_produit', productIds);

        const formattedItems = data?.map((item: any) => {
          // Find image matching the cart item's color, or fallback to first image
          const productImages = imagesData?.filter(img => img.id_produit === item.id_produit) || [];
          const matchingImage = productImages.find(img => img.color === item.color);
          const fallbackImage = productImages[0];
          
          return {
            id_panier: item.id_panier,
            id_produit: item.id_produit,
            nom: item.produit?.nom || 'Produit inconnu',
            prix_unitaire: item.prix_unitaire || item.produit?.prix || 0,
            quantite: item.quantite,
            image_url: matchingImage?.image_url || fallbackImage?.image_url,
            size: item.size,
            color: item.color,
          };
        }) || [];

        setCartItems(formattedItems);
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Erreur lors du chargement du panier');
        setCartItems([]); // Set empty cart on error
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  const addToCart = async (
    productId: number,
    productName: string,
    price: number,
    quantity: number = 1,
    size?: string,
    color?: string,
    imageUrl?: string
  ) => {
    if (!userId) {
      toast.error('Vous devez être connecté pour ajouter au panier');
      return;
    }

    try {
      const existingItem = cartItems.find(
        item => item.id_produit === productId && 
        item.size === size && 
        item.color === color
      );

      if (existingItem) {
        const { error } = await supabase
          .from('panier')
          .update({ quantite: existingItem.quantite + quantity })
          .eq('id_panier', existingItem.id_panier);

        if (error) throw error;

        setCartItems(prev => prev.map(item => 
          item.id_panier === existingItem.id_panier
            ? { ...item, quantite: item.quantite + quantity }
            : item
        ));
      } else {
        const { data, error } = await supabase
          .from('panier')
          .insert({
            id_utilisateur: userId,
            id_produit: productId,
            quantite: quantity,
            prix_unitaire: price,
            size,
            color,
            statut: 'actif'
          })
          .select()
          .single();

        if (error) throw error;

        const newItem: CartItem = {
          id_panier: data.id_panier,
          id_produit: productId,
          nom: productName,
          prix_unitaire: price,
          quantite: quantity,
          image_url: imageUrl,
          size,
          color,
        };

        setCartItems(prev => [...prev, newItem]);
      }

      toast.success(`${productName} ajouté au panier`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const updateQuantity = async (cartId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    try {
      const { error } = await supabase
        .from('panier')
        .update({ quantite: quantity })
        .eq('id_panier', cartId);

      if (error) throw error;

      setCartItems(prev => prev.map(item => 
        item.id_panier === cartId ? { ...item, quantite: quantity } : item
      ));
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      const { error } = await supabase
        .from('panier')
        .delete()
        .eq('id_panier', cartId);

      if (error) throw error;

      const removedItem = cartItems.find(item => item.id_panier === cartId);
      setCartItems(prev => prev.filter(item => item.id_panier !== cartId));
      
      if (removedItem) {
        toast.success(`${removedItem.nom} retiré du panier`);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const clearCart = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('panier')
        .delete()
        .eq('id_utilisateur', userId)
        .eq('statut', 'actif');

      if (error) throw error;

      setCartItems([]);
      toast.success('Panier vidé');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Erreur lors du vidage du panier');
    }
  };


  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.prix_unitaire * item.quantite), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantite, 0);
  };

  const confirmOrder = async (adresseLivraison: string, numeroTelephone: string, selectedItems?: CartItem[]) => {
    const itemsToOrder = selectedItems || cartItems;
    
    if (!userId || itemsToOrder.length === 0) {
      toast.error('Aucun article sélectionné ou utilisateur non connecté');
      return null;
    }

    try {
      console.log('Creating order for user:', userId);
      console.log('Cart items:', cartItems);
      console.log('Delivery address:', adresseLivraison);
      console.log('Phone number:', numeroTelephone);

      // Calculer le total des articles sélectionnés
      const totalAmount = itemsToOrder.reduce((total, item) => total + (item.prix_unitaire * item.quantite), 0);

      // Créer la commande avec le total et le numéro de téléphone
      const { data: commande, error: commandeError } = await supabase
        .from('commande')
        .insert({
          id_utilisateur: userId,
          adresse_livraison: adresseLivraison,
          numero_telephone: numeroTelephone,
          methode_paiement: 'especes',
          statut: 'validee',
          total: totalAmount
        })
        .select()
        .single();

      if (commandeError) {
        console.error('Error creating order:', commandeError);
        throw commandeError;
      }

      console.log('Order created:', commande);

      // Créer les détails de commande avec validation
      const commandeDetails = itemsToOrder.map(item => ({
        id_commande: commande.id_commande,
        id_produit: item.id_produit,
        quantite: item.quantite,
        prix_unitaire: item.prix_unitaire,
        size: item.size || null,
        color: item.color || null
      }));

      console.log('Order details to insert:', commandeDetails);

      const { error: detailsError } = await supabase
        .from('commande_details')
        .insert(commandeDetails);

      if (detailsError) {
        console.error('Error creating order details:', detailsError);
        // Si les détails échouent, supprimer la commande créée
        await supabase
          .from('commande')
          .delete()
          .eq('id_commande', commande.id_commande);
        throw detailsError;
      }

      console.log('Order details created successfully');

      // Mettre à jour le stock des produits commandés
      for (const item of itemsToOrder) {
        // Récupérer le stock actuel
        const { data: produit, error: fetchError } = await supabase
          .from('produit')
          .select('nombre_en_stock')
          .eq('id_produit', item.id_produit)
          .single();

        if (fetchError) {
          console.error('Error fetching product stock:', fetchError);
          continue;
        }

        // Mettre à jour le stock
        const newStock = Math.max(0, (produit?.nombre_en_stock || 0) - item.quantite);
        const { error: stockError } = await supabase
          .from('produit')
          .update({ nombre_en_stock: newStock })
          .eq('id_produit', item.id_produit);

        if (stockError) {
          console.error('Error updating stock:', stockError);
          // Continue même si la mise à jour du stock échoue
        }
      }

      // Supprimer seulement les articles commandés du panier
      for (const item of itemsToOrder) {
        await supabase
          .from('panier')
          .delete()
          .eq('id_panier', item.id_panier);
      }
      
      // Mettre à jour l'état local
      setCartItems(prev => prev.filter(item => !itemsToOrder.some(ordered => ordered.id_panier === item.id_panier)));

      // Trigger level refresh for all components
      import('@/hooks/useUserLevels').then(({ triggerLevelRefresh }) => {
        triggerLevelRefresh();
      });

      toast.success('Commande confirmée avec succès !');
      return commande.id_commande;
    } catch (error) {
      console.error('Error confirming order:', error);
      toast.error('Erreur lors de la confirmation de commande');
      return null;
    }
  };

  return {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    confirmOrder,
    userId
  };
};
