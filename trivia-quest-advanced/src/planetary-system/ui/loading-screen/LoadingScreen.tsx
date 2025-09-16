import { useProgress } from '@react-three/drei';
import React from 'react';

const LoadingScreen = () => {
  const { progress } = useProgress();
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'black', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <h1>Loading... {Math.round(progress)}%</h1>
    </div>
  );
};

export default LoadingScreen;
