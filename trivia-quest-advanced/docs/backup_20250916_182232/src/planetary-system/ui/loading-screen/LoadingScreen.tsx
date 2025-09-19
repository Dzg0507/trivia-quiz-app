import { useProgress } from '@react-three/drei';
import React from 'react';

const LoadingScreen = () => {
  // Get the 'active' state, which is true when loading and false when done
  const { active, progress } = useProgress();

  return (
    // Use the 'active' state to control the visibility and opacity
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#050505', // Match the scene background
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      // Fade out when not active
      opacity: active ? 1 : 0,
      // Hide the element completely when not active so it doesn't block clicks
      pointerEvents: active ? 'auto' : 'none',
      // Add a smooth transition for the fade-out effect
      transition: 'opacity 0.5s ease-out'
    }}>
      <h1>Loading... {Math.round(progress)}%</h1>
    </div>
  );
};

export default LoadingScreen;