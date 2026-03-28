import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSurveyStore } from '../store/surveyStore'
import { useStore } from '../store/vibeStore'

const TRAE_API_BASE = 'https://coreva-normal.trae.ai/api/ide/v1'

const GeneratingSteps = [
  { id: 1, text: 'Analyzing your vibe preferences...' },
  { id: 2, text: 'Creating color palette...' },
  { id: 3, text: 'Generating mood board...' },
  { id: 4, text: 'Building layout tips...' },
  { id: 5, text: 'Curating product recommendations...' },
  { id: 6, text: 'Finalizing your dorm design...' }
]

const randomVibe = () => {
  const vibes = ['Cozy Corner', 'Study Sanctuary', 'Zen Den', 'Creative Haven', 'Gamer Grotto', 'Minimal Oasis']
  return vibes[Math.floor(Math.random() * vibes.length)]
}

interface QuizData {
  interests: string[]
  colorPalette: string
  budget: number
  priority: string
  isInternational: boolean
  country: string
}

interface GeneratedContent {
  vibeName: string
  description: string
  narrationScript: string
  imagePrompt: string
  layoutTips: string[]
  products: Product[]
}

interface Product {
  name: string
  category: 'Lighting' | 'Bedding' | 'Desk' | 'Wall Decor' | 'Storage' | 'Plants' | 'Textiles' | 'Tech'
  priceRange: string
  searchQuery: string
}

interface MediaContent {
  imageUrl?: string
  audioUrl?: string
}

interface LoadingScreenProps {
  onComplete?: (content: GeneratedContent, media: MediaContent) => void
  navigateTo?: string
}

export default function LoadingScreen({ onComplete, navigateTo = '/results' }: LoadingScreenProps) {
  const navigate = useNavigate()
  const { quizData } = useSurveyStore()
  const { setGeneratedContent, setMediaContent } = useStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const generateFallbackContent = (): GeneratedContent => {
    const vibe = randomVibe()
    return {
      vibeName: quizData?.colorPalette ? `${quizData.colorPalette} ${vibe}` : vibe,
      description: `Based on your love for ${quizData?.interests?.slice(0, 3).join(', ') || 'modern aesthetics'}, we've created a personalized dorm space that balances functionality with your unique style.`,
      narrationScript: 'Welcome to your new dorm room! This design combines your preferred color palette with practical furniture choices to maximize your space.',
      imagePrompt: `${quizData?.colorPalette || 'modern'} dorm room with ${quizData?.interests?.slice(0, 2).join(', ') || 'minimal'} aesthetic`,
      layoutTips: [
        'Position your desk near the window for natural light',
        'Use vertical storage to maximize floor space',
        'Add string lights for ambient lighting',
        'Create a cozy corner with cushions and plants'
      ],
      products: [
        { name: 'LED String Lights', category: 'Lighting', priceRange: '$15-25', searchQuery: 'LED string lights dorm' },
        { name: 'Storage Cubes', category: 'Storage', priceRange: '$20-40', searchQuery: 'storage cubes organizer' },
        { name: 'Fuzzy Rug', category: 'Textiles', priceRange: '$25-50', searchQuery: 'cozy area rug bedroom' },
        { name: 'Desk Organizer', category: 'Desk', priceRange: '$15-30', searchQuery: 'desk organizer accessories' },
        { name: 'Wall Art Set', category: 'Wall Decor', priceRange: '$20-45', searchQuery: 'wall art posters dorm' },
        { name: 'Mini Plants', category: 'Plants', priceRange: '$10-25', searchQuery: 'indoor plants small' }
      ]
    }
  }

  const generateImageUrl = (prompt: string): string => {
    const encodedPrompt = encodeURIComponent(prompt)
    return `${TRAE_API_BASE}/text_to_image?prompt=${encodedPrompt}&image_size=landscape_16_9`
  }

  useEffect(() => {
    let step = 0
    const interval = setInterval(() => {
      if (step < GeneratingSteps.length) {
        setCurrentStep(step)
        setProgress(((step + 1) / GeneratingSteps.length) * 100)
        step++
      } else {
        clearInterval(interval)
        
        const generatedContent = generateFallbackContent()
        const imageUrl = generateImageUrl(generatedContent.imagePrompt)
        const mediaContent: MediaContent = { imageUrl }
        
        if (onComplete) {
          onComplete(generatedContent, mediaContent)
        } else {
          setGeneratedContent(generatedContent)
          setMediaContent(mediaContent)
        }
        
        navigate(navigateTo)
      }
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Creating Your <span className="text-teal-400">DormVibe</span>
        </h1>
        <p className="text-zinc-400 mb-12">This will only take a moment...</p>

        <div className="space-y-4 mb-12">
          {GeneratingSteps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                index < currentStep ? 'bg-teal-500/10' : index === currentStep ? 'bg-zinc-800' : 'bg-zinc-900'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                index < currentStep ? 'bg-teal-500' : index === currentStep ? 'bg-teal-500 animate-pulse' : 'bg-zinc-700'
              }`}>
                {index < currentStep ? '✓' : ''}
              </div>
              <span className={index <= currentStep ? 'text-teal-400' : 'text-zinc-500'}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        <div className="w-full bg-zinc-800 rounded-full h-2 mb-4">
          <div
            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-zinc-500 text-sm">{Math.round(progress)}% complete</p>
      </div>
    </div>
  )
}

export { GeneratingSteps, randomVibe, generateFallbackContent, generateImageUrl }
export type { QuizData, GeneratedContent, Product, MediaContent }
