
import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Edit } from 'lucide-react';

interface ProfileAvatarProps {
  profile: {
    nom?: string;
    prenom?: string;
    email?: string;
  } | null;
  userEmail?: string;
  editing: boolean;
  onEditToggle: () => void;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  userEmail,
  editing,
  onEditToggle,
}) => {
  return (
    <motion.div
      className="luxury-card p-6 text-center h-fit"
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative inline-block mb-6">
        <div className="w-32 h-32 rounded-full bg-luxury-gold/20 flex items-center justify-center mx-auto">
          <User className="w-16 h-16 text-luxury-gold" />
        </div>
        <motion.button
          className="absolute bottom-0 right-0 bg-luxury-gold text-black p-2 rounded-full shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Camera className="w-4 h-4" />
        </motion.button>
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">
        {profile?.nom || profile?.prenom 
          ? `${profile.prenom || ''} ${profile.nom || ''}`.trim()
          : 'Utilisateur RRICHA'
        }
      </h2>
      
      <p className="text-gray-300 mb-4">{profile?.email || userEmail}</p>
      
      <motion.button
        onClick={onEditToggle}
        className={`btn-${editing ? 'luxury' : 'luxury-outline'} w-full flex items-center justify-center space-x-2`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Edit className="w-4 h-4" />
        <span>{editing ? 'Annuler' : 'Modifier le profil'}</span>
      </motion.button>
    </motion.div>
  );
};

export default ProfileAvatar;
