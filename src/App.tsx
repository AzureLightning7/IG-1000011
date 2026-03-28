import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import VibeQuiz from "./pages/VibeQuiz";
import LoadingScreen from "./pages/LoadingScreen";
import ResultsPage from "./pages/ResultsPage";
import { useState, useRef, useEffect } from "react";
import { ShoppingBag, X, ArrowLeft, CreditCard, Truck, Check, Trash2, Package, Plus } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "./store/useStore";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  eco: number;
  image: string;
}

interface SellItemForm {
  name: string;
  description: string;
  price: string;
  pickupLocation: string;
  quantity: string;
  category: string;
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
];

const recycledItems: Product[] = [
  { id: 'r1', name: 'Used Desk Lamp - Working', category: 'lighting', price: 0, rating: 4.2, reviews: 45, eco: 100, image: '💡' },
  { id: 'r2', name: 'Pre-loved Bean Bag', category: 'decor', price: 0, rating: 4.0, reviews: 32, eco: 100, image: '🪑' },
  { id: 'r3', name: 'Second-hand Storage Box', category: 'storage', price: 0, rating: 4.5, reviews: 28, eco: 100, image: '📦' },
  { id: 'r4', name: 'Recycled Book Stack', category: 'decor', price: 0, rating: 4.3, reviews: 56, eco: 100, image: '📚' },
  { id: 'r5', name: 'Upcycled Wall Art', category: 'decor', price: 0, rating: 4.6, reviews: 18, eco: 100, image: '🖼️' },
  { id: 'r6', name: 'Vintage Cushions (2)', category: 'decor', price: 0, rating: 4.1, reviews: 22, eco: 100, image: '🛏️' },
];

