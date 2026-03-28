import { create } from 'zustand';
import { QuizData, GeneratedContent, MediaContent } from '../../shared/types';

interface CartItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface SellerItem {
  id: string;
  name: string;
  description: string;
  price: number;
  pickupLocation: string;
  quantity: number;
  category: string;
  images: string[];
  isFree: boolean;
}

interface AppState {
  quizData: QuizData | null;
  generatedContent: GeneratedContent | null;
  mediaContent: MediaContent;
  customImageUrl: string | null;
  isCustomizing: boolean;
  isGenerating: boolean;
  progress: {
    step: string;
    status: 'pending' | 'processing' | 'completed' | 'error';
    messages: string[];
  };
  cartItems: CartItem[];
  sellerItems: SellerItem[];
  setQuizData: (data: QuizData) => void;
  setGeneratedContent: (content: GeneratedContent) => void;
  setMediaContent: (media: Partial<MediaContent>) => void;
  setCustomImageUrl: (url: string | null) => void;
  setIsCustomizing: (isCustomizing: boolean) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setProgress: (step: string, status: 'pending' | 'processing' | 'completed' | 'error', message?: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  addSellerItem: (item: SellerItem) => void;
  reset: () => void;
}

const initialState = {
  quizData: null,
  generatedContent: null,
  mediaContent: {},
  customImageUrl: null,
  isCustomizing: false,
  isGenerating: false,
  progress: {
    step: 'Initializing',
    status: 'pending' as const,
    messages: [],
  },
  cartItems: [],
  sellerItems: [],
};

export const useStore = create<AppState>((set) => ({
  ...initialState,
  setQuizData: (data) => set({ quizData: data }),
  setGeneratedContent: (content) => set({ generatedContent: content }),
  setMediaContent: (media) => set((state) => ({ 
    mediaContent: { ...state.mediaContent, ...media } 
  })),
  setCustomImageUrl: (url) => set({ customImageUrl: url }),
  setIsCustomizing: (isCustomizing) => set({ isCustomizing }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (step, status, message) => set((state) => ({
    progress: {
      step,
      status,
      messages: message ? [...state.progress.messages, message] : state.progress.messages,
    },
  })),
  addToCart: (item) => set((state) => ({ 
    cartItems: [...state.cartItems, item] 
  })),
  removeFromCart: (id) => set((state) => ({ 
    cartItems: state.cartItems.filter((item) => item.id !== id) 
  })),
  addSellerItem: (item) => set((state) => ({ 
    sellerItems: [...state.sellerItems, item] 
  })),
  reset: () => set(initialState),
}));