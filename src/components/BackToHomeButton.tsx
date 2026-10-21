
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BackToHomeButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate('/')}
      className="fixed bottom-6 left-6 z-50 bg-gold-gradient text-black p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Home className="w-6 h-6 group-hover:animate-pulse" />
    </motion.button>
  );
};

export default BackToHomeButton;
