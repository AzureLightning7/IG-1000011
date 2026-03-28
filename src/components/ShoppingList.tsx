import React from 'react';
import { Product } from '../../shared/types';
import { ExternalLink, ShoppingBag, Plus } from 'lucide-react';
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

const ShoppingList: React.FC<ShoppingListProps> = ({ products }) => {
  const { addToCart, cartItems } = useStore();

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, idx) => (
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
          
          <h3 className="text-lg font-bold text-white mb-6 group-hover:text-teal-400 transition-colors">
            {product.name}
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => handleAddToCart(product)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-teal-500 hover:bg-teal-400 text-black rounded-xl text-sm font-bold transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Add to Cart
            </button>
            <a
              href={`https://www.amazon.com/s?k=${encodeURIComponent(product.searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm font-bold transition-all"
            >
              <ShoppingBag className="w-4 h-4" /> Amazon
            </a>
            <a
              href={`https://www.ikea.com/us/en/search/?q=${encodeURIComponent(product.searchQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 border border-zinc-800 hover:border-zinc-700 text-zinc-400 rounded-xl text-sm font-bold transition-all"
            >
              <ExternalLink className="w-4 h-4" /> IKEA
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShoppingList;
