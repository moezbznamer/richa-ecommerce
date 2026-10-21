
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, Eye, Package, User, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  utilisateur?: {
    nom: string;
    prenom: string;
    email: string;
    numero_telephone?: string;
  };
  details: OrderDetail[];
}

const ViewOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      // Fetch all orders with their user info
      const { data: ordersData, error: ordersError } = await supabase
        .from('commande')
        .select(`
          id_commande,
          date_commande,
          statut,
          total,
          adresse_livraison,
          methode_paiement,
          id_utilisateur
        `)
        .order('date_commande', { ascending: false });

      if (ordersError) throw ordersError;

      if (!ordersData || ordersData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Fetch order details and user info for each order
      const ordersWithDetails: Order[] = await Promise.all(
        ordersData.map(async (order) => {
          // Fetch order details
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
          }

          // Fetch user info
          const { data: userData, error: userError } = await supabase
            .from('utilisateur')
            .select('nom, prenom, email, numero_telephone')
            .eq('id_utilisateur', order.id_utilisateur)
            .single();

          if (userError) {
            console.error('Error fetching user data:', userError);
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
            details: formattedDetails,
            utilisateur: userData || undefined
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

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('commande')
        .update({ 
          statut: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id_commande', orderId);

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id_commande === orderId 
          ? { ...order, statut: newStatus }
          : order
      ));
      
      toast.success(`Statut de la commande #${orderId} mis à jour: ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase().replace(/\s+/g, '_');
    switch (lowerStatus) {
      case 'livré':
      case 'livre':
      case 'delivered':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'en_cours':
      case 'en_attente':
      case 'pending':
      case 'in_progress':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'expédié':
      case 'expedie':
      case 'shipped':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'annulé':
      case 'annule':
      case 'cancelled':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchQuery === '' || 
      order.id_commande.toString().includes(searchQuery) ||
      (order.utilisateur && `${order.utilisateur.prenom} ${order.utilisateur.nom}`.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.utilisateur && order.utilisateur.email.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === '' || order.statut.toLowerCase().replace(/\s+/g, '_') === statusFilter.toLowerCase().replace(/\s+/g, '_');
    
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => {
    const status = order.statut.toLowerCase().replace(/\s+/g, '_');
    return status === 'en_cours' || status === 'en_attente' || status === 'pending' || status === 'in_progress';
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold mx-auto"></div>
          <p className="text-white mt-4">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/admin" className="inline-flex items-center text-luxury-gold hover:text-luxury-gold/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Link>
          <h1 className="text-4xl font-oswald font-bold text-white mb-2">
            Gestion des <span className="text-luxury-gold">Commandes</span>
          </h1>
          <p className="text-gray-300">Visualisez et gérez toutes les commandes clients</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            className="luxury-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Commandes</p>
                <p className="text-2xl font-bold text-white">{totalOrders}</p>
              </div>
              <Package className="w-8 h-8 text-luxury-gold" />
            </div>
          </motion.div>

          <motion.div
            className="luxury-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">En Attente</p>
                <p className="text-2xl font-bold text-yellow-500">{pendingOrders}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            className="luxury-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Chiffre d'Affaires</p>
                <p className="text-2xl font-bold text-green-500">{totalRevenue.toFixed(2)} DT</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          className="luxury-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par ID, nom client ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-luxury-black border border-gray-600 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold"
              >
                <option value="">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="en_cours">En cours</option>
                <option value="expédié">Expédié</option>
                <option value="livré">Livré</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          className="luxury-card overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-luxury-black/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map((order) => (
                  <tr key={order.id_commande} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-white font-medium">#{order.id_commande}</div>
                      <div className="text-gray-400 text-sm">{order.details.length} produit(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="w-8 h-8 text-gray-400 mr-3" />
                        <div>
                          {order.utilisateur ? (
                            <>
                              <div className="text-white font-medium">
                                {order.utilisateur.prenom} {order.utilisateur.nom}
                              </div>
                              <div className="text-gray-400 text-sm">{order.utilisateur.email}</div>
                            </>
                          ) : (
                            <div className="text-gray-400 text-sm">Utilisateur inconnu</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {new Date(order.date_commande).toLocaleDateString('fr-FR')}
                      <div className="text-gray-400 text-sm">
                        {new Date(order.date_commande).toLocaleTimeString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-luxury-gold font-bold">{order.total.toFixed(2)} DT</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.statut)}`}>
                        {order.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-luxury-gold hover:text-luxury-gold/80 p-2 rounded-lg hover:bg-luxury-gold/10"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <select
                          value={order.statut}
                          onChange={(e) => updateOrderStatus(order.id_commande, e.target.value)}
                          className="bg-luxury-black border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-luxury-gold"
                        >
                          <option value="pending">En attente</option>
                          <option value="en_cours">En cours</option>
                          <option value="expédié">Expédié</option>
                          <option value="livré">Livré</option>
                          <option value="annulé">Annulé</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-300">Aucune commande trouvée</p>
              <p className="text-gray-400 text-sm mt-2">
                Essayez d'ajuster vos filtres de recherche
              </p>
            </div>
          )}
        </motion.div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="luxury-card p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  Commande #{selectedOrder.id_commande}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Informations Client</h4>
                  <div className="bg-luxury-black/50 rounded-lg p-4">
                    {selectedOrder.utilisateur ? (
                      <>
                        <p className="text-white font-medium">
                          {selectedOrder.utilisateur.prenom} {selectedOrder.utilisateur.nom}
                        </p>
                        <p className="text-gray-300">{selectedOrder.utilisateur.email}</p>
                        {selectedOrder.utilisateur.numero_telephone && (
                          <p className="text-gray-300">{selectedOrder.utilisateur.numero_telephone}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-400">Informations client non disponibles</p>
                    )}
                  </div>
                </div>

                {/* Order Details */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Détails de la Commande</h4>
                  <div className="space-y-3">
                    {selectedOrder.details.map((detail, index) => (
                      <div key={index} className="flex justify-between items-center bg-luxury-black/50 rounded-lg p-3">
                        <div>
                          <p className="text-white font-medium">{detail.product_name}</p>
                          <p className="text-gray-400 text-sm">Quantité: {detail.quantite}</p>
                          {(detail.size || detail.color) && (
                            <p className="text-gray-400 text-xs">
                              {detail.size && `Taille: ${detail.size}`}
                              {detail.size && detail.color && ', '}
                              {detail.color && `Couleur: ${detail.color}`}
                            </p>
                          )}
                        </div>
                        <p className="text-luxury-gold font-bold">
                          {(detail.prix_unitaire * detail.quantite).toFixed(2)} DT
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-700 mt-4 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-xl font-bold text-luxury-gold">
                        {selectedOrder.total.toFixed(2)} DT
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Info */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Informations</h4>
                  <div className="bg-luxury-black/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date de commande:</span>
                      <span className="text-white">
                        {new Date(selectedOrder.date_commande).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Statut:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedOrder.statut)}`}>
                        {selectedOrder.statut}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewOrders;
