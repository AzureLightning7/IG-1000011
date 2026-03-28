import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl?: string;
  label: string;
  narrationScript?: string;
  onAudioGenerated?: (audioUrl: string) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, label, narrationScript, onAudioGenerated }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const generateAudio = async () => {
    if (!narrationScript || isGenerating) return;

    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ narrationScript }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.audioUrl && onAudioGenerated) {
          onAudioGenerated(data.audioUrl);
        } else {
          setError('Failed to generate audio, please try again');
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to generate audio:', errorData);
        setError(errorData.error || 'Failed to generate audio, please try again');
      }
    } catch (error) {
      console.error('Error generating audio:', error);
      setError('Failed to generate audio, please try again');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-zinc-400 text-sm font-medium">{label}</span>
        <button onClick={toggleMute} className="w-4 h-4 text-zinc-500">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
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
        <div className="space-y-4">
          {error ? (
            <div className="h-12 flex items-center text-red-500 text-sm">
              {error}
            </div>
          ) : (
            <div className="h-12 flex items-center text-zinc-600 text-sm">
              Audio not generated yet
            </div>
          )}
          <button
            onClick={generateAudio}
            disabled={isGenerating || !narrationScript}
            className="w-full py-3 bg-teal-500 text-black rounded-xl hover:bg-teal-400 transition-all font-bold flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating audio...
              </>
            ) : (
              'Generate Audio'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
