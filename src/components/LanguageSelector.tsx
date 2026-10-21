
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    document.documentElement.dir = langCode === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="relative group">
      <motion.button
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-colors"
        whileHover={{ scale: 1.05 }}
      >
        <Globe className="w-5 h-5 text-white" />
        <span className="text-white hidden md:block">
          {languages.find(lang => lang.code === i18n.language)?.flag}
        </span>
      </motion.button>

      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[150px] z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
              i18n.language === lang.code ? 'bg-luxury-gold/10 text-luxury-gold' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm">{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
