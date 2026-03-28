import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, ArrowLeft, Heart, Star, Leaf, X, Package, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  eco: number
  image: string
}

interface NewItem {
  name: string
  description: string
  price: string
  category: string
  images: string[]
}

const products: Product[] = [
  { id: '1', name: 'Modern Bed Frame - Walnut', category: 'bed', price: 299, rating: 4.7, reviews: 234, eco: 92, image: '🛏️' },
  { id: '2', name: 'Ergonomic Standing Desk - Bamboo', category: 'desk', price: 249, rating: 4.8, reviews: 412, eco: 88, image: '🪑' },
  { id: '3', name: 'Premium Mesh Office Chair', category: 'chair', price: 179, rating: 4.5, reviews: 567, eco: 75, image: '💺' },
  { id: '4', name: 'Sliding Door Wardrobe - Light Grey', category: 'wardrobe', price: 399, rating: 4.6, reviews: 189, eco: 85, image: '🚪' },
  { id: '5', name: 'Modular Bookshelf System', category: 'shelf', price: 129, rating: 4.4, reviews: 298, eco: 90, image: '📚' },
  { id: '6', name: 'Smart LED Floor Lamp', category: 'lighting', price: 79, rating: 4.3, reviews: 432, eco: 95, image: '💡' },
  { id: '7', name: 'Eco-Friendly Wool Rug - Natural', category: 'rug', price: 99, rating: 4.7, reviews: 156, eco: 98, image: '🧶' },
  { id: '8', name: 'Succulent Plant Set (3 pcs)', category: 'decor', price: 59, rating: 4.5, reviews: 267, eco: 99, image: '🌱' },
  { id: '9', name: 'Storage Ottoman - Velvet', category: 'storage', price: 89, rating: 4.2, reviews: 145, eco: 70, image: '🛋️' },
  { id: '10', name: 'Round Wall Mirror - Gold Frame', category: 'decor', price: 79, rating: 4.6, reviews: 198, eco: 80, image: '🪞' },
  { id: '11', name: 'Desk Organizer Set - 5 Pieces', category: 'organization', price: 35, rating: 4.4, reviews: 312, eco: 85, image: '📦' },
  { id: '12', name: 'Decorative Cushion Set (4 pcs)', category: 'decor', price: 55, rating: 4.3, reviews: 245, eco: 75, image: '🛏️' },
  { id: '13', name: 'Floating Wall Shelves (Set of 3)', category: 'shelf', price: 45, rating: 4.5, reviews: 389, eco: 88, image: '🏺' },
  { id: '14', name: 'Portable Fan - USB Rechargeable', category: 'appliances', price: 29, rating: 4.1, reviews: 156, eco: 60, image: '🌀' },
  { id: '15', name: 'Electric Kettle - Compact', category: 'appliances', price: 39, rating: 4.4, reviews: 278, eco: 65, image: '🫖' },
  { id: '16', name: 'Mini Refrigerator - 3.2 Cu Ft', category: 'appliances', price: 199, rating: 4.3, reviews: 445, eco: 55, image: '🧊' },
  { id: '17', name: 'Study Lamp - Adjustable Arm', category: 'lighting', price: 45, rating: 4.6, reviews: 523, eco: 82, image: '🪔' },
  { id: '18', name: 'Laundry Basket - Collapsible', category: 'storage', price: 25, rating: 4.2, reviews: 189, eco: 90, image: '🧺' },
  { id: '19', name: 'Shoe Rack - 6 Tier', category: 'storage', price: 55, rating: 4.4, reviews: 334, eco: 78, image: '👟' },
  { id: '20', name: 'Curtain Set - Blackout (2 Panels)', category: 'window', price: 69, rating: 4.5, reviews: 412, eco: 70, image: '🪟' },
  { id: '21', name: 'Wall Clock - Minimalist Design', category: 'decor', price: 35, rating: 4.3, reviews: 267, eco: 75, image: '🕐' },
  { id: '22', name: 'Bedside Table - 2 Drawer', category: 'furniture', price: 79, rating: 4.5, reviews: 198, eco: 82, image: '🗄️' },
  { id: '23', name: 'Clothing Steamer - Travel Size', category: 'appliances', price: 49, rating: 4.2, reviews: 156, eco: 60, image: '💨' },
  { id: '24', name: 'Bluetooth Speaker - Waterproof', category: 'electronics', price: 59, rating: 4.6, reviews: 567, eco: 65, image: '🔊' }
]

const categories = ['all', 'bed', 'desk', 'chair', 'wardrobe', 'shelf', 'lighting', 'rug', 'decor', 'storage', 'organization', 'appliances', 'window', 'furniture', 'electronics']

interface MarketplaceProps {
  onNavigate?: (path: string) => void
  onAddToCart?: (product: Product) => void
  cartItems?: Product[]
  onRemoveFromCart?: (id: string) => void
}

