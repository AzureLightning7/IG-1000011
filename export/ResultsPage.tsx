import { useNavigate } from 'react-router-dom'
import { RefreshCw, Share2 } from 'lucide-react'

interface Product {
  name: string
  category: string
  priceRange: string
}

interface GeneratedContent {
  vibeName: string
  description: string
  layoutTips: string[]
  products: Product[]
}

interface MediaContent {
  imageUrl?: string
  audioUrl?: string
}

interface ResultsPageProps {
  content?: GeneratedContent
  media?: MediaContent
  onRestart?: () => void
  onNavigate?: (path: string) => void
}

export default function ResultsPage({ content, media, onRestart, onNavigate }: ResultsPageProps) {
  const navigate = useNavigate()
  
  const generatedContent = content
  const mediaContent = media

  const handleRestart = () => {
    if (onRestart) {
      onRestart()
    } else {
      navigate('/')
    }
  }

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      navigate(path)
    }
  }

  if (!generatedContent) {
    handleNavigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      <header className="pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <span className="text-teal-400 font-bold tracking-widest uppercase text-sm mb-4 block">
          Your Custom DormVibe
        </span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">{generatedContent.vibeName}</h1>
        <p className="text-xl text-zinc-400 leading-relaxed">
          {generatedContent.description}
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 space-y-16">
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">🖼️ Mood Board</h2>
          {mediaContent?.imageUrl && (
            <div className="rounded-3xl overflow-hidden">
              <img 
                src={mediaContent.imageUrl} 
                alt="Mood Board" 
                className="w-full max-h-[500px] object-cover"
              />
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">✨ Your Vibe Guide</h2>
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div>
              <h3 className="text-teal-400 font-bold uppercase text-xs tracking-wider mb-4">Layout Tips</h3>
              <ul className="space-y-4">
                {generatedContent.layoutTips.map((tip, i) => (
                  <li key={i} className="flex gap-4 text-zinc-300">
                    <span className="text-teal-500 font-bold">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 text-white">🛒 Essentials Shopping List</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedContent.products.map((product, i) => (
              <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-white font-semibold">{product.name}</h3>
                  <span className="text-teal-400 font-medium">{product.priceRange}</span>
                </div>
                <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                  {product.category}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12 border-t border-zinc-800">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all font-bold text-zinc-300"
          >
            <RefreshCw className="w-5 h-5" /> Start Over
          </button>
          <button className="flex items-center gap-2 px-8 py-4 bg-teal-500 text-black rounded-2xl hover:bg-teal-400 transition-all font-bold">
            <Share2 className="w-5 h-5" /> Share My Vibe
          </button>
        </div>
      </main>
    </div>
  )
}

export type { GeneratedContent, MediaContent, Product }
