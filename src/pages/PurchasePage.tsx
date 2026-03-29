import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, ShoppingBag, Truck, Package, Heart } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import ShoppingList from '../components/ShoppingList';
import { toast } from 'sonner';

const PurchasePage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedContent, mediaContent, reset, cartItems } = useStore();
  const [activeTab, setActiveTab] = useState<'essentials' | 'marketplace' | 'freecycling'>('essentials');

  useEffect(() => {
    if (!generatedContent) {
      navigate('/');
    }
  }, [generatedContent, navigate]);

  const handleBack = () => {
    navigate('/customization');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (!generatedContent) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <header className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4 block">
            Bring Your Vibe To Life
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{generatedContent.vibeName}</h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            Shop for the perfect items to create your ideal space
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Audio Guide */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🎧 Audio Guide</h2>
          <AudioPlayer audioUrl={mediaContent.audioUrl} label="Shopping Guide" />
        </section>

        {/* Shopping Tabs */}
        <section>
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveTab('essentials')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'essentials' ? 'bg-teal-500 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'}`}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Essentials
              </span>
            </button>
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'marketplace' ? 'bg-teal-500 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'}`}
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Marketplace
              </span>
            </button>
            <button
              onClick={() => setActiveTab('freecycling')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'freecycling' ? 'bg-teal-500 text-black' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800'}`}
            >
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Freecycling
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
            {activeTab === 'essentials' && (
              <div>
                <h3 className="text-xl font-bold mb-6">Curated Shopping List</h3>
                <ShoppingList products={generatedContent.products} />
              </div>
            )}

            {activeTab === 'marketplace' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Campus Marketplace</h3>
                <p className="text-zinc-400">Buy and sell items with other students on campus</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                    <Package className="w-12 h-12 mx-auto text-teal-400 mb-4" />
                    <h4 className="font-bold mb-2">Buy From Students</h4>
                    <p className="text-zinc-500 text-sm mb-4">Browse unique items from other students</p>
                    <button 
                      onClick={() => {
                        const marketplaceBtn = document.querySelector('[data-marketplace-btn]') as HTMLButtonElement;
                        if (marketplaceBtn) marketplaceBtn.click();
                      }}
                      className="px-4 py-2 bg-teal-500 text-black rounded-lg font-bold text-sm hover:bg-teal-400"
                    >
                      Open Marketplace
                    </button>
                  </div>
                  <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                    <Package className="w-12 h-12 mx-auto text-teal-400 mb-4" />
                    <h4 className="font-bold mb-2">Sell Your Items</h4>
                    <p className="text-zinc-500 text-sm mb-4">List your gently used dorm items for sale</p>
                    <button 
                      onClick={() => {
                        const marketplaceBtn = document.querySelector('[data-marketplace-btn]') as HTMLButtonElement;
                        if (marketplaceBtn) marketplaceBtn.click();
                      }}
                      className="px-4 py-2 bg-teal-500 text-black rounded-lg font-bold text-sm hover:bg-teal-400"
                    >
                      Sell Item
                    </button>
                  </div>
                  <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                    <Package className="w-12 h-12 mx-auto text-teal-400 mb-4" />
                    <h4 className="font-bold mb-2">Local Pickup</h4>
                    <p className="text-zinc-500 text-sm">Easy pickup options on campus</p>
                  </div>
                </div>
                <p className="text-zinc-500 text-sm text-center">
                  💡 Tip: Click the floating "Marketplace" button in the bottom right corner to browse & sell items!
                </p>
              </div>
            )}

            {activeTab === 'freecycling' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Freecycling</h3>
                <p className="text-zinc-400">Find free items from students moving out</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                    <Heart className="w-12 h-12 mx-auto text-teal-400 mb-4" />
                    <h4 className="font-bold mb-2">Get Free Items</h4>
                    <p className="text-zinc-500 text-sm mb-4">Browse items students are giving away</p>
                    <button 
                      onClick={() => {
                        const marketplaceBtn = document.querySelector('[data-marketplace-btn]') as HTMLButtonElement;
                        if (marketplaceBtn) marketplaceBtn.click();
                      }}
                      className="px-4 py-2 bg-green-500 text-black rounded-lg font-bold text-sm hover:bg-green-400"
                    >
                      Browse Free Items
                    </button>
                  </div>
                  <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                    <Heart className="w-12 h-12 mx-auto text-teal-400 mb-4" />
                    <h4 className="font-bold mb-2">Give Away</h4>
                    <p className="text-zinc-500 text-sm mb-4">List items you no longer need</p>
                    <button 
                      onClick={() => {
                        const marketplaceBtn = document.querySelector('[data-marketplace-btn]') as HTMLButtonElement;
                        if (marketplaceBtn) marketplaceBtn.click();
                      }}
                      className="px-4 py-2 bg-green-500 text-black rounded-lg font-bold text-sm hover:bg-green-400"
                    >
                      List for Free
                    </button>
                  </div>
                  <div className="bg-zinc-800 rounded-2xl p-6 text-center">
                    <Heart className="w-12 h-12 mx-auto text-teal-400 mb-4" />
                    <h4 className="font-bold mb-2">Sustainable</h4>
                    <p className="text-zinc-500 text-sm">Reduce waste and help the environment</p>
                  </div>
                </div>
                <p className="text-zinc-500 text-sm text-center">
                  💡 Tip: Click the floating "Marketplace" button in the bottom right corner, then switch to "Recycle (Free)" tab!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              🛒 Your Cart ({cartItems.length} items)
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{item.image}</span>
                      <div>
                        <h4 className="font-bold">{item.name}</h4>
                        <p className="text-zinc-500 text-sm">{item.category}</p>
                      </div>
                    </div>
                    <span className="font-bold">${item.price.toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-zinc-800 flex items-center justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-zinc-800">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-zinc-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Customization
          </button>
          <button
            onClick={() => {
              reset();
              navigate('/');
            }}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-zinc-300"
          >
            <RefreshCw className="w-5 h-5" />
            Start Over
          </button>
          <button
            onClick={handleCheckout}
            className="flex items-center gap-2 px-8 py-4 bg-teal-500 text-black rounded-2xl hover:bg-teal-400 transition-all font-bold shadow-[0_0_30px_rgba(45,212,191,0.2)] disabled:opacity-50"
          >
            <Truck className="w-5 h-5" />
            Proceed to Checkout
          </button>
        </div>
      </main>
    </div>
  );
};

export default PurchasePage;