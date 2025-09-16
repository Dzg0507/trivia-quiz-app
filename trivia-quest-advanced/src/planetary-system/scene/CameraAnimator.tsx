import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

type CameraTarget = {
  planetName: string;
  objectName?: string;
  position?: [number, number, number];
} | null;

interface CameraAnimatorProps {
  target: CameraTarget;
}

const CameraAnimator: React.FC<CameraAnimatorProps> = ({ target }) => {
  const { camera, scene, controls } = useThree();

  useEffect(() => {
    if (target) {
      const targetObject = target.objectName ? scene.getObjectByName(target.objectName) : scene.getObjectByName(target.planetName);

      if (targetObject) {
        const targetPosition = new THREE.Vector3();
        targetObject.getWorldPosition(targetPosition);

        const boundingBox = new THREE.Box3().setFromObject(targetObject);
        const size = boundingBox.getSize(new THREE.Vector3());
        const cameraOffset = Math.max(size.x, size.y, size.z) * 2;
        const cameraPosition = targetPosition.clone().add(new THREE.Vector3(0, 0, cameraOffset));

        gsap.to(camera.position, {
          duration: 1.5,
          x: cameraPosition.x,
          y: cameraPosition.y,
          z: cameraPosition.z,
          ease: 'power3.inOut',
          onUpdate: () => {
            camera.lookAt(targetPosition);
          },
        });

        if (controls) {
          // @ts-expect-error: The 'controls' object is generic, but we know it has a .target property.
          gsap.to(controls.target, {
            duration: 1.5,
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            ease: 'power3.inOut',
          });
        }
      }
    }
  }, [target, camera, scene, controls]);

  return null;
};

export default CameraAnimator;