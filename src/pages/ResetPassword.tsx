
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import BackToHomeButton from '@/components/BackToHomeButton';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    // Handle auth state change and URL parameters
    const handleAuthStateChange = async () => {
      // First, check if we have URL fragments (Supabase sends tokens as fragments, not query params)
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1)); // Remove '#' and parse
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        console.log('URL fragments:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        if (accessToken && refreshToken && type === 'recovery') {
          try {
            // Use the newer setSession method
            const { data, error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) {
              console.error('Error setting session:', error);
              toast.error('Lien de réinitialisation invalide: ' + error.message);
              setTimeout(() => navigate('/forgot-password'), 3000);
            } else {
              console.log('Session set successfully:', !!data.session);
              setIsValidSession(true);
            }
          } catch (error) {
            console.error('Exception setting session:', error);
            toast.error('Erreur lors de la validation du lien');
            setTimeout(() => navigate('/forgot-password'), 3000);
          }
        } else {
          console.log('Missing required URL parameters');
          toast.error('Lien de réinitialisation invalide ou incomplet');
          setTimeout(() => navigate('/forgot-password'), 3000);
        }
      } else {
        // Check if user already has a valid session
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('Existing session found');
          setIsValidSession(true);
        } else {
          console.log('No URL fragments and no existing session');
          toast.error('Lien de réinitialisation manquant ou expiré');
          setTimeout(() => navigate('/forgot-password'), 3000);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, !!session);
        if (event === 'PASSWORD_RECOVERY') {
          setIsValidSession(true);
        }
      }
    );

    handleAuthStateChange();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      toast.error('Veuillez saisir un mot de passe');
      return;
    }
    
    if (password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error('Erreur lors de la mise à jour: ' + error.message);
      } else {
        setSuccess(true);
        toast.success('Mot de passe mis à jour avec succès !');
        
        // Rediriger vers la page de connexion après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-luxury-black flex items-center justify-center p-4">
        <div className="glassmorphism p-8 rounded-2xl text-center max-w-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-white">Vérification du lien...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-luxury-black flex">
        <BackToHomeButton />
        
        <div className="w-full flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glassmorphism p-6 sm:p-8 rounded-2xl w-full max-w-md text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-playfair mb-4">
              Mot de passe mis à jour !
            </h1>
            
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion.
            </p>
            
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-gold mx-auto"></div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black flex">
      <BackToHomeButton />
      
      {/* Left Side - Quote/Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-luxury-gradient items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center max-w-md"
        >
          <div className="mb-8">
            <img
              src="/placeholder.svg"
              alt="RRICHA Fashion"
              className="w-64 h-80 object-cover rounded-2xl mx-auto shadow-2xl"
            />
          </div>
          <blockquote className="text-xl sm:text-2xl font-playfair text-white italic leading-relaxed">
            "Sécurisez votre accès à l'univers RRICHA"
          </blockquote>
          <p className="text-luxury-gold font-semibold mt-4">- RRICHA</p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism p-6 sm:p-8 rounded-2xl w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-playfair mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Choisissez un mot de passe sécurisé pour votre compte RRICHA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Nouveau mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="luxury-search pl-10 pr-10 h-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-luxury-gold"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="luxury-search pl-10 pr-10 h-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-luxury-gold"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {password && password.length < 6 && (
              <p className="text-red-400 text-sm">
                Le mot de passe doit contenir au moins 6 caractères
              </p>
            )}

            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-red-400 text-sm">
                Les mots de passe ne correspondent pas
              </p>
            )}

            <Button
              type="submit"
              disabled={loading || password !== confirmPassword || password.length < 6}
              className="btn-luxury w-full h-12 text-base sm:text-lg font-semibold"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                'Mettre à jour le mot de passe'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
