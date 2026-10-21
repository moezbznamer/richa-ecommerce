
import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Youtube, Mail, MapPin, Phone, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const footerLinks = {
    'Shop': ['Men', 'Women', 'Kids', 'Otaku', 'Accessories'],
    'Customer Service': ['Contact Us', 'Size Guide', 'Shipping Info', 'Returns', 'VIP Support'],
    'Company': ['About Us', 'Careers', 'Press', 'Sustainability', 'Privacy Policy'],
  };

  return (
    <footer className="bg-luxury-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Crown className="w-8 h-8 text-luxury-gold" />
              <span className="text-4xl font-oswald font-bold text-luxury-gold tracking-wider">
                RICHA
              </span>
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Defining luxury streetwear with premium quality, exclusive designs, and uncompromising style for the modern elite.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-12 h-12 bg-luxury-card rounded-full flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-all duration-300 luxury-shadow border border-gray-800"
                  aria-label={label}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-oswald font-semibold text-lg mb-4 text-luxury-gold">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-300 hover:text-luxury-gold transition-colors duration-300 relative group"
                    >
                      {link}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-luxury-gold transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-oswald font-semibold text-lg mb-4 text-luxury-gold">VIP Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-luxury-gold" />
                <span className="text-gray-300">123 Luxury Avenue, NYC 10001</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-luxury-gold" />
                <span className="text-gray-300">+1 (555) VIP-RICH</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-luxury-gold" />
                <span className="text-gray-300">vip@richa.com</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-luxury-card rounded-lg border border-luxury-gold/30">
              <h4 className="text-luxury-gold font-semibold mb-2">VIP Hotline</h4>
              <p className="text-gray-300 text-sm">
                24/7 exclusive support for our premium members
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 RICHA. All rights reserved. Luxury Redefined.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-luxury-gold text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-luxury-gold text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/vip" className="text-luxury-gold text-sm font-semibold">
              VIP Club
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
