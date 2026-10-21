import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderDetail {
  id_produit: number;
  quantite: number;
  prix_unitaire: number;
  size?: string;
  color?: string;
  product_name?: string;
}

interface Order {
  id_commande: number;
  date_commande: string;
  statut: string;
  total: number;
  adresse_livraison?: string;
  methode_paiement?: string;
  details: OrderDetail[];
}

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  // Get user ID from utilisateur table
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

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Fetch orders with their details and product information
        const { data: ordersData, error: ordersError } = await supabase
          .from('commande')
          .select(`
            id_commande,
            date_commande,
            statut,
            total,
            adresse_livraison,
            methode_paiement
          `)
          .eq('id_utilisateur', userId)
          .order('date_commande', { ascending: false });

        if (ordersError) throw ordersError;

        if (!ordersData || ordersData.length === 0) {
          setOrders([]);
          return;
        }

        // Fetch order details for each order
        const ordersWithDetails: Order[] = await Promise.all(
          ordersData.map(async (order) => {
            const { data: detailsData, error: detailsError } = await supabase
              .from('commande_details')
              .select(`
                id_produit,
                quantite,
                prix_unitaire,
                size,
                color,
                produit!inner(nom)
              `)
              .eq('id_commande', order.id_commande);

            if (detailsError) {
              console.error('Error fetching order details:', detailsError);
              return {
                ...order,
                details: []
              };
            }

            const formattedDetails = detailsData?.map((detail: any) => ({
              id_produit: detail.id_produit,
              quantite: detail.quantite,
              prix_unitaire: detail.prix_unitaire,
              size: detail.size,
              color: detail.color,
              product_name: detail.produit?.nom || 'Produit inconnu'
            })) || [];

            return {
              ...order,
              details: formattedDetails
            };
          })
        );

        setOrders(ordersWithDetails);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('Erreur lors du chargement des commandes');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const cancelOrder = async (orderId: number) => {
    try {
      // First get order details to restore stock
      const { data: orderDetails, error: fetchError } = await supabase
        .from('commande_details')
        .select('id_produit, quantite')
        .eq('id_commande', orderId);

      if (fetchError) throw fetchError;

      // Restore stock for each product
      if (orderDetails) {
        for (const detail of orderDetails) {
          // Récupérer le stock actuel
          const { data: produit, error: fetchError } = await supabase
            .from('produit')
            .select('nombre_en_stock')
            .eq('id_produit', detail.id_produit)
            .single();

          if (fetchError) {
            console.error('Error fetching product stock:', fetchError);
            continue;
          }

          // Restaurer le stock
          const newStock = (produit?.nombre_en_stock || 0) + detail.quantite;
          const { error: stockError } = await supabase
            .from('produit')
            .update({ nombre_en_stock: newStock })
            .eq('id_produit', detail.id_produit);

          if (stockError) {
            console.error('Error restoring stock:', stockError);
            // Continue même si la restauration du stock échoue
          }
        }
      }

      // Then delete order details
      const { error: detailsError } = await supabase
        .from('commande_details')
        .delete()
        .eq('id_commande', orderId);

      if (detailsError) throw detailsError;

      // Finally delete the order
      const { error: orderError } = await supabase
        .from('commande')
        .delete()
        .eq('id_commande', orderId);

      if (orderError) throw orderError;

      // Update local state by removing the order
      setOrders(prev => prev.filter(order => order.id_commande !== orderId));

      // Trigger level refresh for all components
      import('@/hooks/useUserLevels').then(({ triggerLevelRefresh }) => {
        triggerLevelRefresh();
      });

      toast.success('Commande supprimée avec succès');
    } catch (error) {
      console.error('Error deleting order:', error);
      toast.error('Erreur lors de la suppression de la commande');
    }
  };

  const canCancelOrder = (status: string) => {
    const lowerStatus = status.toLowerCase().replace(/\s+/g, '_');
    // Allow cancellation for pending and in progress orders
    return lowerStatus === 'en_attente' || 
           lowerStatus === 'pending' || 
           lowerStatus === 'en_cours' ||
           lowerStatus === 'in_progress';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'livré':
      case 'livre':
        return 'text-green-500 bg-green-500/10';
      case 'en_cours':
      case 'en cours':
        return 'text-blue-500 bg-blue-500/10';
      case 'en_attente':
      case 'en attente':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'expédié':
      case 'expedie':
        return 'text-purple-500 bg-purple-500/10';
      case 'annulé':
      case 'annule':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  return {
    orders,
    loading,
    getStatusColor,
    cancelOrder,
    canCancelOrder,
    userId
  };
};