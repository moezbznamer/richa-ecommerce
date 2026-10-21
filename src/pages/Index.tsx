import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import ResponsiveLayout from '@/components/ResponsiveLayout';
import HeroSection from '../components/HeroSection';
import PromotionalProductShowcase from '../components/PromotionalProductShowcase';
import ProduitShowcase from '../components/ProduitShowcase';
import PickOfTheDay from '../components/PickOfTheDay';
import CategoryCards from '../components/CategoryCards';
import CustomDesignCTA from '../components/CustomDesignCTA';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import FloatingCart from '../components/FloatingCart';
import MobileHomePage from '../components/mobile/MobileHomePage';

const Index = () => {
  const isMobile = useIsMobile();

  // Render mobile-specific homepage
  if (isMobile) {
    return <MobileHomePage />;
  }

  // Desktop version
  return (
    <ResponsiveLayout>
      <HeroSection />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <PromotionalProductShowcase />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <ProduitShowcase limit={8} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <PickOfTheDay />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <CustomDesignCTA />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <CategoryCards />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <Newsletter />
      </motion.div>

      <Footer />
      
      <div className="hidden lg:block">
        <FloatingCart />
      </div>
    </ResponsiveLayout>
  );
};

export default Index;
