import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Loader2, ImagePlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

interface MoodBoardProps {
  imageUrl?: string;
  vibeName: string;
}

const TRAE_API_BASE = 'https://coreva-normal.trae.ai/api/ide/v1/text_to_image';

const MoodBoard: React.FC<MoodBoardProps> = ({ imageUrl, vibeName }) => {
  const { customImageUrl, setCustomImageUrl, isCustomizing, setIsCustomizing, generatedContent } = useStore();
  const [customizationPrompt, setCustomizationPrompt] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);

  const displayImageUrl = customImageUrl || imageUrl;

  const handleCustomize = async () => {
    if (!customizationPrompt.trim()) {
      toast.error('Please enter a customization prompt');
      return;
    }

    setIsGeneratingCustom(true);
    setIsCustomizing(true);
    setShowLoadingOverlay(true);

    try {
      const originalPrompt = generatedContent?.imagePrompt || vibeName;
      const combinedPrompt = `${originalPrompt}, ${customizationPrompt}`;
      const encodedPrompt = encodeURIComponent(combinedPrompt);
      const newImageUrl = `${TRAE_API_BASE}?prompt=${encodedPrompt}&image_size=landscape_16_9`;
      
      setTimeout(() => {
        setCustomImageUrl(newImageUrl);
        setIsGeneratingCustom(false);
        setShowLoadingOverlay(false);
        toast.success('New image generated with your customization!');
      }, 3000);
      
    } catch (error) {
      console.error('Customization error:', error);
      setIsGeneratingCustom(false);
      setShowLoadingOverlay(false);
      toast.error('Failed to generate customized image');
    }
  };

  const handleDownload = async () => {
    if (!displayImageUrl) return;

    try {
      const response = await fetch(displayImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dormvibe-${vibeName.toLowerCase().replace(/\s+/g, '-')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const handleResetToOriginal = () => {
    setCustomImageUrl(null);
    setCustomizationPrompt('');
    toast.info('Reset to original image');
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showLoadingOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-16 h-16 text-teal-400" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mt-4">Generating your customized room...</h3>
            <p className="text-zinc-400 mt-2">Incorporating: "{customizationPrompt}"</p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-teal-500/20 rounded-[2rem] blur-2xl group-hover:bg-teal-500/30 transition-all" />
          <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-video">
            {displayImageUrl ? (
              <img
                src={displayImageUrl}
                alt={vibeName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 italic">
                Mood board loading...
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleDownload}
            disabled={!displayImageUrl}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 border border-zinc-700 text-white rounded-xl font-medium hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            Download Image
          </button>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-500/20 rounded-xl flex items-center justify-center">
              <ImagePlus className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <h3 className="text-white font-bold">Further Customize</h3>
              <p className="text-zinc-400 text-sm">Add more details to generate a new room design</p>
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={customizationPrompt}
              onChange={(e) => setCustomizationPrompt(e.target.value)}
              placeholder="e.g., add a dog, more plants, warmer lighting, study desk..."
              className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:border-teal-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleCustomize()}
            />
            <button
              onClick={handleCustomize}
              disabled={isGeneratingCustom || !customizationPrompt.trim()}
              className="px-6 py-3 bg-teal-500 text-white rounded-xl font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGeneratingCustom ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Generate New
                </>
              )}
            </button>
          </div>

          {customImageUrl && (
            <button
              onClick={handleResetToOriginal}
              className="mt-3 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              ← Reset to original image
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MoodBoard;