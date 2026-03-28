import React from 'react';
import { motion } from 'framer-motion';
import { Film } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative group h-full"
    >
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-video h-full flex items-center justify-center">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <Film className="w-12 h-12 text-zinc-700 animate-pulse" />
            <div className="space-y-2">
              <p className="text-zinc-500 font-medium">Video rendering...</p>
              <p className="text-xs text-zinc-600">This takes a minute, we'll update it when ready!</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
