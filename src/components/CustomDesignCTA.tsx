import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Shirt, Heart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CustomDesignCTA = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <Palette className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Créez Votre Style Unique
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chez <span className="font-semibold text-primary">RRICHA</span>, nous croyons que le style est personnel. 
            Créez une pièce qui vous ressemble vraiment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Design Personnalisé</h3>
                  <p className="text-muted-foreground text-sm">
                    Soumettez votre concept, vos croquis ou votre inspiration
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shirt className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Choix des Matériaux</h3>
                  <p className="text-muted-foreground text-sm">
                    Sélectionnez le tissu, la coupe et les finitions de votre choix
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Suivi Personnel</h3>
                  <p className="text-muted-foreground text-sm">
                    Notre équipe vous accompagne dans la réalisation
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Link to="/custom-design">
                <Button size="lg" className="group">
                  Commencer mon design
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right side - Visual showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 overflow-hidden">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Votre Imagination, Notre Expertise
                  </h3>
                  <p className="text-muted-foreground">
                    Transformez vos idées en pièces uniques avec notre service de design personnalisé
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl mb-2">✏️</div>
                      <p className="text-xs text-muted-foreground">Dessinez</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">💭</div>
                      <p className="text-xs text-muted-foreground">Imaginez</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl mb-2">👕</div>
                      <p className="text-xs text-muted-foreground">Portez</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center"
            >
              <Palette className="w-6 h-6 text-primary" />
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute -bottom-4 -left-4 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
            >
              <Heart className="w-5 h-5 text-primary" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomDesignCTA;