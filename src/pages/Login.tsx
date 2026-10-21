
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import BackToHomeButton from '@/components/BackToHomeButton';
import { toast } from 'sonner';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handlePhoneLogin = async (phone: string, password: string) => {
    try {
      // Rechercher l'utilisateur par téléphone
      const { data: userData, error: userError } = await supabase
        .from('utilisateur')
        .select('email')
        .eq('numero_telephone', phone)
        .single();

      if (userError || !userData) {
        toast.error('Numéro de téléphone non trouvé');
        return;
      }

      // Se connecter avec l'email trouvé
      const { error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password,
      });

      if (error) {
        toast.error('Mot de passe incorrect');
        return;
      }

      toast.success('Connexion réussie');
    } catch (error) {
      console.error('Phone login error:', error);
      toast.error('Erreur lors de la connexion');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        if (loginMethod === 'email') {
          const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
          });
          
          if (error) {
            // Handle email not confirmed error
            if (error.message.includes('Email not confirmed')) {
              toast.error('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail.', {
                duration: 5000,
              });
              return;
            }
            throw error;
          }
          
          toast.success('Connexion réussie');
        } else {
          await handlePhoneLogin(formData.phone, formData.password);
        }
      } else {
        // Inscription
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Ajouter à la table utilisateur
        const { error: dbError } = await supabase
          .from('utilisateur')
          .insert({
            email: formData.email,
            nom: formData.lastName,
            prenom: formData.firstName,
            numero_telephone: formData.phone || null,
            mot_de_passe: 'hashed_password'
          });

        if (dbError) {
          console.error('Database insert error:', dbError);
        }

        if (data?.user && !data.session) {
          toast.success('Compte créé ! Vérifiez votre email pour confirmer votre inscription.', {
            duration: 6000,
          });
        } else {
          toast.success('Compte créé avec succès');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Better error messages
      if (error.message.includes('already registered')) {
        toast.error('Cet email est déjà utilisé');
      } else if (error.message.includes('Invalid login')) {
        toast.error('Email ou mot de passe incorrect');
      } else {
        toast.error(error.message || 'Erreur lors de l\'authentification');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              alt="Fashion Model"
              className="w-64 h-80 object-cover rounded-2xl mx-auto shadow-2xl"
            />
          </div>
          <blockquote className="text-2xl font-playfair text-white italic leading-relaxed">
            "La mode n'est pas seulement ce que vous portez, c'est comment vous vous exprimez."
          </blockquote>
          <p className="text-luxury-gold font-semibold mt-4">- RICHA</p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="glassmorphism p-8 rounded-2xl w-full max-w-md"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white font-playfair mb-2">
              {isLogin ? 'Bienvenue' : 'Rejoindre RICHA'}
            </h1>
            <p className="text-gray-300">
              {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte de luxe'}
            </p>
          </div>

          {/* Login Method Toggle (only for login) */}
          {isLogin && (
            <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'email'
                    ? 'bg-luxury-gold text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-luxury-gold text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Téléphone
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="luxury-search pl-10 h-12"
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required={!isLogin}
                    className="luxury-search pl-10 h-12"
                  />
                </div>
              </div>
            )}

            {(loginMethod === 'email' || !isLogin) && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
                <Input
                  type="email"
                  name="email"
                  placeholder="Adresse Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="luxury-search pl-10 h-12"
                />
              </div>
            )}

            {(loginMethod === 'phone' && isLogin) && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Numéro de téléphone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="luxury-search pl-10 h-12"
                />
              </div>
            )}

            {!isLogin && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
                <Input
                  type="tel"
                  name="phone"
                  placeholder="Numéro de téléphone (optionnel)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="luxury-search pl-10 h-12"
                />
              </div>
            )}

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gold w-5 h-5" />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleInputChange}
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

            <Button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full h-12 text-lg font-semibold"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
              ) : (
                <>
                  {isLogin ? 'Se connecter' : 'Créer le compte'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-4">
            {isLogin && (
              <Link
                to="/forgot-password"
                className="block text-gray-400 hover:text-luxury-gold text-sm"
              >
                Mot de passe oublié ?
              </Link>
            )}
            
            <div className="flex items-center justify-center space-x-2 text-sm">
              <span className="text-gray-300">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-luxury-gold hover:underline font-semibold"
              >
                {isLogin ? 'S\'inscrire' : 'Se connecter'}
              </button>
            </div>

            <Link to="/" className="block text-gray-400 hover:text-luxury-gold text-sm">
              ← Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
