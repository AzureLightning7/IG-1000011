import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { quizData, setGeneratedContent, setMediaContent, setProgress, progress, setIsGenerating } = useStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const [stopwatches, setStopwatches] = useState<{
    [key: string]: {
      startTime: number | null;
      elapsedTime: number;
    };
  }>({
    'Text Generation': { startTime: null, elapsedTime: 0 },
    'Image Generation': { startTime: null, elapsedTime: 0 },
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!quizData) {
      navigate('/');
      return;
    }

    setIsGenerating(true);
    
    // Start the generation process
    const startGeneration = async () => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quizData),
        });

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader available');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const payload = JSON.parse(line.replace('data: ', ''));
              handleUpdate(payload);
            }
          }
        }
      } catch (error) {
        console.error('Generation error:', error);
        setProgress('Error', 'error', 'Something went wrong. Please try again.');
      }
    };

    const handleUpdate = (payload: any) => {
      const { step, status, data } = payload;

      const nonCriticalSteps = new Set([
        'Image Generation',
        'TTS Generation',
      ]);

      if (status === 'error') {
        const message = data?.message ?? 'Generation step failed.';

        if (nonCriticalSteps.has(step)) {
          setProgress(step, 'completed', `${step} failed — continuing. (${message})`);
          setStopwatches(prev => ({
            ...prev,
            [step]: { ...prev[step], startTime: null }
          }));
        } else {
          setProgress(step, 'error', message);
          setStopwatches(prev => ({
            ...prev,
            [step]: { ...prev[step], startTime: null }
          }));
        }
        return;
      }

      setProgress(step, status);

      if (status === 'processing') {
        setStopwatches(prev => ({
          ...prev,
          [step]: { startTime: Date.now(), elapsedTime: 0 }
        }));
      } else if (status === 'completed') {
        setStopwatches(prev => ({
          ...prev,
          [step]: { ...prev[step], startTime: null }
        }));
      }

      if (step === 'Text Generation' && status === 'completed') {
        setGeneratedContent(data);
      } else if (step === 'Image Generation' && status === 'completed') {
        setMediaContent({ imageUrl: data.url });
      } else if (step === 'TTS Generation' && status === 'completed') {
        setMediaContent({ audioUrl: data.url });
      } else if (step === 'Complete' && status === 'completed') {
        setIsGenerating(false);
        // We wait a moment so the user sees the "Complete" state
        setTimeout(() => navigate('/results'), 1500);
      }
    };

    startGeneration();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [quizData, navigate, setGeneratedContent, setMediaContent, setProgress, setIsGenerating]);

  // Update stopwatches every second
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    
    const updateStopwatches = () => {
      setStopwatches(prev => {
        const newStopwatches = { ...prev };
        Object.entries(prev).forEach(([step, { startTime, elapsedTime }]) => {
          if (startTime) {
            newStopwatches[step] = {
              startTime,
              elapsedTime: Math.floor((Date.now() - startTime) / 1000)
            };
          }
        });
        return newStopwatches;
      });
    };

    intervalId = setInterval(updateStopwatches, 1000);
    intervalRef.current = intervalId;

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      // Also clear from ref for safety
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const steps = [
    { id: 'text', label: 'Crafting your vibe guide...', activeStep: 'Text Generation' },
    { id: 'assets', label: 'Painting your mood board...', activeStep: 'Image Generation' },
  ];

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a] overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-12 h-12 text-teal-400" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-2">Generating your Vibe</h2>
          <p className="text-zinc-500">This takes about a minute. Hang tight!</p>
        </div>

        <div className="space-y-4">
          {steps.map((step) => {
            const stopwatch = stopwatches[step.activeStep];
            const isCompleted = stopwatch.startTime === null && stopwatch.elapsedTime > 0;
            const isProcessing = progress.step === step.activeStep && progress.status === 'processing';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                  isCompleted ? 'bg-teal-500/5 border-teal-500/20' : 
                  isProcessing ? 'bg-zinc-900 border-zinc-700' : 'bg-transparent border-transparent opacity-40'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-teal-500" />
                  ) : isProcessing ? (
                    <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-800" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`text-lg font-medium ${isCompleted || isProcessing ? 'text-white' : 'text-zinc-600'}`}>
                    {step.label}
                  </span>
                  <div className="h-1.5 mt-2 rounded-full overflow-hidden bg-zinc-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ 
                        width: isCompleted ? '100%' : isProcessing ? '80%' : 0 
                      }}
                      transition={{ 
                        duration: isCompleted ? 0.5 : isProcessing ? 2 : 0,
                        ease: isCompleted ? 'ease-out' : 'linear'
                      }}
                      className="h-full bg-teal-500"
                    />
                  </div>
                </div>
                <div className={`text-sm ${isCompleted || isProcessing ? 'text-teal-500' : 'text-zinc-600'}`}>
                  {(() => {
                    const stopwatch = stopwatches[step.activeStep];
                    const seconds = stopwatch.elapsedTime;
                    const minutes = Math.floor(seconds / 60);
                    const remainingSeconds = seconds % 60;
                    const formattedTime = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
                    
                    if (isCompleted || isProcessing) {
                      return formattedTime;
                    }
                    return '--:--';
                  })()}
                </div>
              </motion.div>
            );
          })}
        </div>

        {progress.status === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center"
          >
            {progress.messages[progress.messages.length - 1] || 'Generation failed. Please try again.'}
            <button 
              onClick={() => navigate('/')}
              className="block w-full mt-4 py-2 bg-red-500 text-black font-bold rounded-lg"
            >
              Go Back
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