const categories = ['all', 'bed', 'desk', 'chair', 'wardrobe', 'shelf', 'lighting', 'rug', 'decor', 'storage'];
const sellCategories = ['bed', 'desk', 'chair', 'wardrobe', 'shelf', 'lighting', 'rug', 'decor', 'storage', 'other'];

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart } = useStore();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dorm: '',
    roomNumber: '',
    paymentMethod: 'card',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const delivery = subtotal > 200 ? 0 : 15;
  const total = subtotal + delivery;

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.phone || !formData.dorm) {
      toast.error('Please fill in required delivery details');
      return;
    }
    setOrderPlaced(true);
    toast.success('Order placed successfully!');
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-black" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Order Confirmed!</h2>
          <p className="text-zinc-400 mb-6">Your order has been placed successfully. You'll receive a confirmation shortly.</p>
          <div className="bg-zinc-800 rounded-xl p-4 mb-6">
            <p className="text-zinc-400 text-sm">Order Number</p>
            <p className="text-white font-bold text-xl">#DORMV-{Date.now().toString().slice(-6)}</p>
          </div>
          <button onClick={() => navigate('/')} className="w-full py-3 bg-teal-500 text-black rounded-xl font-bold">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="bg-zinc-900/50 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />Back
          </button>
          <h1 className="text-xl font-bold text-white">Checkout</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-teal-500' : 'bg-zinc-700'} text-black font-bold`}>1</div>
                <div className={`flex-1 h-1 ${step >= 2 ? 'bg-teal-500' : 'bg-zinc-700'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-teal-500' : 'bg-zinc-700'} text-black font-bold`}>2</div>
                <div className={`flex-1 h-1 ${step >= 3 ? 'bg-teal-500' : 'bg-zinc-700'}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-teal-500' : 'bg-zinc-700'} text-black font-bold`}>3</div>
              </div>

              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-teal-400" />Delivery Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-zinc-400 text-sm mb-2 block">Full Name *</label>
                      <input 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Your name" 
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-sm mb-2 block">Phone Number *</label>
                      <input 
                        value={formData.phone} 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        placeholder="Your phone" 
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-sm mb-2 block">Dorm Building *</label>
                      <select 
                        value={formData.dorm} 
                        onChange={e => setFormData({...formData, dorm: e.target.value})} 
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                      >
                        <option value="">Select your dorm</option>
                        <option value="block-a">Block A</option>
                        <option value="block-b">Block B</option>
                        <option value="block-c">Block C</option>
                        <option value="block-d">Block D</option>
                        <option value="international">International Hall</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-sm mb-2 block">Room Number</label>
                      <input 
                        value={formData.roomNumber} 
                        onChange={e => setFormData({...formData, roomNumber: e.target.value})} 
                        placeholder="e.g. 301" 
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-white" 
                      />
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="w-full mt-6 py-3 bg-teal-500 text-black rounded-xl font-bold">Continue to Payment</button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-400" />Payment Method
                  </h2>
                  <div className="flex gap-3 mb-4">
                    <button onClick={() => setFormData({...formData, paymentMethod: 'card'})} className={`flex-1 py-3 rounded-xl font-medium border-2 ${formData.paymentMethod === 'card' ? 'border-teal-500 bg-teal-500/20 text-white' : 'border-zinc-700 text-zinc-400'}`}>
                      💳 Card
                    </button>
                    <button onClick={() => setFormData({...formData, paymentMethod: 'alipay'})} className={`flex-1 py-3 rounded-xl font-medium border-2 ${formData.paymentMethod === 'alipay' ? 'border-teal-500 bg-teal-500/20 text-white' : 'border-zinc-700 text-zinc-400'}`}>
                      📱 Alipay
                    </button>
                    <button onClick={() => setFormData({...formData, paymentMethod: 'wechat'})} className={`flex-1 py-3 rounded-xl font-medium border-2 ${formData.paymentMethod === 'wechat' ? 'border-teal-500 bg-teal-500/20 text-white' : 'border-zinc-700 text-zinc-400'}`}>
                      💬 WeChat
                    </button>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 py-3 border-2 border-zinc-700 text-zinc-400 rounded-xl font-medium">Back</button>
                    <button onClick={() => setStep(3)} className="flex-1 py-3 bg-teal-500 text-black rounded-xl font-bold">Review Order</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-teal-400" />Review Order
                  </h2>
                  <div className="space-y-3 mb-6">
                    {cartItems.map((item, idx) => (
                      <div key={`${item.id}-${idx}`} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-medium">{item.name}</h4>
                        </div>
                        <span className="text-white font-bold">${item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-zinc-800/50 rounded-xl p-4 mb-6">
                    <h3 className="text-white font-medium mb-2">Delivery to:</h3>
                    <p className="text-zinc-400 text-sm">{formData.name} • {formData.dorm} {formData.roomNumber && `• Room ${formData.roomNumber}`}</p>
                    <p className="text-zinc-400 text-sm">{formData.phone}</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(2)} className="flex-1 py-3 border-2 border-zinc-700 text-zinc-400 rounded-xl font-medium">Back</button>
                    <button onClick={handlePlaceOrder} className="flex-1 py-3 bg-teal-500 text-black rounded-xl font-bold hover:bg-teal-400">Place Order - ${total}</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item, idx) => (
                  <div key={`${item.id}-${idx}`} className="flex justify-between text-sm">
                    <span className="text-zinc-400">{item.name}</span>
                    <span className="text-white">${item.price}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-zinc-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Delivery</span>
                  <span className="text-white">{delivery === 0 ? 'FREE' : `$${delivery}`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-zinc-700">
                  <span className="text-white">Total</span>
                  <span className="text-teal-400">${total}</span>
                </div>
              </div>
              {delivery === 0 && <p className="text-teal-400 text-sm mt-3">🎉 You qualify for free delivery!</p>}
              {delivery > 0 && <p className="text-zinc-400 text-sm mt-3">Add ${200 - subtotal} more for free delivery</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SellItemModal({ isRecycle, onClose, onSubmit }: { isRecycle: boolean; onClose: () => void; onSubmit: (data: SellItemForm, images: string[]) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<SellItemForm>({
    name: '',
    description: '',
    price: '',
    pickupLocation: '',
    quantity: '1',
    category: 'decor',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).slice(0, 3 - images.length).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target?.result as string].slice(0, 3));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!formData.name) {
      toast.error('Please enter item name');
      return;
    }
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }
    if (!formData.pickupLocation) {
      toast.error('Please enter pickup location');
      return;
    }
    if (!isRecycle && !formData.price) {
      toast.error('Please enter price');
      return;
    }
    onSubmit(formData, images);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">
            {isRecycle ? '🎁 List Item for Free' : '💰 Sell Item'}
          </h2>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="mb-4">
          <label className="text-slate-400 text-sm mb-2 block">Upload Pictures (1-3) *</label>
          <div className="border-2 border-dashed border-slate-600 rounded-xl p-4">
            {images.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-20 object-cover rounded-lg" />
                    <button onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-400 text-center py-4">
                <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p>No images uploaded</p>
              </div>
            )}
            {images.length < 3 && (
              <label className="cursor-pointer block text-center bg-slate-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-slate-600 mt-2">
                + Add Image
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <input 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder="Item name *"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" 
          />
          <textarea 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            placeholder="Description"
            rows={2}
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" 
          />
          
          {!isRecycle && (
            <input 
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
              type="number"
              placeholder="Price ($) *"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" 
            />
          )}

          <input 
            value={formData.pickupLocation}
            onChange={e => setFormData({...formData, pickupLocation: e.target.value})}
            placeholder="Pickup Location *"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" 
          />

          <div className="grid grid-cols-2 gap-3">
            <input 
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
              type="number"
              placeholder="Quantity"
              min="1"
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white" 
            />
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white"
            >
              {sellCategories.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleSubmit} className="w-full mt-6 py-3 bg-teal-500 text-white rounded-xl font-bold hover:bg-teal-600">
          {isRecycle ? 'List for Free' : 'List for Sale'}
        </button>
      </div>
    </div>
  );
}

function MarketplaceButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [marketplaceTab, setMarketplaceTab] = useState<'shop' | 'recycle'>('shop');
  const [showSellModal, setShowSellModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();
  
  const { cartItems, addToCart: storeAddToCart, removeFromCart: storeRemoveFromCart, sellerItems, addSellerItem } = useStore();

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [sellerItems]);

  const currentProducts = marketplaceTab === 'shop' ? products : recycledItems;
  
  const sellerProducts: Product[] = sellerItems
    .filter(item => item.isFree === (marketplaceTab === 'recycle'))
    .map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      rating: 5.0,
      reviews: 0,
      eco: 100,
      image: item.images[0] ? '📷' : '📦',
    }));

  const allProducts = [...currentProducts, ...sellerProducts];

  const filtered = allProducts.filter(p => 
    (cat === 'all' || p.category === cat) && 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.price === 0) {
      toast.success(`${product.name} claimed for free!`);
    } else {
      storeAddToCart({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const removeFromCart = (id: string) => {
    storeRemoveFromCart(id);
    toast.info('Item removed from cart');
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const handleSellItem = (data: SellItemForm, images: string[]) => {
    const isRecycleMode = marketplaceTab === 'recycle';
    addSellerItem({
      id: `seller-${Date.now()}`,
      name: data.name,
      description: data.description,
      price: isRecycleMode ? 0 : parseFloat(data.price) || 0,
      pickupLocation: data.pickupLocation,
      quantity: parseInt(data.quantity) || 1,
      category: data.category,
      images: images,
      isFree: isRecycleMode,
    });
    toast.success(isRecycleMode ? 'Item listed for free!' : `Item listed for $${data.price}!`);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-600 transition-colors shadow-lg"
      >
        <ShoppingBag className="w-5 h-5" />
        <span>Marketplace</span>
        {cartItems.length > 0 && (
          <span className="bg-white text-teal-500 text-xs font-bold px-2 py-0.5 rounded-full">
            {cartItems.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-slate-900/50 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Campus Marketplace</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 text-slate-400 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMarketplaceTab('shop')}
              className={`px-6 py-2 rounded-xl font-bold transition-colors ${
                marketplaceTab === 'shop'
                  ? 'bg-teal-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              🛒 Shop
            </button>
            <button
              onClick={() => setMarketplaceTab('recycle')}
              className={`px-6 py-2 rounded-xl font-bold transition-colors ${
                marketplaceTab === 'recycle'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              ♻️ Recycle (Free)
            </button>
          </div>

          <div className="mb-4">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={marketplaceTab === 'shop' ? "Search furniture..." : "Search free items..."}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-teal-500 outline-none"
            />
          </div>

          {marketplaceTab === 'shop' && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                    cat === c 
                      ? 'bg-teal-500 text-white' 
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                >
                  {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowSellModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                marketplaceTab === 'shop'
                  ? 'bg-teal-500 text-white hover:bg-teal-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <Plus className="w-5 h-5" />
              {marketplaceTab === 'shop' ? 'Sell Item' : 'List for Free'}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(p => (
              <div key={p.id} className="bg-slate-700/50 border border-slate-600 rounded-xl overflow-hidden hover:border-teal-500 transition-colors">
                <div className="aspect-square bg-slate-600 flex items-center justify-center text-5xl">
                  {p.image}
                </div>
                <div className="p-3">
                  <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{p.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    {p.price === 0 ? (
                      <span className="text-lg font-bold text-green-400">FREE</span>
                    ) : (
                      <span className="text-lg font-bold text-teal-400">${p.price}</span>
                    )}
                    <span className="text-green-400 text-xs">🌱 {p.eco}%</span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className={`w-full py-2 rounded-lg font-medium text-sm transition-colors ${
                      p.price === 0
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-teal-500 text-white hover:bg-teal-600'
                    }`}
                  >
                    {p.price === 0 ? 'Claim Free' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showCart && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center" onClick={() => setShowCart(false)}>
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Shopping Cart</h3>
              <button onClick={() => setShowCart(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {cartItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="flex items-center gap-3 p-3 bg-slate-700 rounded-xl">
                      <div className="text-2xl">{item.image}</div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{item.name}</h4>
                        <p className="text-slate-400 text-sm">${item.price}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-600 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">Total</span>
                    <span className="text-xl font-bold text-white">${cartTotal}</span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full py-3 bg-teal-500 text-white rounded-lg font-bold hover:bg-teal-600"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showSellModal && (
        <SellItemModal 
          isRecycle={marketplaceTab === 'recycle'} 
          onClose={() => setShowSellModal(false)} 
          onSubmit={handleSellItem}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-teal-500/30">
        <MarketplaceButton />
        <Routes>
          <Route path="/" element={<VibeQuiz />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </div>
    </Router>
  );
}