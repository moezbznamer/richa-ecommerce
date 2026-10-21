import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeroBannerProps {
  imageUrl: string;
  title: string;
  subtitle?: string;
  buttonText: string;
  buttonLink: string;
}

const HeroBanner = ({ imageUrl, title, subtitle, buttonText, buttonLink }: HeroBannerProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative mx-4 my-6 rounded-2xl overflow-hidden"
    >
      {/* Background Image */}
      <div className="aspect-[16/9] relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl font-bold text-white mb-1"
          >
            {title}
          </motion.h3>
          
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-sm text-white/80 mb-4"
            >
              {subtitle}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link to={buttonLink}>
              <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold shadow-lg">
                {buttonText}
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroBanner;
