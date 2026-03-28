import React, { useState, useRef } from 'react';
import { Music, Play, Pause } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl?: string;
  label: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ musicUrl, label }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
        <Music className="w-4 h-4 text-zinc-500" />
      </div>
      
      {musicUrl ? (
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-teal-500 text-black rounded-full hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <div className="flex-1">
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden mb-1">
              <div className={`h-full bg-teal-500 ${isPlaying ? 'w-full transition-all duration-[30s] ease-linear' : 'w-0'}`} />
            </div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Ambient Mix</span>
          </div>
          <audio
            ref={audioRef}
            src={musicUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="h-12 flex items-center text-zinc-600 text-sm italic">
          Composing track...
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
