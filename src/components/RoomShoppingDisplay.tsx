import React, { useState } from 'react';
import { Product } from '../../shared/types';
import { ArrowLeft } from 'lucide-react';

interface RoomShoppingDisplayProps {
  roomImageUrl: string;
  products: Product[];
  vibeName: string;
  onBack: () => void;
}

interface HotspotMarkerProps {
  product: Product;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

interface ProductPanelProps {
  product: Product;
  onClose: () => void;
}

const autoDistributeHotspots = (products: Product[]): Product[] => {
  const defaultPositions = [
    { x: 25, y: 40 },   // desk area left
    { x: 70, y: 65 },   // bed area
    { x: 50, y: 20 },   // wall center upper
    { x: 15, y: 55 },   // left corner
    { x: 82, y: 38 },   // right shelf area
    { x: 45, y: 82 },   // floor area
    { x: 60, y: 12 },   // top wall (lights)
    { x: 35, y: 50 },   // desk surface
  ];

  return products.map((product, i) => ({
    ...product,
    hotspot: product.hotspot || defaultPositions[i % defaultPositions.length]
  }));
};

const HotspotMarker: React.FC<HotspotMarkerProps> = ({ product, index, isActive, onClick }) => {
  const position = product.hotspot || { x: 50, y: 50 };

  return (
    <button
      className={`hotspot-marker ${isActive ? 'active' : ''}`}
      style={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%) translateZ(30px)',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <span className="hotspot-ping" />
      <span className="hotspot-dot" />
      <span className="hotspot-label">{product.name}</span>
    </button>
  );
};

const ProductPanel: React.FC<ProductPanelProps> = ({ product, onClose }) => (
  <div className="product-panel">
    <button className="close-btn" onClick={onClose}>✕</button>

    <div className="product-info">
      <span className="product-category">{product.category}</span>
      <h3>{product.name}</h3>
      <p className="product-price">{product.priceRange}</p>
    </div>

    <div className="product-actions">
      <a
        href={`https://www.amazon.com/s?k=${encodeURIComponent(product.searchQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn amazon"
      >
        Shop on Amazon ↗
      </a>
      <a
        href={`https://www.ikea.com/us/en/search/?q=${encodeURIComponent(product.searchQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn ikea"
      >
        Shop on IKEA ↗
      </a>
      <a
        href={`https://s.taobao.com/search?q=${encodeURIComponent(product.searchQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="shop-btn taobao"
      >
        淘宝搜索 ↗
      </a>
    </div>
  </div>
);

const RoomShoppingDisplay: React.FC<RoomShoppingDisplayProps> = ({ roomImageUrl, products, vibeName, onBack }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [processedProducts] = useState(autoDistributeHotspots(products));

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const rotateY = ((clientX / innerWidth) - 0.5) * 10;
    const rotateX = ((clientY / innerHeight) - 0.5) * -5;

    setMouseX(rotateY);
    setMouseY(rotateX);
  };

  return (
    <div className="room-display-wrapper">
      <header>
        <button onClick={onBack} className="back-btn">
          <ArrowLeft className="w-5 h-5" />
          Back to shopping
        </button>
        <h2>Shop Your "{vibeName}"</h2>
        <p>Click the markers to explore products</p>
      </header>

      <div className="room-scene" onMouseMove={handleMouseMove}>
        <div 
          className="room-box"
          style={{
            transformStyle: 'preserve-3d' as const,
            transform: `rotateY(${mouseX}deg) rotateX(${mouseY}deg)`
          }}
        >
          <div className="room-image">
            <img src={roomImageUrl} alt={vibeName} />
            {processedProducts.map((product, index) => (
              <HotspotMarker
                key={index}
                product={product}
                index={index}
                isActive={activeHotspot === index}
                onClick={() => setActiveHotspot(activeHotspot === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>

      {activeHotspot !== null && (
        <ProductPanel
          product={processedProducts[activeHotspot]}
          onClose={() => setActiveHotspot(null)}
        />
      )}
    </div>
  );
};

export default RoomShoppingDisplay;