
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Crown } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setShowPopup(true);
      setEmail('');
    }
  };

  return (
    <>
      <section className="py-20 bg-gold-gradient">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Crown className="w-16 h-16 mx-auto mb-6 text-black" />
            <h2 className="text-5xl font-oswald font-bold text-black mb-4">
              JOIN THE <span className="font-playfair">Elite</span>
            </h2>
            <p className="text-xl text-black/80 mb-8 max-w-2xl mx-auto">
              Subscribe to our exclusive newsletter and unlock VIP access to luxury collections, 
              early releases, and member-only discounts.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for VIP access"
                  className="flex-1 px-6 py-4 rounded-full bg-black/10 text-black placeholder-black/60 border-2 border-black/20 focus:outline-none focus:border-black/40 backdrop-blur-md luxury-shadow"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-4 bg-black text-luxury-gold rounded-full font-bold hover:bg-gray-900 transition-all duration-300 luxury-shadow-lg border-2 border-black"
                >
                  JOIN VIP
                </motion.button>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-center space-x-8 text-black/70">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm font-medium">Exclusive Deals</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm font-medium">Early Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <span className="text-sm font-medium">VIP Events</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-luxury-card rounded-2xl p-8 max-w-md w-full text-center luxury-shadow-lg border border-luxury-gold"
            >
              <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-2xl font-oswald font-bold text-luxury-gold mb-2">
                WELCOME TO VIP!
              </h3>
              <p className="text-gray-300 mb-6">
                You're now part of our exclusive community! Get ready for luxury deals and early access to premium collections.
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="btn-luxury"
              >
                START SHOPPING
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-luxury-gold transition-colors"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Newsletter;
