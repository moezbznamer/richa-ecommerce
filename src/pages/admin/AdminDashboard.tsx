
import React from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, TrendingUp, Plus, Eye, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Produits', value: '156', icon: Package, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { label: 'Commandes du jour', value: '23', icon: ShoppingBag, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { label: 'Clients actifs', value: '1,234', icon: Users, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { label: 'Revenus du mois', value: '12,456 DT', icon: TrendingUp, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  const quickActions = [
    {
      title: 'Ajouter un Produit',
      description: 'Ajoutez un nouveau produit au catalogue',
      icon: Plus,
      link: '/admin/add-product',
      color: 'bg-luxury-gold text-black hover:bg-luxury-gold/90'
    },
    {
      title: 'Voir les Commandes',
      description: 'Gérez toutes les commandes clients',
      icon: Eye,
      link: '/admin/view-orders',
      color: 'bg-blue-600 text-white hover:bg-blue-700'
    },
    {
      title: 'Gestion des Produits',
      description: 'Modifiez les produits existants',
      icon: Settings,
      link: '/admin/manage-products',
      color: 'bg-green-600 text-white hover:bg-green-700'
    },
  ];

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
          <h1 className="text-4xl font-oswald font-bold text-white mb-2">
            Tableau de <span className="text-luxury-gold">Bord Admin</span>
          </h1>
          <p className="text-gray-300">Gérez votre boutique RRICHA</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="luxury-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-oswald font-bold text-white mb-6">Actions Rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              >
                <Link
                  to={action.link}
                  className="luxury-card p-6 block hover:border-luxury-gold/50 transition-colors group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${action.color} transition-transform group-hover:scale-110`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-luxury-gold transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{action.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="luxury-card p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-oswald font-bold text-white mb-6">Activité Récente</h2>
          <div className="space-y-4">
            {[
              { action: 'Nouvelle commande #1234', time: 'Il y a 5 minutes', type: 'order' },
              { action: 'Produit "T-shirt Premium" ajouté', time: 'Il y a 1 heure', type: 'product' },
              { action: 'Commande #1233 expédiée', time: 'Il y a 2 heures', type: 'shipping' },
              { action: 'Nouveau client inscrit', time: 'Il y a 3 heures', type: 'user' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'order' ? 'bg-green-500' :
                    activity.type === 'product' ? 'bg-blue-500' :
                    activity.type === 'shipping' ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}></div>
                  <span className="text-white">{activity.action}</span>
                </div>
                <span className="text-gray-400 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
