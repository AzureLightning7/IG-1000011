import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VibeQuiz from "./pages/VibeQuiz";
import LoadingScreen from "./pages/LoadingScreen";
import ResultsPage from "./pages/ResultsPage";
import { useState } from "react";
import { ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "./store/useStore";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  eco: number;
  image: string;
}

const products: Product[] = [
  { id: '1', name: 'Modern Bed Frame - Walnut', category: 'bed', price: 299, rating: 4.7, reviews: 234, eco: 92, image: '🛏️' },
  { id: '2', name: 'Ergonomic Standing Desk - Bamboo', category: 'desk', price: 249, rating: 4.8, reviews: 412, eco: 88, image: '🪑' },
  { id: '3', name: 'Premium Mesh Office Chair', category: 'chair', price: 179, rating: 4.5, reviews: 567, eco: 75, image: '💺' },
  { id: '4', name: 'Sliding Door Wardrobe - Light Grey', category: 'wardrobe', price: 399, rating: 4.6, reviews: 189, eco: 85, image: '🚪' },
  { id: '5', name: 'Modular Bookshelf System', category: 'shelf', price: 129, rating: 4.4, reviews: 298, eco: 90, image: '📚' },
  { id: '6', name: 'Smart LED Floor Lamp', category: 'lighting', price: 79, rating: 4.3, reviews: 432, eco: 95, image: '💡' },
  { id: '7', name: 'Eco-Friendly Wool Rug - Natural', category: 'rug', price: 99, rating: 4.7, reviews: 156, eco: 98, image: '🧶' },
  { id: '8', name: 'Succulent Plant Set (3 pcs)', category: 'decor', price: 59, rating: 4.5, reviews: 267, eco: 99, image: '🌱' },
  { id: '9', name: 'Storage Ottoman - Velvet', category: 'storage', price: 89, rating: 4.2, reviews: 145, eco: 70, image: '🛋️' },
  { id: '10', name: 'Round Wall Mirror - Gold Frame', category: 'decor', price: 79, rating: 4.6, reviews: 198, eco: 80, image: '🪞' },
];

const categories = ['all', 'bed', 'desk', 'chair', 'wardrobe', 'shelf', 'lighting', 'rug', 'decor', 'storage'];

function MarketplaceButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [showCart, setShowCart] = useState(false);
  
  const { cartItems, addToCart: storeAddToCart, removeFromCart: storeRemoveFromCart } = useStore();

  const filtered = products.filter(p => 
    (cat === 'all' || p.category === cat) && 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    storeAddToCart({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    storeRemoveFromCart(id);
    toast.info('Item removed from cart');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors shadow-lg"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Marketplace</span>
        {cartItems.length > 0 && (
          <span className="bg-white text-teal-500 text-xs font-bold px-2 py-0.5 rounded-full">
            {cartItems.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Campus Marketplace</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="mb-6">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search furniture..."
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-teal-500 outline-none"
            />
          </div>

          <div className="flex gap-2 mb-6 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                  cat === c 
                    ? 'bg-teal-500 text-white' 
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-slate-700/50 border border-slate-600 rounded-xl overflow-hidden hover:border-teal-500 transition-colors">
                <div className="aspect-square bg-slate-600 flex items-center justify-center text-5xl">
                  {p.image}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-teal-400">${p.price}</span>
                    <span className="text-green-400 text-xs">🌱 {p.eco}%</span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="w-full py-2 bg-teal-500 text-white rounded-lg font-medium text-sm hover:bg-teal-600 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCart && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center" onClick={() => setShowCart(false)}>
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Shopping Cart</h3>
              <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-3 p-3 bg-slate-700 rounded-xl">
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{item.name}</h4>
                        <p className="text-slate-400 text-sm">${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-600 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">Total</span>
                    <span className="text-xl font-bold text-white">${cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => toast.success('Checkout coming soon! This is a demo.')}
                    className="w-full py-3 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-teal-500/30">
        <MarketplaceButton />
        <Routes>
          <Route path="/" element={<VibeQuiz />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
