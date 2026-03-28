import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, CreditCard, Truck, Check, X, Trash2, MapPin, Calendar, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  seller?: string
}

interface CheckoutProps {
  onNavigate?: (path: string) => void
  initialItems?: CartItem[]
}

export default function Checkout({ onNavigate, initialItems }: CheckoutProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [orderPlaced, setOrderPlaced] = useState(false)
  
  const [cartItems] = useState<CartItem[]>(initialItems || [
    { id: '1', name: 'Modern Bed Frame - Walnut', price: 299, image: '🛏️', category: 'bed', seller: 'Campus Furniture Co.' },
    { id: '6', name: 'Smart LED Floor Lamp', price: 79, image: '💡', category: 'lighting', seller: 'EcoHome' },
    { id: '9', name: 'Storage Ottoman - Velvet', price: 89, image: '🛋️', category: 'storage', seller: 'Student Deals' }
  ])

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dorm: '',
    building: '',
    roomNumber: '',
    notes: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  })

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)
  const delivery = subtotal > 200 ? 0 : 15
  const total = subtotal + delivery

  const updateForm = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.phone || !formData.dorm) {
      toast.error('Please fill in required delivery details')
      return
    }
    setOrderPlaced(true)
    toast.success('Order placed successfully!')
  }

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path)
    } else {
      navigate(path)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h2>
          <p className="text-slate-400 mb-6">Your order has been placed successfully. You'll receive a confirmation shortly.</p>
          <div className="bg-slate-700 rounded-xl p-4 mb-6">
            <p className="text-slate-400 text-sm">Order Number</p>
            <p className="text-white font-bold text-xl">#AIDORM-{Date.now().toString().slice(-6)}</p>
          </div>
          <button onClick={() => handleNavigate('/dashboard')} className="w-full py-3 bg-primary-500 text-white rounded-xl font-medium">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <header className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => handleNavigate('/marketplace')} className="flex items-center gap-2 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />Back to Shop
          </button>
          <h1 className="text-xl font-bold text-white">Checkout</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-500' : 'bg-slate-700'} text-white font-bold`}>1</div>
                <div className={`flex-1 h-1 ${step >= 2 ? 'bg-primary-500' : 'bg-slate-700'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-500' : 'bg-slate-700'} text-white font-bold`}>2</div>
                <div className={`flex-1 h-1 ${step >= 3 ? 'bg-primary-500' : 'bg-slate-700'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-500' : 'bg-slate-700'} text-white font-bold`}>3</div>
              </div>

              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-400" />Delivery Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Full Name *</label>
                      <input value={formData.name} onChange={e => updateForm('name', e.target.value)} placeholder="Your name" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Phone Number *</label>
                      <input value={formData.phone} onChange={e => updateForm('phone', e.target.value)} placeholder="Your phone" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Dorm Building *</label>
                      <select value={formData.dorm} onChange={e => updateForm('dorm', e.target.value)} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white">
                        <option value="">Select your dorm</option>
                        <option value="block-a">Block A</option>
                        <option value="block-b">Block B</option>
                        <option value="block-c">Block C</option>
                        <option value="block-d">Block D</option>
                        <option value="block-e">Block E</option>
                        <option value="international">International Hall</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Room Number</label>
                        <input value={formData.roomNumber} onChange={e => updateForm('roomNumber', e.target.value)} placeholder="e.g. 301" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                      </div>
                      <div>
                        <label className="text-slate-400 text-sm mb-2 block">Building</label>
                        <input value={formData.building} onChange={e => updateForm('building', e.target.value)} placeholder="Optional" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Delivery Notes</label>
                      <textarea value={formData.notes} onChange={e => updateForm('notes', e.target.value)} placeholder="Any special instructions..." rows={3} className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium">Continue to Payment</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary-400" />Payment Method
                  </h2>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <button onClick={() => updateForm('paymentMethod', 'card')} className={`flex-1 py-3 rounded-xl font-medium border-2 ${formData.paymentMethod === 'card' ? 'border-primary-500 bg-primary-500/20 text-white' : 'border-slate-600 text-slate-400'}`}>
                        💳 Card
                      </button>
                      <button onClick={() => updateForm('paymentMethod', 'alipay')} className={`flex-1 py-3 rounded-xl font-medium border-2 ${formData.paymentMethod === 'alipay' ? 'border-primary-500 bg-primary-500/20 text-white' : 'border-slate-600 text-slate-400'}`}>
                        📱 Alipay
                      </button>
                      <button onClick={() => updateForm('paymentMethod', 'wechat')} className={`flex-1 py-3 rounded-xl font-medium border-2 ${formData.paymentMethod === 'wechat' ? 'border-primary-500 bg-primary-500/20 text-white' : 'border-slate-600 text-slate-400'}`}>
                        💬 WeChat
                      </button>
                    </div>
                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <label className="text-slate-400 text-sm mb-2 block">Card Number</label>
                          <input value={formData.cardNumber} onChange={e => updateForm('cardNumber', e.target.value)} placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-slate-400 text-sm mb-2 block">Expiry</label>
                            <input value={formData.cardExpiry} onChange={e => updateForm('cardExpiry', e.target.value)} placeholder="MM/YY" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                          </div>
                          <div>
                            <label className="text-slate-400 text-sm mb-2 block">CVV</label>
                            <input value={formData.cardCvv} onChange={e => updateForm('cardCvv', e.target.value)} placeholder="123" className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-slate-600 text-slate-400 rounded-xl font-medium">Back</button>
                    <button onClick={() => setStep(3)} className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-medium">Review Order</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary-400" />Review Order
                  </h2>
                  <div className="space-y-3 mb-6">
                    {cartItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-xl">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.name}</h4>
                          <p className="text-slate-400 text-sm">{item.seller}</p>
                        </div>
                        <span className="text-white font-bold">${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                    <h3 className="text-white font-medium mb-2">Delivery to:</h3>
                    <p className="text-slate-400 text-sm">{formData.name} • {formData.dorm} {formData.roomNumber && `• Room ${formData.roomNumber}`}</p>
                    <p className="text-slate-400 text-sm">{formData.phone}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 py-3 border-2 border-slate-600 text-slate-400 rounded-xl font-medium">Back</button>
                    <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600">Place Order - ${total}</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-400">{item.name}</span>
                    <span className="text-white">${item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Delivery</span>
                  <span className="text-white">{delivery === 0 ? 'FREE' : `$${delivery}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                  <span className="text-white">Total</span>
                  <span className="text-primary-400">${total}</span>
                </div>
              </div>
              {delivery === 0 && <p className="text-green-400 text-sm mt-3">🎉 You qualify for free delivery!</p>}
              {delivery > 0 && <p className="text-slate-400 text-sm mt-3">Add ${200 - subtotal} more for free delivery</p>}
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2"><Clock className="w-4 h-4" />Delivery Times</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-4 h-4" />
                  <span>Same day delivery for orders before 12pm</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Truck className="w-4 h-4" />
                  <span>Deliveries: 2pm - 8pm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export type { CartItem }
