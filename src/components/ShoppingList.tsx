import React, { useState } from 'react';
import { Product } from '../../shared/types';
import { ExternalLink, ShoppingBag, Plus, Filter, Sliders, Search } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

interface ShoppingListProps {
  products: Product[];
}

const getCategoryEmoji = (category: string): string => {
  const emojiMap: Record<string, string> = {
    'Lighting': '💡',
    'Bedding': '🛏️',
    'Desk': '🪑',
    'Wall Decor': '🖼️',
    'Storage': '📦',
    'Plants': '🌱',
    'Textiles': '🧶',
    'Tech': '📱',
  };
  return emojiMap[category] || '🛍️';
};

const parsePrice = (priceRange: string): number => {
  const match = priceRange.match(/\$[\d]+/);
  if (!match || !match[0]) return 0;
  return parseInt(match[0].replace('$', ''), 10);
};

const getShoppingLinks = (product: Product, isInternational: boolean) => {
  if (isInternational) {
    return [
      {
        label: 'Amazon',
        url: `https://www.amazon.com/s?k=${encodeURIComponent(product.searchQuery)}`,
      },
      {
        label: 'IKEA',
        url: `https://www.ikea.com/us/en/search/?q=${encodeURIComponent(product.searchQuery)}`,
      },
    ];
  } else {
    return [
      {
        label: 'Taobao',
        url: `https://s.taobao.com/search?q=${encodeURIComponent(product.searchQuery)}`,
      },
      {
        label: 'Pinduoduo',
        url: `https://mobile.pinduoduo.com/search?keyword=${encodeURIComponent(product.searchQuery)}`,
      },
    ];
  }
};

const ShoppingList: React.FC<ShoppingListProps> = ({ products }) => {
  const { addToCart, cartItems, isInternational } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'category'>('name');

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        return parsePrice(a.priceRange) - parsePrice(b.priceRange);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.category.localeCompare(b.category);
      }
    });

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: `${product.name}-${Date.now()}`,
      name: product.name,
      category: product.category,
      price: parsePrice(product.priceRange),
      image: getCategoryEmoji(product.category),
    };
    addToCart(cartItem);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      {/* Filters and Sorting */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-teal-400 text-sm"
            />
          </div>
          
          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-teal-400 text-sm appearance-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sorting */}
          <div className="relative">
            <Sliders className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-500 w-4 h-4" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'category')}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white focus:outline-none focus:border-teal-400 text-sm appearance-none"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-teal-500/10 text-teal-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-teal-500/20">
                  {product.category}
                </span>
                <span className="text-zinc-500 font-medium text-sm">{product.priceRange}</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">{getCategoryEmoji(product.category)}</span>
                <h3 className="text-lg font-bold text-white group-hover:text-teal-400 transition-colors">
                  {product.name}
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => handleAddToCart(product)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-teal-500 hover:bg-teal-400 text-black rounded-xl text-sm font-bold transition-all"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                {getShoppingLinks(product, isInternational).map((link, linkIdx) => (
                  <a
                    key={linkIdx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      linkIdx === 0 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                        : 'border border-zinc-800 hover:border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {linkIdx === 0 ? (
                      <ShoppingBag className="w-4 h-4" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-12 text-center">
          <ShoppingBag className="w-16 h-16 mx-auto text-zinc-600 mb-4" />
          <h3 className="text-xl font-bold mb-2">No products found</h3>
          <p className="text-zinc-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default ShoppingList;
