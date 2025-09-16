import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// Define the camera target type again
type CameraTarget = {
  planetName: string;
  objectName?: string;
} | null;

interface CameraAnimatorProps {
  target: CameraTarget;
}

const CameraAnimator: React.FC<CameraAnimatorProps> = ({ target }) => {
  const { camera, scene, controls } = useThree();

  useEffect(() => {
    if (target) {
      const targetObject = scene.getObjectByName(target.planetName);

      if (targetObject) {
        const planetPosition = new THREE.Vector3();
        targetObject.getWorldPosition(planetPosition);

        const finalPosition = target.position
            ? planetPosition.add(new THREE.Vector3(...target.position))
            : planetPosition;

        gsap.to(camera.position, {
          duration: 0.5,
          x: finalPosition.x + 5,
          y: finalPosition.y + 2,
          z: finalPosition.z + 5,
          ease: 'power3.inOut',
        });

        if (controls) {
          // FIX: Updated the comment to satisfy the ESLint rule.
          // @ts-expect-error: The 'controls' object is generic, but we know it has a .target property.
          gsap.to(controls.target, {
            duration: 0.5,
            x: finalPosition.x,
            y: finalPosition.y,
            z: finalPosition.z,
            ease: 'power3.inOut',
          });
        }
      }
    }
  }, [target, camera, scene, controls]);

  return null;
};

export default CameraAnimator;