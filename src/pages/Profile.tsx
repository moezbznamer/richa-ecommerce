
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ProfileForm from '@/components/profile/ProfileForm';
import OrdersHistory from '@/components/profile/OrdersHistory';
import LevelProgress from '@/components/LevelProgress';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useOrders } from '@/hooks/useOrders';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle, LogOut } from 'lucide-react';
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

const Profile = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading, editing, setEditing, formData, setFormData, handleSubmit } = useProfile(user);
  const { orders, loading: ordersLoading, getStatusColor, cancelOrder, canCancelOrder } = useOrders();
  const [cancellingOrder, setCancellingOrder] = useState<number | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleCancelOrder = async (orderId: number) => {
    setCancellingOrder(orderId);
    await cancelOrder(orderId);
    setCancellingOrder(null);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (authLoading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold mx-auto"></div>
            <p className="text-white mt-4">Chargement...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!user) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <h1 className="text-3xl font-oswald font-bold text-white mb-4">
              Accès refusé
            </h1>
            <p className="text-gray-300 mb-6">Vous devez être connecté pour accéder à cette page.</p>
            <Link to="/login" className="btn-luxury">
              Se connecter
            </Link>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  if (loading) {
    return (
      <ResponsiveLayout>
        <div className="min-h-screen bg-luxury-black flex items-center justify-center px-4 pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-luxury-gold mx-auto"></div>
            <p className="text-white mt-4">Chargement du profil...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-luxury-black pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-oswald font-bold text-white mb-2">
              Mon <span className="text-luxury-gold">Profil</span>
            </h1>
            <p className="text-gray-300">Gérez vos informations personnelles et commandes</p>
            
            {/* User info display */}
            <div className="mt-4 p-4 bg-luxury-card rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-white">
                  <span className="text-gray-300">Connecté en tant que:</span> 
                  <span className="ml-2 text-luxury-gold font-semibold">{user.email}</span>
                </p>
                {profile && (profile.nom || profile.prenom) && (
                  <p className="text-white mt-1">
                    <span className="text-gray-300">Nom complet:</span>
                    <span className="ml-2">{`${profile.prenom || ''} ${profile.nom || ''}`.trim()}</span>
                  </p>
                )}
              </div>
              
              {/* Logout button */}
              <div className="mt-4 sm:mt-0">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isLoggingOut}
                      className="text-red-400 border-red-400 hover:bg-red-400/10 hover:text-red-300"
                    >
                      {isLoggingOut ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin w-4 h-4 border border-red-400 border-t-transparent rounded-full" />
                          <span>Déconnexion...</span>
                        </div>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4 mr-2" />
                          Se déconnecter
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-luxury-black border border-luxury-gold/30">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white flex items-center">
                        <LogOut className="w-5 h-5 text-red-400 mr-2" />
                        Se déconnecter
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        Êtes-vous sûr de vouloir vous déconnecter ? 
                        Vous devrez vous reconnecter pour accéder à votre compte.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-700 text-white hover:bg-gray-600">
                        Annuler
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Oui, se déconnecter
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture & Basic Info */}
            <ProfileAvatar
              profile={profile}
              userEmail={user.email}
              editing={editing}
              onEditToggle={() => setEditing(!editing)}
            />

            {/* Profile Form */}
            <div className="lg:col-span-2 space-y-8">
              <ProfileForm
                formData={formData}
                setFormData={setFormData}
                editing={editing}
                userEmail={user.email}
                profileEmail={profile?.email}
                onSubmit={handleSubmit}
              />

              {/* Level Progress */}
              <LevelProgress />

              {/* Orders History */}
              <div className="luxury-card p-6">
                <h3 className="text-2xl font-oswald font-bold text-white mb-6">
                  Historique des <span className="text-luxury-gold">Commandes</span>
                </h3>
                
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto"></div>
                    <p className="text-gray-300 mt-4">Chargement des commandes...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-300 mb-4">Aucune commande trouvée</p>
                    <Link to="/" className="btn-luxury-outline">
                      Découvrir nos produits
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order.id_commande}
                        className="bg-gray-900/30 rounded-lg p-4 border border-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                            <span className="text-white font-semibold">
                              Commande #{order.id_commande}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.statut)}`}>
                              {order.statut.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="text-right">
                             <p className="text-luxury-gold font-bold text-lg">
                               {order.total.toFixed(2)} DT
                             </p>
                            <p className="text-gray-400 text-sm">
                              {new Date(order.date_commande).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>

                        {order.details && order.details.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-gray-300 font-medium text-sm mb-2">Articles:</h4>
                            {order.details.map((detail, index) => (
                              <div key={index} className="flex justify-between items-center bg-gray-800/50 rounded p-2">
                                <div>
                                  <span className="text-white text-sm">
                                    {detail.product_name}
                                  </span>
                                  {(detail.size || detail.color) && (
                                    <div className="text-xs text-gray-400">
                                      {detail.size && `Taille: ${detail.size}`}
                                      {detail.size && detail.color && ', '}
                                      {detail.color && `Couleur: ${detail.color}`}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                   <div className="text-white text-sm">
                                     {detail.quantite} x {detail.prix_unitaire.toFixed(2)} DT
                                   </div>
                                   <div className="text-luxury-gold text-xs font-medium">
                                     {(detail.quantite * detail.prix_unitaire).toFixed(2)} DT
                                   </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {order.adresse_livraison && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-gray-400 text-sm">
                              <span className="font-medium">Adresse:</span> {order.adresse_livraison}
                            </p>
                            {order.methode_paiement && (
                              <p className="text-gray-400 text-sm mt-1">
                                <span className="font-medium">Paiement:</span> {order.methode_paiement.replace('_', ' ')}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Cancel button */}
                        {canCancelOrder(order.statut) && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <div className="flex justify-end">
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
                                        Annuler la commande
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
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Profile;
