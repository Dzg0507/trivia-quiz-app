import React from 'react';
import './ArrowNavigation.css';

interface ArrowNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  position: { x: number; y: number };
}

const ArrowNavigation: React.FC<ArrowNavigationProps> = ({ onNext, onPrevious, position }) => {
  if (!position) return null;

  return (
    <div className="arrow-container" style={{ position: 'absolute', top: `${position.y}px`, left: `${position.x}px`, transform: 'translate(-50%, -50%)' }}>
      <div className="arrow-navigation">
        <div className="arrow left" onClick={onPrevious}>
          &#9664;
        </div>
        <div className="arrow right" onClick={onNext}>
          &#9654;
        </div>
      </div>
    </div>
  );
};

export default ArrowNavigation;
