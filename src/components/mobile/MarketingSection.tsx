import { motion } from 'framer-motion';

interface MarketingSectionProps {
  title: string;
  subtitle?: string;
}

const MarketingSection = ({ title, subtitle }: MarketingSectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-8 px-6 text-center"
    >
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-sm leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.section>
  );
};

export default MarketingSection;
