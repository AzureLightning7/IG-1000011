import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Product, IdentifiedProduct } from '../../shared/types';
import './InteractiveRoomDisplay.css';

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
  const [isItemOpen, setIsItemOpen] = useState(false);
  const [currentOpenItem, setCurrentOpenItem] = useState<IdentifiedProduct | null>(null);
  const [lockedTilt, setLockedTilt] = useState(false);
  const [identifiedProducts, setIdentifiedProducts] = useState<IdentifiedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [slideSizes, setSlideSizes] = useState({ width: 0, height: 0 });
  
  const sceneRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate slide sizes
  useEffect(() => {
    const updateSlideSizes = () => {
      if (containerRef.current) {
        setSlideSizes({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateSlideSizes();
    window.addEventListener('resize', updateSlideSizes);
    return () => window.removeEventListener('resize', updateSlideSizes);
  }, []);

  // Track mouse movement for 3D effect
  useEffect(() => {
    if (lockedTilt) return;

    let rafId: number | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current || slideSizes.width === 0 || slideSizes.height === 0) return;

      // Cancel any pending frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Schedule update on next animation frame for smooth 60fps
      rafId = requestAnimationFrame(() => {
        if (!sceneRef.current) return;

        // Calculate relative mouse position within the container
        const rect = sceneRef.current.getBoundingClientRect();
        const mousepos = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };

        const movement = { rotateX: 5, rotateY: 10 };
        const rotX = 2 * movement.rotateX / slideSizes.height * mousepos.y - movement.rotateX;
        const rotY = 2 * movement.rotateY / slideSizes.width * mousepos.x - movement.rotateY;
        
        sceneRef.current.style.transform = 
          `rotate3d(1,0,0,${rotX}deg) rotate3d(0,1,0,${rotY}deg)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [lockedTilt, slideSizes]);



  // Fallback grid positioning
  const getFallbackPositions = useCallback((): IdentifiedProduct[] => {
    const positions = [
      { x: 20, y: 25 },
      { x: 45, y: 25 },
      { x: 70, y: 25 },
      { x: 20, y: 55 },
      { x: 45, y: 55 },
      { x: 70, y: 55 },
      { x: 20, y: 85 },
      { x: 45, y: 85 },
      { x: 70, y: 85 }
    ];

    return products.map((product, index) => ({
      ...product,
      position: positions[index % positions.length],
      size: { width: 15, height: 15 },
      confidence: 100,
      description: product.name
    }));
  }, [products]);

  // Identify products using AI
  useEffect(() => {
    const identifyProducts = async () => {
      if (!imageUrl) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/identify-products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            imageUrl, 
            products 
          })
        });

        if (response.ok) {
          const data = await response.json();
          setIdentifiedProducts(data.products || getFallbackPositions());
        } else {
          // Fallback to grid layout if API fails
          setIdentifiedProducts(getFallbackPositions());
        }
      } catch {
        // Fallback to grid layout on error
        setIdentifiedProducts(getFallbackPositions());
      } finally {
        setIsLoading(false);
      }
    };

    if (imageUrl && products.length > 0) {
      identifyProducts();
    }
  }, [imageUrl, products, getFallbackPositions]);

  const handleItemClick = (product: IdentifiedProduct) => {
    setCurrentOpenItem(product);
    setIsItemOpen(true);
    setLockedTilt(true);
  };

  const handleClosePopup = () => {
    setIsItemOpen(false);
    setCurrentOpenItem(null);
    setLockedTilt(false);
  };

  if (!imageUrl) {
    return (
      <div className="slideshow-container">
        <div className="loading-state">
          <p>Loading room display...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slideshow-container" ref={containerRef}>
      <div className="slideshow">
        <div className="scene" ref={sceneRef}>
          <div className="slide">
            <img 
              src={imageUrl} 
              alt={`${vibeName} room`} 
              className="room-image"
            />
            
            {/* Product items */}
            {identifiedProducts.map((product, index) => (
              <motion.div
                key={index}
                className={`product-item ${isItemOpen && currentOpenItem?.name !== product.name ? 'faded' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${product.position.x}%`,
                  top: `${product.position.y}%`,
                  width: `${product.size.width}%`,
                  height: `${product.size.height}%`,
                  transform: 'translate(-50%, -50%)',
                  opacity: isItemOpen && currentOpenItem?.name !== product.name ? 0.3 : 1
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleItemClick(product)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${product.name}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(product);
                  }
                }}
              >
                <div className="product-marker">
                  <span className="product-name">{product.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Product popup */}
      {isItemOpen && currentOpenItem && (
        <motion.div 
          className="product-popup"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <button 
            className="close-button"
            onClick={handleClosePopup}
          >
            <X className="w-6 h-6" />
          </button>
          <h3 className="popup-title">{currentOpenItem.name}</h3>
          <p className="popup-category">{currentOpenItem.category}</p>
          <p className="popup-price">{currentOpenItem.priceRange}</p>
          <p className="popup-description">{currentOpenItem.description}</p>
          <button className="shop-button">
            Shop This Item
          </button>
        </motion.div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>Analyzing room...</p>
        </div>
      )}
    </div>
  );
};

export default InteractiveRoomDisplay;