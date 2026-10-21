
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Eye, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Order {
  id_commande: number;
  date_commande: string;
  statut: string;
  total: number;
  produits: Array<{
    nom_produit: string;
    quantite: number;
    prix: number;
  }>;
}

interface OrdersHistoryProps {
  orders: Order[];
  getStatusColor: (status: string) => string;
  cancelOrder: (orderId: number) => Promise<void>;
  canCancelOrder: (status: string) => boolean;
}

const OrdersHistory: React.FC<OrdersHistoryProps> = ({ orders, getStatusColor, cancelOrder, canCancelOrder }) => {
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);

  const handleCancelOrder = async (orderId: number) => {
    setCancellingOrder(orderId);
    await cancelOrder(orderId);
    setCancellingOrder(null);
  };
  return (
    <motion.div
      className="luxury-card p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-2xl font-oswald font-bold text-white mb-6 flex items-center">
        <Package className="w-6 h-6 mr-2 text-luxury-gold" />
        Mes Commandes
      </h3>
      
      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id_commande} className="bg-luxury-black/50 rounded-xl p-4 border border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h4 className="text-white font-semibold">
                    Commande #{order.id_commande}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.statut)}`}>
                    {order.statut}
                  </span>
                </div>
                <div className="text-right mt-2 md:mt-0">
                  <p className="text-gray-300 text-sm">{new Date(order.date_commande).toLocaleDateString()}</p>
                  <p className="text-luxury-gold font-bold">{order.total.toFixed(2)} DT</p>
                </div>
              </div>
              
              <div className="space-y-2">
                {order.produits.map((produit, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">
                      {produit.nom_produit} x{produit.quantite}
                    </span>
                    <span className="text-white">{(produit.prix * produit.quantite).toFixed(2)} DT</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-600">
                <div className="flex items-center justify-between">
                  <button className="text-luxury-gold hover:text-luxury-gold/80 text-sm flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>Voir les détails</span>
                  </button>
                  
                  {canCancelOrder(order.statut) && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={cancellingOrder === order.id_commande}
                          className="text-red-400 border-red-400 hover:bg-red-400/10 hover:text-red-300"
                        >
                          {cancellingOrder === order.id_commande ? (
                            <div className="flex items-center space-x-1">
                              <div className="animate-spin w-3 h-3 border border-red-400 border-t-transparent rounded-full" />
                              <span>Annulation...</span>
                            </div>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-1" />
                              Annuler
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-luxury-black border border-luxury-gold/30">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white flex items-center">
                            <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                            Annuler la commande
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-300">
                            Êtes-vous sûr de vouloir annuler la commande #{order.id_commande} ? 
                            Cette action ne peut pas être annulée.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                            Non, garder
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleCancelOrder(order.id_commande)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Oui, annuler
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-300">Aucune commande pour le moment</p>
          <p className="text-gray-400 text-sm mt-2">
            Vos futures commandes apparaîtront ici
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default OrdersHistory;
