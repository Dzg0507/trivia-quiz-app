import { OrbitControls } from '@react-three/drei';
import { useSolarSystemStore } from '../States';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CamControls = () => {
  const { selectedPlanet } = useSolarSystemStore();
  const { scene, controls } = useThree();
  const controlsRef = useRef(controls);

  useEffect(() => {
    if (selectedPlanet) {
      const planetObject = scene.getObjectByName(selectedPlanet);
      if (planetObject && controlsRef.current) {
        const targetPosition = new THREE.Vector3();
        planetObject.getWorldPosition(targetPosition);
        controlsRef.current.target.copy(targetPosition);
      }
    }
  }, [selectedPlanet, scene, controls]);

  return <OrbitControls ref={controlsRef} />;
};

export default CamControls;
