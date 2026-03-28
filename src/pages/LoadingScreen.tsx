import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Hammer, Home, Palette, Sparkles, Lightbulb, Package } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { quizData, setGeneratedContent, setMediaContent, setProgress, progress, setIsGenerating } = useStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!quizData) {
      navigate('/');
      return;
    }

    setIsGenerating(true);
    
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

      if (status === 'error') {
        const message = data?.message ?? 'Generation step failed.';
        setProgress(step, 'error', message);
        return;
      }

      setProgress(step, status);

      if (step === 'Text Generation' && status === 'completed') {
        setGeneratedContent(data);
      } else if (step === 'Image Generation' && status === 'completed') {
        setMediaContent({ imageUrl: data.url });
      } else if (step === 'Complete' && status === 'completed') {
        setIsGenerating(false);
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

  const steps = [
    { id: 'text', label: 'Crafting your vibe guide...', icon: Sparkles, activeStep: 'Text Generation' },
    { id: 'image', label: 'Designing your mood board...', icon: Palette, activeStep: 'Image Generation' },
  ];

  const calculateProgress = () => {
    if (progress.status === 'error') return 100;
    if (progress.step === 'Text Generation' && progress.status === 'completed') return 75;
    if (progress.step === 'Text Generation' && progress.status === 'processing') return 35;
    if (progress.step === 'Image Generation' && progress.status === 'completed') return 100;
    if (progress.step === 'Image Generation' && progress.status === 'processing') return 85;
    if (progress.step === 'Complete') return 100;
    return 15;
  };

  const progressPercent = calculateProgress();

  return (
    <div className="h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0a] overflow-hidden relative">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-teal-500/5"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/10 blur-[100px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-lg">
        <motion.div 
          className="mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, -10, 0, 10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              <Hammer className="w-20 h-20 text-teal-400" />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Home className="w-16 h-16 text-teal-500/60" />
            </motion.div>
          </div>
          
          <div className="text-center">
            <motion.h2 
              className="text-4xl font-bold mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              Building Your <span className="text-teal-400">DormVibe</span>
            </motion.h2>
            <p className="text-zinc-500">Watch your dream room come to life!</p>
          </div>
        </motion.div>

        <motion.div 
          className="mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative h-4 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-zinc-500">{progressPercent}% complete</span>
            <span className="text-teal-400">
              {progressPercent < 50 ? 'Designing...' : progressPercent < 100 ? 'Almost done!' : 'Done!'}
            </span>
          </div>
        </motion.div>

        <div className="space-y-3">
          {steps.map((step, index) => {
            const isCompleted = progress.step === step.activeStep && progress.status === 'completed';
            const isProcessing = progress.step === step.activeStep && progress.status === 'processing';
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-teal-500/10 border-teal-500/30' 
                    : isProcessing 
                    ? 'bg-zinc-800 border-zinc-700' 
                    : 'bg-transparent border-transparent opacity-40'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-teal-500" />
                    </motion.div>
                  ) : isProcessing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-6 h-6 text-teal-500" />
                    </motion.div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-zinc-700" />
                  )}
                </div>
                <Icon className={`w-5 h-5 ${isCompleted ? 'text-teal-400' : isProcessing ? 'text-teal-500' : 'text-zinc-600'}`} />
                <span className={`font-medium ${isCompleted ? 'text-zinc-200' : isProcessing ? 'text-white' : 'text-zinc-600'}`}>
                  {step.label}
                </span>
                {isProcessing && (
                  <motion.div 
                    className="flex-1 h-0.5 bg-teal-500/30 rounded-full overflow-hidden"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
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
