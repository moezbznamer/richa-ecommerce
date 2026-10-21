
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id_utilisateur?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  mot_de_passe?: string;
  date_creation_compte?: string;
}

interface FormData {
  nom: string;
  prenom: string;
}

export const useProfile = (user: User | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
  });

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('utilisateur')
        .select('*')
        .eq('email', user?.email)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const profileData = data || {
        id_utilisateur: 0,
        nom: '',
        prenom: '',
        email: user?.email,
      };

      setProfile(profileData);
      setFormData({
        nom: profileData.nom || '',
        prenom: profileData.prenom || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (profile?.id_utilisateur) {
        const { error } = await supabase
          .from('utilisateur')
          .update({
            nom: formData.nom,
            prenom: formData.prenom,
          })
          .eq('id_utilisateur', profile.id_utilisateur);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('utilisateur')
          .insert({
            email: user?.email,
            nom: formData.nom,
            prenom: formData.prenom,
            mot_de_passe: 'temp_password'
          });

        if (error) throw error;
      }

      setProfile(prev => prev ? { ...prev, ...formData } : null);
      setEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    loading,
    editing,
    setEditing,
    formData,
    setFormData,
    handleSubmit
  };
};
