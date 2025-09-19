import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
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
    if (!target) return;

    const planetObject = scene.getObjectByName(target.planetName) as THREE.Object3D | undefined;

    // Resolve the world-space target position
    let targetPosition = new THREE.Vector3();

    // 1) If we have an explicit objectName, try to use that object's world position
    if (target.objectName) {
      const namedObject = scene.getObjectByName(target.objectName) as THREE.Object3D | undefined;
      if (namedObject) {
        namedObject.getWorldPosition(targetPosition);
      }
    }

    // 2) If position is provided (local to planet), transform it to world space
    if (targetPosition.lengthSq() === 0 && target.position) {
      const local = new THREE.Vector3(...target.position);
      if (planetObject) {
        targetPosition = planetObject.localToWorld(local.clone());
      } else {
        // Fallback: treat as world position if planet object is missing
        targetPosition.copy(local);
      }
    }

    // 3) Final fallback: use the planet's world position
    if (targetPosition.lengthSq() === 0 && planetObject) {
      planetObject.getWorldPosition(targetPosition);
    }

    // Compute a reasonable camera offset based on bounds of the best object we have
    let referenceObject: THREE.Object3D | undefined = undefined;
    if (target.objectName) {
      referenceObject = scene.getObjectByName(target.objectName) as THREE.Object3D | undefined;
    }
    if (!referenceObject) referenceObject = planetObject;

    let cameraOffset = 5;
    if (referenceObject) {
      const boundingBox = new THREE.Box3().setFromObject(referenceObject);
      const size = boundingBox.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      cameraOffset = Math.max(5, maxDim * 2);
    }

    const cameraPosition = targetPosition.clone().add(new THREE.Vector3(0, 0, cameraOffset));

    gsap.to(camera.position, {
      duration: 1.2,
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
        duration: 1.2,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: 'power3.inOut',
      });
    }
  }, [target, camera, scene, controls]);

  return null;
};

export default CameraAnimator;