export default function Marketplace({ onNavigate, onAddToCart, cartItems: externalCartItems, onRemoveFromCart }: MarketplaceProps) {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('all')
  const [internalCartItems, setInternalCartItems] = useState<Product[]>([])
  const [showSell, setShowSell] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [newItem, setNewItem] = useState<NewItem>({ name: '', description: '', price: '', category: 'bed', images: [] })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const cartItems = externalCartItems || internalCartItems
  const setCartItems = externalCartItems ? () => {} : setInternalCartItems

  const filtered = products.filter(p => (cat === 'all' || p.category === cat) && p.name.toLowerCase().includes(search.toLowerCase()))

  const addToCart = (product: Product) => {
    if (onAddToCart) {
      onAddToCart(product)
    } else {
      setCartItems([...cartItems, product])
    }
    toast.success(`${product.name} added to cart!`)
  }

  const removeFromCart = (id: string) => {
    if (onRemoveFromCart) {
      onRemoveFromCart(id)
    } else {
      setCartItems(cartItems.filter(item => item.id !== id))
    }
    toast.info('Item removed from cart')
  }

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newPreviews: string[] = []

    Array.from(files).slice(0, 3 - imagePreviews.length).forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          newPreviews.push(event.target.result as string)
          setImagePreviews(prev => [...prev, event.target?.result as string].slice(0, 3))
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index: number) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setImagePreviews(newPreviews)
  }

  const handleListItem = () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Please fill in item name and price')
      return
    }
    if (imagePreviews.length === 0) {
      toast.error('Please add at least one image')
      return
    }
    toast.success('Item listed successfully!')
    setShowSell(false)
    setNewItem({ name: '', description: '', price: '', category: 'bed', images: [] })
    setImagePreviews([])
  }

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      navigate(path)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <nav className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button onClick={() => handleNavigate('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />Back
          </button>
          <h1 className="text-xl font-bold text-white">Campus Marketplace</h1>
          <button onClick={() => setShowCart(true)} className="relative">
            <ShoppingCart className="w-6 h-6 text-slate-400 hover:text-white" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">{cartItems.length}</span>
            )}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Find Furniture</h1>
        <p className="text-slate-400 mb-8">Browse eco-friendly furniture for your dorm</p>

        <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-200">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search furniture..." className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-primary-500 outline-none" />
          </div>
          <button onClick={() => setShowSell(true)} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600">
            <Package className="w-5 h-5" />Sell Item
          </button>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-4 py-2 rounded-full font-medium ${cat === c ? 'bg-primary-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-primary-500">
              <div className="aspect-square bg-slate-700 flex items-center justify-center text-6xl">{p.image}</div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-sm line-clamp-2">{p.name}</h3>
                  <button className="text-slate-400 hover:text-red-400"><Heart className="w-5 h-5" /></button>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= Math.round(p.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />)}
                  <span className="text-slate-500 text-sm">({p.reviews})</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-white">${p.price}</span>
                  <div className="flex items-center gap-1 text-green-400 text-xs"><Leaf className="w-3 h-3" />{p.eco}% eco</div>
                </div>
                <button onClick={() => addToCart(p)} className="w-full py-2.5 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showSell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSell(false)}>
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">List an Item for Sale</h2>
              <button onClick={() => setShowSell(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <div className="mb-4">
              <label className="text-slate-400 text-sm mb-2 block">Upload Pictures (1-3) *</label>
              <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center">
                {imagePreviews.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {imagePreviews.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg" />
                        <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs">×</button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-400 mb-3">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No images uploaded</p>
                  </div>
                )}
                {imagePreviews.length < 3 && (
                  <label className="cursor-pointer bg-primary-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-600">
                    + Add Image
                    <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
                <p className="text-slate-500 text-xs mt-2">JPG, PNG up to 5MB each</p>
              </div>
            </div>

            <input 
              value={newItem.name}
              onChange={e => setNewItem({...newItem, name: e.target.value})}
              placeholder="Item name *" 
              className="w-full mb-3 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" 
            />
            <textarea 
              value={newItem.description}
              onChange={e => setNewItem({...newItem, description: e.target.value})}
              placeholder="Description" 
              rows={3} 
              className="w-full mb-3 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" 
            />
            <div className="flex gap-3 mb-4">
              <input 
                value={newItem.price}
                onChange={e => setNewItem({...newItem, price: e.target.value})}
                type="number" 
                placeholder="Price ($) *" 
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white" 
              />
              <select 
                value={newItem.category}
                onChange={e => setNewItem({...newItem, category: e.target.value})}
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <button onClick={handleListItem} className="w-full py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600">
              List Item
            </button>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCart(false)}>
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Shopping Cart</h2>
              <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-4">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-4 p-3 bg-slate-700 rounded-xl">
                      <div className="text-3xl">{item.image}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-slate-400 text-sm">${item.price}</p>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-600 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">Total</span>
                    <span className="text-2xl font-bold text-white">${cartTotal}</span>
                  </div>
                  <button onClick={() => { setShowCart(false); handleNavigate('/checkout') }} className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600">
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { products, categories }
export type { Product, NewItem }
