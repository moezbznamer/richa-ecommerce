
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
  searchQuery: string;
  filters: FilterOptions;
}

export interface FilterOptions {
  gender: string;
  product_type: string;
  minPrice: number;
  maxPrice: number;
  size: string;
  color: string;
  brand: string;
}

const SearchAndFilter = ({ onSearch, onFilter, searchQuery, filters }: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);

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
    if (localFilters.gender) active.push({ key: 'gender', label: `Catégorie: ${localFilters.gender}`, value: localFilters.gender });
    if (localFilters.product_type) active.push({ key: 'product_type', label: `Type: ${localFilters.product_type}`, value: localFilters.product_type });
    if (localFilters.size) active.push({ key: 'size', label: `Taille: ${localFilters.size}`, value: localFilters.size });
    if (localFilters.color) active.push({ key: 'color', label: `Couleur: ${localFilters.color}`, value: localFilters.color });
    if (localFilters.brand) active.push({ key: 'brand', label: `Marque: ${localFilters.brand}`, value: localFilters.brand });
    if (localFilters.minPrice > 0 || localFilters.maxPrice < 1000) {
      active.push({ key: 'price', label: `Prix: ${localFilters.minPrice} DT - ${localFilters.maxPrice} DT`, value: 'price' });
    }
    return active;
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="w-full space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="Rechercher des produits, marques, catégories..."
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          className="luxury-search pl-12 pr-16 h-12 text-white placeholder-gray-400"
        />
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-luxury-gold text-black hover:bg-luxury-gold/90 h-8 px-3"
        >
          <Filter className="w-4 h-4 mr-1" />
          Filtres
        </Button>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-luxury-card/50 rounded-lg border border-luxury-gold/20">
          <span className="text-sm text-gray-300 mr-2">Filtres actifs:</span>
          {activeFilters.map((filter) => (
            <div
              key={filter.key}
              className="flex items-center gap-1 bg-luxury-gold text-black px-3 py-1 rounded-full text-sm"
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
          <Button
            onClick={clearFilters}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white text-xs"
          >
            Réinitialiser tout
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-luxury-card rounded-lg p-6 border border-luxury-gold/20"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-luxury-gold font-semibold text-lg">Filtres</h3>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-gray-300 border-gray-600 hover:bg-gray-700"
                >
                  Tout effacer
                </Button>
                <Button
                  onClick={() => setShowFilters(false)}
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Catégorie</label>
                <select
                  value={localFilters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full bg-luxury-black border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                >
                  <option value="">Toutes</option>
                  <option value="man">Homme</option>
                  <option value="woman">Femme</option>
                  <option value="boy">Garçon</option>
                  <option value="girl">Fille</option>
                </select>
              </div>

              {/* Product Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type de vêtement</label>
                <select
                  value={localFilters.product_type}
                  onChange={(e) => handleFilterChange('product_type', e.target.value)}
                  className="w-full bg-luxury-black border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                >
                  <option value="">Tous les types</option>
                  <option value="T-Shirts">T-Shirts</option>
                  <option value="Jeans">Jeans</option>
                  <option value="Robes">Robes</option>
                  <option value="Manteaux">Manteaux</option>
                  <option value="Chaussures">Chaussures</option>
                  <option value="Accessoires">Accessoires</option>
                </select>
              </div>

              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Taille</label>
                <select
                  value={localFilters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  className="w-full bg-luxury-black border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                >
                  <option value="">Toutes les tailles</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="XXL">XXL</option>
                </select>
              </div>

              {/* Color Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Couleur</label>
                <select
                  value={localFilters.color}
                  onChange={(e) => handleFilterChange('color', e.target.value)}
                  className="w-full bg-luxury-black border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
                >
                  <option value="">Toutes les couleurs</option>
                  <option value="Noir">Noir</option>
                  <option value="Blanc">Blanc</option>
                  <option value="Rouge">Rouge</option>
                  <option value="Bleu">Bleu</option>
                  <option value="Vert">Vert</option>
                  <option value="Jaune">Jaune</option>
                  <option value="Rose">Rose</option>
                  <option value="Gris">Gris</option>
                </select>
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Gamme de prix: {priceRange[0]} DT - {priceRange[1]} DT
              </label>
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

            {/* Brand Filter */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">Marque</label>
              <select
                value={localFilters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
                className="w-full bg-luxury-black border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-luxury-gold focus:border-luxury-gold"
              >
                <option value="">Toutes les marques</option>
                <option value="RICHA">RICHA</option>
              </select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchAndFilter;
