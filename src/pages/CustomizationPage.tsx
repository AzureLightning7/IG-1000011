import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, RefreshCw, Palette, Layout, Sparkles, ImagePlus, Loader2 } from 'lucide-react';
import MoodBoard from '../components/MoodBoard';
import { toast } from 'sonner';

const CustomizationPage: React.FC = () => {
  const navigate = useNavigate();
  const { generatedContent, mediaContent, reset, setCustomImageUrl, customization, setCustomization, customImageUrl, setIsCustomizing, quizData, setGeneratedContent } = useStore();
  const [customizationPrompt, setCustomizationPrompt] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const handleCustomize = async () => {
    const currentImageUrl = customImageUrl || mediaContent.imageUrl;
    if (!currentImageUrl) {
      toast.error('No image to customize');
      return;
    }

    // Check if any customization options are selected
    const hasColor = customization.color && customization.color !== '#2dd4bf';
    const hasLayout = customization.layout && customization.layout !== 'Standard Layout';
    const hasStyle = customization.style && customization.style !== 'Modern Minimalist';
    const hasPrompt = customizationPrompt.trim().length > 0;

    if (!hasColor && !hasLayout && !hasStyle && !hasPrompt) {
      toast.error('Please select at least one customization option or enter a custom prompt');
      return;
    }

    setIsGeneratingCustom(true);
    setIsCustomizing(true);
    setShowLoadingOverlay(true);

    try {
      const response = await fetch('/api/customize-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          originalImageUrl: currentImageUrl,
          customizationPrompt: customizationPrompt,
          vibeName: generatedContent?.vibeName || 'Custom',
          color: hasColor ? customization.color : undefined,
          layout: hasLayout ? customization.layout : undefined,
          style: hasStyle ? customization.style : undefined,
          quizData: quizData
        })
      });

      const result = await response.json();

      if (result.success) {
        setCustomImageUrl(result.newImageUrl);
        
        // Update generated content if provided
        if (result.updatedContent) {
          setGeneratedContent(result.updatedContent);
        }
        
        toast.success('New room design generated with your customization!');
      } else {
        throw new Error(result.message || 'Failed to generate customized image');
      }
      
    } catch (error) {
      console.error('Customization error:', error);
      toast.error('Failed to generate customized image');
    } finally {
      setIsGeneratingCustom(false);
      setShowLoadingOverlay(false);
    }
  };

  const handleResetToOriginal = () => {
    setCustomImageUrl(null);
    setCustomizationPrompt('');
    toast.info('Reset to original design');
  };

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
    <div className="min-h-screen bg-[#0a0a0a] pb-24 relative">
      <AnimatePresence>
        {showLoadingOverlay && (
          <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 className="w-16 h-16 text-teal-400" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mt-4">Creating your customized room...</h3>
                <p className="text-zinc-400 mt-2">Generating new design and details...</p>
              </motion.div>
        )}
      </AnimatePresence>
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

        {/* Customization Tools */}
        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            ✨ Customize Your Room
          </h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8">
            <p className="text-zinc-400 mb-8">Select options below, add your own details, or combine both to generate a new room design</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Color Palette Customization */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Palette className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold">Color Palette</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { color: '#2dd4bf', name: 'Teal' },
                      { color: '#f97316', name: 'Orange' },
                      { color: '#8b5cf6', name: 'Purple' },
                      { color: '#3b82f6', name: 'Blue' },
                      { color: '#10b981', name: 'Green' }
                    ].map(({ color, name }, idx) => (
                      <div key={idx} className="relative group">
                        <button
                          className={`w-full aspect-square rounded-full border-2 transition-all ${customization.color === color ? 'border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.5)]' : 'border-zinc-700 hover:border-teal-400'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setCustomization('color', color);
                            toast.success(`${name} color scheme selected`);
                          }}
                        />
                        <span className={`absolute -bottom-5 left-0 right-0 text-center text-xs transition-colors ${customization.color === color ? 'text-teal-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                          {name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8">
                    <label className="block text-xs font-medium text-zinc-500 mb-2">Custom Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={customization.color}
                        className="w-10 h-10 rounded-full cursor-pointer bg-transparent border-none"
                        onChange={(e) => {
                          setCustomization('color', e.target.value);
                          toast.info(`Custom color selected: ${e.target.value}`);
                        }}
                      />
                      <input
                        type="text"
                        value={customization.color}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-400"
                        onChange={(e) => {
                          setCustomization('color', e.target.value);
                          toast.info(`Custom color entered: ${e.target.value}`);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Layout Customization */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Layout className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold">Layout</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Standard Layout', description: 'Balanced setup with bed, desk, and storage' },
                    { name: 'Compact Layout', description: 'Space-saving design for smaller rooms' },
                    { name: 'Open Layout', description: 'Spacious arrangement with flexible zones' }
                  ].map((layout, idx) => (
                    <div key={idx} className="group">
                      <button
                        className={`w-full flex flex-col items-start p-3 rounded-lg transition-all border ${customization.layout === layout.name ? 'bg-zinc-800/80 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 hover:border-teal-400'}`}
                        onClick={() => {
                          setCustomization('layout', layout.name);
                          toast.success(`${layout.name} selected`);
                        }}
                      >
                        <h4 className={`font-bold text-sm mb-0.5 transition-colors ${customization.layout === layout.name ? 'text-teal-400' : 'group-hover:text-teal-400'}`}>{layout.name}</h4>
                        <p className="text-xs text-zinc-400">{layout.description}</p>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style Customization */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <h3 className="font-bold">Style</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { name: 'Modern Minimalist', emoji: '📱', description: 'Clean lines and neutral tones' },
                    { name: 'Cozy Bohemian', emoji: '🧶', description: 'Warm textures and vibrant accents' },
                    { name: 'Industrial Chic', emoji: '🔧', description: 'Exposed elements and raw materials' }
                  ].map((style, idx) => (
                    <div key={idx} className="group">
                      <button
                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all border ${customization.style === style.name ? 'bg-zinc-800/80 border-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.2)]' : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 hover:border-teal-400'}`}
                        onClick={() => {
                          setCustomization('style', style.name);
                          toast.success(`${style.name} style selected`);
                        }}
                      >
                        <span className="text-xl">{style.emoji}</span>
                        <div>
                          <h4 className={`font-bold text-sm transition-colors ${customization.style === style.name ? 'text-teal-400' : 'group-hover:text-teal-400'}`}>{style.name}</h4>
                          <p className="text-xs text-zinc-400">{style.description}</p>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Prompt Section */}
            <div className="border-t border-zinc-800 pt-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-teal-500/20 rounded-lg flex items-center justify-center">
                  <ImagePlus className="w-4 h-4 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Add Your Own Details</h3>
                  <p className="text-zinc-400 text-sm">Optional: Add specific elements to include in your room</p>
                </div>
              </div>

              <div className="flex gap-4">
                <input
                  type="text"
                  value={customizationPrompt}
                  onChange={(e) => setCustomizationPrompt(e.target.value)}
                  placeholder="e.g., add a dog, more plants, warmer lighting, study desk..."
                  className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-teal-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomize()}
                />
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                onClick={handleCustomize}
                disabled={isGeneratingCustom}
                className="w-full sm:w-auto px-8 py-4 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400 transition-all shadow-[0_0_30px_rgba(45,212,191,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGeneratingCustom ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate New Room Design
                  </>
                )}
              </button>
              
              {customImageUrl && (
                <button
                  onClick={handleResetToOriginal}
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  ← Reset to original design
                </button>
              )}
            </div>
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