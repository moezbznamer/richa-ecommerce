
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

interface OfferBadgeProps {
  discount: number;
  className?: string;
}

const OfferBadge = ({ discount, className = '' }: OfferBadgeProps) => {
  return (
    <motion.div
      className={`inline-flex items-center space-x-1 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Flame className="w-4 h-4" />
      <span>-{discount}% OFFRE SPÉCIALE</span>
    </motion.div>
  );
};

export default OfferBadge;
