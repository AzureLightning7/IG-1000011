import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, RefreshCw, Palette, Layout, Sparkles } from 'lucide-react';
import MoodBoard from '../components/MoodBoard';
import { toast } from 'sonner';

const CustomizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedContent, mediaContent, reset, setCustomImageUrl } = useStore();
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
    if (!generatedContent) {
      navigate('/');
    }
  }, [generatedContent, navigate]);

  const handleNext = () => {
    navigate('/purchase');
  };

  const handleBack = () => {
    navigate('/');
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
            Customize Your Vibe
          </span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{generatedContent.vibeName}</h1>
          <p className="text-xl text-zinc-400 leading-relaxed">
            {generatedContent.description}
          </p>
        </motion.div>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-24">
        {/* Mood Board */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">🖼️ Mood Board</h2>
          <MoodBoard imageUrl={mediaContent.imageUrl} vibeName={generatedContent.vibeName} />
        </section>

        {/* Customization Tools */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            ✨ Customization Tools
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Color Palette Customization */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-teal-400" />
                <h3 className="text-xl font-bold">Color Palette</h3>
              </div>
              <p className="text-zinc-400 mb-6">Adjust the color scheme to match your preferences</p>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { color: '#2dd4bf', name: 'Teal' },
                    { color: '#f97316', name: 'Orange' },
                    { color: '#8b5cf6', name: 'Purple' },
                    { color: '#3b82f6', name: 'Blue' },
                    { color: '#10b981', name: 'Green' }
                  ].map(({ color, name }, idx) => (
                    <div key={idx} className="relative group">
                      <button
                        className="w-full aspect-square rounded-full border-2 border-zinc-700 hover:border-teal-400 transition-all"
                        style={{ backgroundColor: color }}
                        onClick={() => toast.success(`${name} color scheme selected`)} // Placeholder for actual functionality
                      />
                      <span className="absolute -bottom-6 left-0 right-0 text-center text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Custom Color</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      defaultValue="#2dd4bf"
                      className="w-12 h-12 rounded-full cursor-pointer bg-transparent border-none"
                      onChange={(e) => toast.info(`Custom color selected: ${e.target.value}`)}
                    />
                    <input
                      type="text"
                      defaultValue="#2dd4bf"
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
                      onChange={(e) => toast.info(`Custom color entered: ${e.target.value}`)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Layout Customization */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Layout className="w-6 h-6 text-teal-400" />
                <h3 className="text-xl font-bold">Layout</h3>
              </div>
              <p className="text-zinc-400 mb-6">Rearrange furniture and optimize space</p>
              <div className="space-y-6">
                {[
                  { name: 'Standard Layout', description: 'Balanced setup with bed, desk, and storage' },
                  { name: 'Compact Layout', description: 'Space-saving design for smaller rooms' },
                  { name: 'Open Layout', description: 'Spacious arrangement with flexible zones' }
                ].map((layout, idx) => (
                  <div key={idx} className="group">
                    <button
                      className="w-full flex flex-col items-start p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700 hover:border-teal-400"
                      onClick={() => toast.success(`${layout.name} selected`)} // Placeholder for actual functionality
                    >
                      <h4 className="font-bold mb-1 group-hover:text-teal-400 transition-colors">{layout.name}</h4>
                      <p className="text-sm text-zinc-400">{layout.description}</p>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Style Customization */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-teal-400" />
                <h3 className="text-xl font-bold">Style</h3>
              </div>
              <p className="text-zinc-400 mb-6">Refine the overall aesthetic of your room</p>
              <div className="space-y-6">
                {[
                  { name: 'Modern Minimalist', emoji: '📱', description: 'Clean lines and neutral tones' },
                  { name: 'Cozy Bohemian', emoji: '🧶', description: 'Warm textures and vibrant accents' },
                  { name: 'Industrial Chic', emoji: '🔧', description: 'Exposed elements and raw materials' }
                ].map((style, idx) => (
                  <div key={idx} className="group">
                    <button
                      className="w-full flex items-center gap-4 p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-all border border-zinc-700 hover:border-teal-400"
                      onClick={() => toast.success(`${style.name} style selected`)} // Placeholder for actual functionality
                    >
                      <span className="text-2xl">{style.emoji}</span>
                      <div>
                        <h4 className="font-bold group-hover:text-teal-400 transition-colors">{style.name}</h4>
                        <p className="text-sm text-zinc-400">{style.description}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Layout Tips */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">📐 Layout Tips</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <ul className="space-y-4">
              {generatedContent.layoutTips.map((tip, i) => (
                <li key={i} className="flex gap-4 text-zinc-300">
                  <span className="text-teal-500 font-bold">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-zinc-800">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-zinc-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Quiz
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
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-4 bg-teal-500 text-black rounded-2xl hover:bg-teal-400 transition-all font-bold shadow-[0_0_30px_rgba(45,212,191,0.2)]"
          >
            Continue to Shopping
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default CustomizationPage;