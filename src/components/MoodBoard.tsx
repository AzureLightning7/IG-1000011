import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

interface MoodBoardProps {
  imageUrl?: string;
  vibeName: string;
}

const MoodBoard: React.FC<MoodBoardProps> = ({ imageUrl, vibeName }) => {
  const { customImageUrl, setCustomImageUrl } = useStore();

  const displayImageUrl = customImageUrl || imageUrl;

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
    toast.info('Reset to original image');
  };

  return (
    <div className="relative">
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

        {customImageUrl && (
          <button
            onClick={handleResetToOriginal}
            className="mt-3 text-sm text-zinc-400 hover:text-white transition-colors"
          >
            ← Reset to original image
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default MoodBoard;