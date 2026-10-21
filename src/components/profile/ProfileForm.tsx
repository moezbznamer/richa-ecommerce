
import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';

interface FormData {
  nom: string;
  prenom: string;
}

interface ProfileFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  editing: boolean;
  userEmail?: string;
  profileEmail?: string;
  onSubmit: (e: React.FormEvent) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  formData,
  setFormData,
  editing,
  userEmail,
  profileEmail,
  onSubmit,
}) => {
  return (
    <motion.div
      className="luxury-card p-6"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-white mb-6">Informations personnelles</h3>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
              disabled={!editing}
              className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold disabled:opacity-50"
              placeholder="Votre prénom"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Nom
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              disabled={!editing}
              className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold disabled:opacity-50"
              placeholder="Votre nom"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            value={profileEmail || userEmail}
            disabled
            className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-gray-400 opacity-50"
          />
        </div>
        
        {editing && (
          <motion.button
            type="submit"
            className="btn-luxury w-full flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder les modifications</span>
          </motion.button>
        )}
      </form>
    </motion.div>
  );
};

export default ProfileForm;
