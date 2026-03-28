import { create } from 'zustand';
import { QuizData, GeneratedContent, MediaContent } from '../../shared/types';

interface AppState {
  quizData: QuizData | null;
  generatedContent: GeneratedContent | null;
  mediaContent: MediaContent;
  isGenerating: boolean;
  progress: {
    step: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    messages: string[];
  };
  setQuizData: (data: QuizData) => void;
  setGeneratedContent: (content: GeneratedContent) => void;
  setMediaContent: (media: Partial<MediaContent>) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setProgress: (step: string, status: 'pending' | 'processing' | 'completed' | 'error', message?: string) => void;
  reset: () => void;
}

const initialState = {
  quizData: null,
  generatedContent: null,
  mediaContent: {},
  isGenerating: false,
  progress: {
    step: 'Initializing',
    status: 'pending' as const,
    messages: [],
  },
};

export const useStore = create<AppState>((set) => ({
  ...initialState,
  setQuizData: (data) => set({ quizData: data }),
  setGeneratedContent: (content) => set({ generatedContent: content }),
  setMediaContent: (media) => set((state) => ({ 
    mediaContent: { ...state.mediaContent, ...media } 
  })),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (step, status, message) => set((state) => ({
    progress: {
      step,
      status,
      messages: message ? [...state.progress.messages, message] : state.progress.messages,
    },
  })),
  reset: () => set(initialState),
}));
