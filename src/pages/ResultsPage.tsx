import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { RefreshCw, Share2 } from 'lucide-react';
import InteractiveRoomDisplay from '../components/InteractiveRoomDisplay';
import AudioPlayer from '../components/AudioPlayer';
import ShoppingList from '../components/ShoppingList';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedContent, mediaContent, reset } = useStore();

  useEffect(() => {
    if (!generatedContent) {
      navigate('/');
    }
  }, [generatedContent, navigate]);

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
            Your Custom DormVibe
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{generatedContent.vibeName}</h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            {generatedContent.description}
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Interactive Room Display */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🖼️ Interactive Room Display</h2>
          <InteractiveRoomDisplay 
            imageUrl={mediaContent.imageUrl} 
            vibeName={generatedContent.vibeName} 
            products={generatedContent.products} 
          />
        </section>

        {/* Vibe Guide & Audio */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              ✨ Your Vibe Guide
            </h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
              <div>
                <h3 className="text-teal-400 font-bold uppercase text-xs tracking-wider mb-4">Layout Tips</h3>
                <ul className="space-y-4">
                  {generatedContent.layoutTips.map((tip, i) => (
                    <li key={i} className="flex gap-4 text-zinc-300">
                      <span className="text-teal-500 font-bold">{i + 1}.</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🎧 Audio Guide</h2>
            <AudioPlayer audioUrl={mediaContent.audioUrl} label="Walkthrough Script" />
          </section>
        </div>

        {/* Shopping List */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            🛒 Essentials Shopping List
          </h2>
          <ShoppingList products={generatedContent.products} />
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12 border-t border-zinc-800">
          <button
            onClick={() => {
              reset();
              navigate('/');
            }}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-zinc-300"
          >
            <RefreshCw className="w-5 h-5" /> Start Over
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-teal-500 text-black rounded-2xl hover:bg-teal-400 transition-all font-bold shadow-[0_0_30px_rgba(45,212,191,0.2)]">
            <Share2 className="w-5 h-5" /> Share My Vibe
          </button>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
