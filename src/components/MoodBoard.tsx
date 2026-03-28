import React from 'react';
import { motion } from 'framer-motion';

interface MoodBoardProps {
  imageUrl?: string;
  vibeName: string;
}

const MoodBoard: React.FC<MoodBoardProps> = ({ imageUrl, vibeName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group"
    >
      <div className="absolute -inset-1 bg-teal-500/20 rounded-[2rem] blur-2xl group-hover:bg-teal-500/30 transition-all" />
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-video">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={vibeName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 italic">
            Mood board loading...
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MoodBoard;
