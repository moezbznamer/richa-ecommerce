
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ColorImage {
  color: string;
  image_url: string;
  preview?: string;
}

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    prix: 0,
    taille: '',
    nombre_en_stock: 0,
    type_produit: '',
  });
  const [colorImages, setColorImages] = useState<ColorImage[]>([
    { color: '', image_url: '', preview: '' }
  ]);

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setColorImages(prev => {
          const updated = [...prev];
          updated[index] = { ...updated[index], image_url: result, preview: result };
          return updated;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addColorImage = () => {
    setColorImages(prev => [...prev, { color: '', image_url: '', preview: '' }]);
  };

  const removeColorImage = (index: number) => {
    if (colorImages.length > 1) {
      setColorImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index: number, color: string) => {
    setColorImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], color };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate colors and images
    const validColorImages = colorImages.filter(ci => ci.color && ci.image_url);
    if (validColorImages.length === 0) {
      toast.error('Ajoutez au moins une couleur avec son image');
      return;
    }

    setLoading(true);

    try {
      // Extract colors for couleur_disponible
      const colors = validColorImages.map(ci => ci.color).join(', ');
      
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('produit')
        .insert({
          nom: formData.nom,
          description: formData.description || null,
          prix: formData.prix,
          taille: formData.taille || null,
          nombre_en_stock: formData.nombre_en_stock,
          type_produit: formData.type_produit,
          couleur_disponible: colors
        })
        .select()
        .single();

      if (productError) throw productError;

      // Insert images for each color
      const imageInserts = validColorImages.map(ci => ({
        id_produit: product.id_produit,
        color: ci.color,
        image_url: ci.image_url
      }));

      const { error: imagesError } = await supabase
        .from('images_produit')
        .insert(imageInserts);

      if (imagesError) throw imagesError;

      toast.success('Produit et images ajoutés avec succès!');
      
      // Reset form
      setFormData({
        nom: '',
        description: '',
        prix: 0,
        taille: '',
        nombre_en_stock: 0,
        type_produit: '',
      });
      setColorImages([{ color: '', image_url: '', preview: '' }]);
      
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-luxury-black pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4">
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
            Ajouter un <span className="text-luxury-gold">Produit</span>
          </h1>
          <p className="text-gray-300">Ajoutez un nouveau produit à votre catalogue</p>
        </motion.div>

        {/* Form */}
        <motion.div
          className="luxury-card p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                  required
                  className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
                  placeholder="Ex: Chemise élégante..."
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Prix *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.prix}
                  onChange={(e) => setFormData(prev => ({ ...prev, prix: parseFloat(e.target.value) || 0 }))}
                  required
                  className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
                placeholder="Description du produit..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Type de produit *
                </label>
                <select
                  value={formData.type_produit}
                  onChange={(e) => setFormData(prev => ({ ...prev, type_produit: e.target.value }))}
                  required
                  className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="man">Homme</option>
                  <option value="woman">Femme</option>
                  <option value="girl">Fille</option>
                  <option value="boy">Garçon</option>
                  <option value="otaku">Otaku</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nombre en stock *
                </label>
                <input
                  type="number"
                  value={formData.nombre_en_stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre_en_stock: parseInt(e.target.value) || 0 }))}
                  required
                  min="0"
                  className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Taille</label>
              <select
                value={formData.taille}
                onChange={(e) => setFormData(prev => ({ ...prev, taille: e.target.value }))}
                className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold"
              >
                <option value="">Sélectionner une taille</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>

            {/* Colors and Images */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-gray-300 text-sm font-medium">
                  Couleurs et Images *
                </label>
                <button
                  type="button"
                  onClick={addColorImage}
                  className="flex items-center space-x-2 text-luxury-gold hover:text-luxury-gold/80 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une couleur</span>
                </button>
              </div>

              <div className="space-y-4">
                {colorImages.map((colorImage, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-luxury-black/50 rounded-xl border border-gray-700">
                    <div className="flex-1 space-y-4">
                      <div>
                        <input
                          type="text"
                          value={colorImage.color}
                          onChange={(e) => updateColor(index, e.target.value)}
                          placeholder="Nom de la couleur (ex: Noir, Bleu...)"
                          className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
                        />
                      </div>

                      <div className="flex items-center space-x-4">
                        <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-luxury-gold transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(index, e)}
                            className="hidden"
                          />
                          {colorImage.preview ? (
                            <img src={colorImage.preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            <Upload className="w-6 h-6 text-gray-400" />
                          )}
                        </label>
                        <div className="text-sm text-gray-400">
                          <p>Formats: JPG, PNG, GIF</p>
                          <p>Max: 5MB</p>
                        </div>
                      </div>
                    </div>

                    {colorImages.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorImage(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-luxury w-full flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Ajout en cours...' : 'Ajouter le produit'}</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;
