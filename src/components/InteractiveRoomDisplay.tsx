import React, { useRef, useEffect, useState } from 'react';
import './InteractiveRoomDisplay.css';

interface Product {
  name: string;
  category: string;
  priceRange: string;
  searchQuery: string;
}

interface IdentifiedProduct extends Product {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  confidence: number;
  description: string;
}

interface InteractiveRoomDisplayProps {
  imageUrl?: string;
  vibeName: string;
  products?: Product[];
}

const InteractiveRoomDisplay: React.FC<InteractiveRoomDisplayProps> = ({ 
  imageUrl, 
  vibeName, 
  products = [] 
}) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [currentOpenItem, setCurrentOpenItem] = useState<HTMLElement | null>(null);
  const [lockedTilt, setLockedTilt] = useState(false);
  const [slideSizes, setSlideSizes] = useState({ width: 0, height: 0 });
  const [identifiedProducts, setIdentifiedProducts] = useState<IdentifiedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch AI-identified product positions
  useEffect(() => {
    const identifyProducts = async () => {
      if (!imageUrl || products.length === 0) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/identify-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl,
            products,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to identify products');
        }

        const data = await response.json();
        
        // Merge AI positions with product data
        const mergedProducts: IdentifiedProduct[] = data.products.map((identified: any) => {
          const originalProduct = products.find(p => p.name === identified.name);
          return {
            ...originalProduct,
            ...identified,
          } as IdentifiedProduct;
        });

        setIdentifiedProducts(mergedProducts);
      } catch (error) {
        console.warn('AI identification failed, using fallback positions:', error);
        // Use fallback grid positioning
        const fallbackProducts: IdentifiedProduct[] = products.map((product, index) => {
          const cols = 3;
          const row = Math.floor(index / cols);
          const col = index % cols;
          
          return {
            ...product,
            position: {
              x: 20 + (col * 25),
              y: 25 + (row * 30),
            },
            size: {
              width: 15,
              height: 15,
            },
            confidence: 0.7,
            description: `${product.name} - ${product.category}`,
          };
        });
        setIdentifiedProducts(fallbackProducts);
      } finally {
        setIsLoading(false);
      }
    };

    identifyProducts();
  }, [imageUrl, products]);

  useEffect(() => {
    if (sceneRef.current) {
      setSlideSizes({
        width: sceneRef.current.offsetWidth,
        height: sceneRef.current.offsetHeight
      });
    }

    const handleResize = () => {
      if (sceneRef.current) {
        setSlideSizes({
          width: sceneRef.current.offsetWidth,
          height: sceneRef.current.offsetHeight
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      if (lockedTilt || !sceneRef.current) return;

      const mousepos = getMousePos(ev);
      rotateSlide(mousepos);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, [lockedTilt, slideSizes]);

  const getMousePos = (e: MouseEvent) => {
    let posx = 0;
    let posy = 0;
    if (!e) e = window.event as MouseEvent;
    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    return {
      x: posx,
      y: posy
    };
  };

  const rotateSlide = (mousepos: { x: number; y: number }) => {
    if (!sceneRef.current) return;

    const movement = { rotateX: 5, rotateY: 10 };
    const rotX = movement.rotateX ? 2 * movement.rotateX / slideSizes.height * mousepos.y - movement.rotateX : 0;
    const rotY = movement.rotateY ? 2 * movement.rotateY / slideSizes.width * mousepos.x - movement.rotateY : 0;

    sceneRef.current.style.transform = `rotate3d(1,0,0,${rotX}deg) rotate3d(0,1,0,${rotY}deg)`;
  };

  const openItem = (item: HTMLElement) => {
    if (isItemOpen) return;

    setIsItemOpen(true);
    setLockedTilt(true);
    setCurrentOpenItem(item);

    const view = item.parentElement;
    if (view) {
      view.style.zIndex = '10';
      const views = view.parentElement;
      if (views) {
        views.classList.add('view-open');
      }
    }

    const itemImg = item.querySelector('img');
    if (itemImg) {
      itemImg.style.transform = 'translate3d(0,0,0) scale3d(1.3, 1.3, 1)';
    }

    item.classList.add('item--popup');
  };

  const closeItem = (item: HTMLElement) => {
    setIsItemOpen(false);
    setLockedTilt(false);

    const view = item.parentElement;
    const views = view?.parentElement;

    if (views) {
      views.classList.remove('view-open');
    }

    item.classList.remove('item--popup');

    const itemImg = item.querySelector('img');
    if (itemImg && itemImg.getAttribute('data-transform-z')) {
      const transformZ = itemImg.getAttribute('data-transform-z');
      setTimeout(() => {
        itemImg.style.transform = `translate3d(0,0,${transformZ}px)`;
        
        if (view) {
          view.style.zIndex = '1';
        }
      }, 60);
    }

    setCurrentOpenItem(null);
  };

  if (!imageUrl) {
    return (
      <div className="relative group">
        <div className="absolute -inset-1 bg-teal-500/20 rounded-[2rem] blur-2xl group-hover:bg-teal-500/30 transition-all" />
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-video">
          <div className="w-full h-full flex items-center justify-center text-zinc-600 italic">
            Room display loading...
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative group">
        <div className="absolute -inset-1 bg-teal-500/20 rounded-[2rem] blur-2xl group-hover:bg-teal-500/30 transition-all" />
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden aspect-video">
          <img 
            className="w-full h-full object-cover opacity-50"
            src={imageUrl} 
            alt={vibeName}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-teal-400 font-bold animate-pulse">
              Analyzing room items...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="slideshow">
      <div className="slide slide--current">
        <div className="scene" ref={sceneRef}>
          <div className="views">
            <div className="view">
              <img className="view__img" src={imageUrl} alt={vibeName} />
              {identifiedProducts.map((product, index) => (
                <div 
                  key={index} 
                  className="item"
                  ref={el => itemRefs.current[index] = el}
                  style={{
                    position: 'absolute',
                    left: `${product.position.x}%`,
                    top: `${product.position.y}%`,
                    width: `${product.size.width}%`,
                    height: `${product.size.height}%`,
                    cursor: 'pointer',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <img 
                    className="item__img"
                    src={imageUrl} 
                    alt={product.name}
                    data-transform-z="60"
                    onClick={() => itemRefs.current[index] && openItem(itemRefs.current[index] as HTMLElement)}
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  />
                  <div className="item__info">
                    <h3 className="item__title">{product.name}</h3>
                    <div className="item__price">{product.priceRange}</div>
                    <p className="text-sm text-zinc-400 mb-2">{product.description}</p>
                    <button className="button button--buy">
                      <i className="icon icon--shopping-cart"></i>
                      <span className="text-hidden">Add to cart</span>
                    </button>
                  </div>
                  <button 
                    className="button button--close"
                    onClick={() => itemRefs.current[index] && closeItem(itemRefs.current[index] as HTMLElement)}
                  >
                    <i className="icon icon--close"></i>
                    <span className="text-hidden">Close</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveRoomDisplay;
