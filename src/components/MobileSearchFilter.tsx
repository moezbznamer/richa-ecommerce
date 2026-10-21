
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { FilterOptions } from './SearchAndFilter';
import { Slider } from '@/components/ui/slider';

interface MobileSearchFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  searchQuery: string;
  filters: FilterOptions;
}

const MobileSearchFilter = ({ onSearch, onFilter, searchQuery, filters }: MobileSearchFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

  const filterCategories = [
    {
      key: 'gender',
      label: 'Catégorie',
      options: [
        { value: '', label: 'Toutes' },
        { value: 'man', label: 'Homme' },
        { value: 'woman', label: 'Femme' },
        { value: 'boy', label: 'Garçon' },
        { value: 'girl', label: 'Fille' },
      ]
    },
    {
      key: 'product_type',
      label: 'Type',
      options: [
        { value: '', label: 'Tous les types' },
        { value: 'T-Shirts', label: 'T-Shirts' },
        { value: 'Jeans', label: 'Jeans' },
        { value: 'Robes', label: 'Robes' },
        { value: 'Manteaux', label: 'Manteaux' },
        { value: 'Chaussures', label: 'Chaussures' },
        { value: 'Accessoires', label: 'Accessoires' },
      ]
    },
    {
      key: 'size',
      label: 'Taille',
      options: [
        { value: '', label: 'Toutes les tailles' },
        { value: 'XS', label: 'XS' },
        { value: 'S', label: 'S' },
        { value: 'M', label: 'M' },
        { value: 'L', label: 'L' },
        { value: 'XL', label: 'XL' },
        { value: 'XXL', label: 'XXL' },
      ]
    },
    {
      key: 'color',
      label: 'Couleur',
      options: [
        { value: '', label: 'Toutes les couleurs' },
        { value: 'Noir', label: 'Noir' },
        { value: 'Blanc', label: 'Blanc' },
        { value: 'Rouge', label: 'Rouge' },
        { value: 'Bleu', label: 'Bleu' },
        { value: 'Vert', label: 'Vert' },
        { value: 'Jaune', label: 'Jaune' },
        { value: 'Rose', label: 'Rose' },
        { value: 'Gris', label: 'Gris' },
      ]
    }
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: string | number) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    const newFilters = { 
      ...localFilters, 
      minPrice: values[0], 
      maxPrice: values[1] 
    };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      gender: '',
      product_type: '',
      minPrice: 0,
      maxPrice: 1000,
      size: '',
      color: '',
      brand: '',
    };
    setLocalFilters(clearedFilters);
    setPriceRange([0, 1000]);
    onFilter(clearedFilters);
  };

  const removeFilter = (key: keyof FilterOptions) => {
    const newFilters = { ...localFilters };
    if (key === 'minPrice' || key === 'maxPrice') {
      newFilters.minPrice = 0;
      newFilters.maxPrice = 1000;
      setPriceRange([0, 1000]);
    } else {
      newFilters[key] = '';
    }
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const getActiveFilters = () => {
    const active = [];
    if (localFilters.gender) active.push({ key: 'gender', label: localFilters.gender, value: localFilters.gender });
    if (localFilters.product_type) active.push({ key: 'product_type', label: localFilters.product_type, value: localFilters.product_type });
    if (localFilters.size) active.push({ key: 'size', label: localFilters.size, value: localFilters.size });
    if (localFilters.color) active.push({ key: 'color', label: localFilters.color, value: localFilters.color });
    if (localFilters.minPrice > 0 || localFilters.maxPrice < 1000) {
      active.push({ key: 'price', label: `${localFilters.minPrice} DT-${localFilters.maxPrice} DT`, value: 'price' });
    }
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="sticky top-0 z-40 bg-luxury-black/95 backdrop-blur-lg border-b border-luxury-gold/20 lg:hidden">
      {/* Search Bar */}
      <div className="p-4">
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher des produits..."
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-luxury-card border border-luxury-gold/30 rounded-xl pl-12 pr-16 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
              showFilters ? 'bg-luxury-gold text-black' : 'bg-luxury-card text-luxury-gold'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-400">Filtres actifs:</span>
              <button
                onClick={clearFilters}
                className="text-xs text-luxury-gold hover:text-white"
              >
                Tout effacer
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <div
                  key={filter.key}
                  className="flex items-center gap-1 bg-luxury-gold text-black px-2 py-1 rounded-full text-xs"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.key as keyof FilterOptions)}
                    className="hover:bg-black/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filterCategories.map((category) => {
            const currentValue = localFilters[category.key as keyof FilterOptions] as string;
            const selectedOption = category.options.find(opt => opt.value === currentValue);
            
            return (
              <button
                key={category.key}
                onClick={() => setActiveFilter(activeFilter === category.key ? null : category.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full border transition-all ${
                  currentValue && currentValue !== '' 
                    ? 'bg-luxury-gold text-black border-luxury-gold' 
                    : 'border-gray-600 text-gray-300'
                }`}
              >
                <span className="text-sm font-medium">
                  {selectedOption?.label || category.label}
                </span>
                <ChevronDown className="w-4 h-4 ml-1 inline" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Slide-up Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="absolute bottom-0 left-0 right-0 bg-luxury-card rounded-t-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                {/* Handle */}
                <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6"></div>
                
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-luxury-gold text-xl font-semibold">Filtres</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-gray-300 border border-gray-600 rounded-lg text-sm"
                    >
                      Tout effacer
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-gray-300 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filter Options */}
                <div className="space-y-6">
                  {filterCategories.map((category) => (
                    <div key={category.key}>
                      <h4 className="text-white font-medium mb-3">{category.label}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {category.options.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleFilterChange(category.key as keyof FilterOptions, option.value)}
                            className={`p-3 rounded-xl border transition-all text-left ${
                              localFilters[category.key as keyof FilterOptions] === option.value
                                ? 'bg-luxury-gold text-black border-luxury-gold'
                                : 'border-gray-600 text-gray-300 hover:border-luxury-gold/50'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Price Range */}
                  <div>
                    <h4 className="text-white font-medium mb-3">
                      Gamme de prix: {priceRange[0]} DT - {priceRange[1]} DT
                    </h4>
                    <div className="px-2">
                      <Slider
                        value={priceRange}
                        onValueChange={handlePriceRangeChange}
                        max={1000}
                        min={0}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>0 DT</span>
                        <span>1000 DT</span>
                      </div>
                    </div>
                  </div>

                  {/* Brand */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Marque</h4>
                    <select
                      value={localFilters.brand}
                      onChange={(e) => handleFilterChange('brand', e.target.value)}
                      className="w-full bg-luxury-black border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-luxury-gold"
                    >
                      <option value="">Toutes les marques</option>
                      <option value="RICHA">RICHA</option>
                    </select>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full mt-8 bg-luxury-gold text-black py-4 rounded-xl font-semibold text-lg"
                >
                  Appliquer les filtres
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Filter Dropdown */}
      <AnimatePresence>
        {activeFilter && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-luxury-card border-b border-luxury-gold/20 p-4"
          >
            <div className="grid grid-cols-2 gap-2">
              {filterCategories
                .find(cat => cat.key === activeFilter)
                ?.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleFilterChange(activeFilter as keyof FilterOptions, option.value);
                      setActiveFilter(null);
                    }}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      localFilters[activeFilter as keyof FilterOptions] === option.value
                        ? 'bg-luxury-gold text-black border-luxury-gold'
                        : 'border-gray-600 text-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileSearchFilter;
