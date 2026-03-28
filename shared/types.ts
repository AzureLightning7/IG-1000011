export interface Product {
  name: string;
  category: 'Lighting' | 'Bedding' | 'Desk' | 'Wall Decor' | 'Storage' | 'Plants' | 'Textiles' | 'Tech';
  priceRange: string;
  searchQuery: string;
}

export interface IdentifiedProduct extends Product {
  position: { x: number; y: number };
  size: { width: number; height: number };
  confidence: number;
  description: string;
}

export interface GeneratedContent {
  vibeName: string;
  description: string;
  narrationScript: string;
  imagePrompt: string;
  layoutTips: string[];
  products: Product[];
}

export interface MediaContent {
  imageUrl?: string;
  audioUrl?: string;
}

export interface QuizData {
  interests: string[];
  colorPalette: string;
  budget: number;
  isInternational: boolean;
  country?: string;
  priority: string;
}

export interface GenerationStatus {
  step: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  data?: any;
}
