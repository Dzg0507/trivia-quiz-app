import React from 'react';
import './ArrowNavigation.css';

interface ArrowNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ArrowNavigation: React.FC<ArrowNavigationProps> = ({ onNext, onPrevious }) => {
  return (
    <div className="arrow-navigation">
      <div className="arrow left" onClick={onPrevious}>
        &#9664;
      </div>
      <div className="arrow right" onClick={onNext}>
        &#9654;
      </div>
    </div>
  );
};

export default ArrowNavigation;
