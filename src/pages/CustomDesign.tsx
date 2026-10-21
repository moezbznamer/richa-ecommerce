import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Palette, Shirt, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const CustomDesign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    phoneNumber: '',
    designConcept: '',
    fabricPreference: '',
    fitDescription: '',
    sizePreference: '',
    colorPreferences: '',
    specialInstructions: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Type de fichier non supporté",
          description: `${file.name} n'est pas un type de fichier supporté.`,
          variant: "destructive"
        });
        return false;
      }
      if (file.size > maxSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `${file.name} dépasse la taille limite de 5MB.`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFilesToStorage = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${user?.id || 'anonymous'}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('custom-designs')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('custom-designs')
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.customerEmail || !formData.designConcept) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let fileUrls: string[] = [];
      if (uploadedFiles.length > 0) {
        fileUrls = await uploadFilesToStorage(uploadedFiles);
      }

      const { error } = await supabase
        .from('custom_design_requests')
        .insert({
          user_id: user?.id || null,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          phone_number: formData.phoneNumber || null,
          design_concept: formData.designConcept,
          fabric_preference: formData.fabricPreference || null,
          fit_description: formData.fitDescription || null,
          size_preference: formData.sizePreference || null,
          color_preferences: formData.colorPreferences || null,
          special_instructions: formData.specialInstructions || null,
          uploaded_files: fileUrls
        });

      if (error) throw error;

      toast({
        title: "Demande envoyée avec succès !",
        description: "Notre équipe design vous contactera sous peu pour concrétiser votre vision.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error submitting design request:', error);
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ResponsiveLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Palette className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Créez Votre Style Unique
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Chez <span className="font-semibold text-primary">RRICHA</span>, nous croyons que le style est personnel. 
              Créez une pièce unique qui vous ressemble vraiment.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>Design personnalisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-primary" />
                <span>Qualité premium</span>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <Card className="shadow-2xl border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl text-foreground">Formulaire de Demande</CardTitle>
              <CardDescription className="text-base">
                Décrivez votre vision et notre équipe la transformera en réalité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Nom complet *</Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      placeholder="Votre nom complet"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Téléphone</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                {/* Design Concept */}
                <div className="space-y-2">
                  <Label htmlFor="designConcept">Concept de design *</Label>
                  <Textarea
                    id="designConcept"
                    value={formData.designConcept}
                    onChange={(e) => handleInputChange('designConcept', e.target.value)}
                    placeholder="Décrivez votre idée : style, motifs, message, inspiration..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                {/* Design Preferences */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fabricPreference">Type de tissu</Label>
                    <Select onValueChange={(value) => handleInputChange('fabricPreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un tissu" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cotton">Coton</SelectItem>
                        <SelectItem value="polyester">Polyester</SelectItem>
                        <SelectItem value="cotton-polyester">Coton-Polyester</SelectItem>
                        <SelectItem value="linen">Lin</SelectItem>
                        <SelectItem value="silk">Soie</SelectItem>
                        <SelectItem value="wool">Laine</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sizePreference">Taille</Label>
                    <Select onValueChange={(value) => handleInputChange('sizePreference', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une taille" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="XS">XS</SelectItem>
                        <SelectItem value="S">S</SelectItem>
                        <SelectItem value="M">M</SelectItem>
                        <SelectItem value="L">L</SelectItem>
                        <SelectItem value="XL">XL</SelectItem>
                        <SelectItem value="XXL">XXL</SelectItem>
                        <SelectItem value="custom">Taille sur mesure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="colorPreferences">Couleurs préférées</Label>
                    <Input
                      id="colorPreferences"
                      value={formData.colorPreferences}
                      onChange={(e) => handleInputChange('colorPreferences', e.target.value)}
                      placeholder="Ex: noir, blanc, rouge..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fitDescription">Style de coupe</Label>
                    <Input
                      id="fitDescription"
                      value={formData.fitDescription}
                      onChange={(e) => handleInputChange('fitDescription', e.target.value)}
                      placeholder="Ex: ajusté, oversize, classique..."
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <Label>Images d'inspiration</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Glissez vos fichiers ici ou cliquez pour parcourir
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Images (JPG, PNG, GIF, WEBP) et PDF • Max 5MB par fichier
                        </p>
                      </div>
                      <Input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 mt-4"
                      >
                        Choisir des fichiers
                      </Label>
                    </div>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Fichiers sélectionnés :</p>
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-muted/50 rounded-md p-3">
                            <span className="text-sm text-foreground truncate">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              Supprimer
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="specialInstructions">Instructions spéciales</Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    placeholder="Broderie, impression spéciale, détails particuliers..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto md:px-12 h-12 text-base font-semibold"
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    🖼️ Notre équipe design examinera votre demande et vous contactera pour concrétiser votre vision.<br />
                    🎨 Parce que la mode doit être aussi unique que vous.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default CustomDesign;