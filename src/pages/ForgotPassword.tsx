
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import BackToHomeButton from '@/components/BackToHomeButton';
import { toast } from 'sonner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);

    try {
      // Use current origin for redirect URL
      const currentOrigin = window.location.origin;
      console.log('Sending reset email with redirect to:', `${currentOrigin}/reset-password`);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentOrigin}/reset-password`,
      });

      if (error) {
        toast.error('Erreur lors de l\'envoi de l\'email: ' + error.message);
      } else {
        setEmailSent(true);
        toast.success('Email de réinitialisation envoyé !');
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
              Email envoyé !
            </h1>
            
            <p className="text-gray-300 mb-6 text-sm sm:text-base">
              Nous avons envoyé un lien de réinitialisation à <strong className="text-luxury-gold">{email}</strong>
            </p>
            
            <p className="text-gray-400 text-xs sm:text-sm mb-8">
              Vérifiez votre boîte de réception et vos spams. Le lien expire dans 15 minutes.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={() => setEmailSent(false)}
                className="btn-luxury-outline w-full"
              >
                Renvoyer l'email
              </Button>
              
              <Link to="/login" className="block text-gray-400 hover:text-luxury-gold text-sm">
                ← Retour à la connexion
              </Link>
            </div>
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
            "Retrouvez l'accès à votre garde-robe de luxe RRICHA"
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
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-300 text-sm sm:text-base">
              Saisissez votre email pour recevoir un lien de réinitialisation
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
              <Input
                type="email"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="luxury-search pl-10 h-12"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full h-12 text-base sm:text-lg font-semibold"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-4">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-400 hover:text-luxury-gold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
            
            <Link to="/" className="block text-gray-400 hover:text-luxury-gold text-sm">
              ← Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
