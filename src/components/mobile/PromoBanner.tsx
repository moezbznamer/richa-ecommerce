import { motion } from 'framer-motion';

interface PromoBannerProps {
  text: string;
}

const PromoBanner = ({ text }: PromoBannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-primary text-primary-foreground text-center py-2 px-4"
    >
      <p className="text-sm font-medium tracking-wide">{text}</p>
    </motion.div>
  );
};

export default PromoBanner;
