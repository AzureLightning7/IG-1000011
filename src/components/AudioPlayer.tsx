import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  label: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, label }) => {
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
        <Volume2 className="w-4 h-4 text-zinc-500" />
      </div>
      
      {audioUrl ? (
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-teal-500 text-black rounded-full hover:scale-105 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
          </button>
          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className={`h-full bg-teal-500 ${isPlaying ? 'w-full transition-all duration-[30s] ease-linear' : 'w-0'}`} />
          </div>
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      ) : (
        <div className="h-12 flex items-center text-zinc-600 text-sm italic">
          Recording walkthrough...
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
