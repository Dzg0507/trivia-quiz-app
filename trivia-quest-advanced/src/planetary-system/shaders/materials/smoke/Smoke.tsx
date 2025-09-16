import React, { useRef, useMemo } from "react";
import { shaderMaterial, useTexture } from "@react-three/drei";
import { useFrame, RootState, ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

// Import the new shader files you just created
import vertex from "./vertex.glsl";
import fragment from "./fragment.glsl";

// Define a type for our material instance
type SmokeMaterialImpl = THREE.ShaderMaterial & {
  time: number;
  map: THREE.Texture;
};

function Smoke({ ...props }: ThreeElements["mesh"]) {
  const smokeTexture = useTexture("/planetary-system/smoke_column.png");
  smokeTexture.wrapT = smokeTexture.wrapS = THREE.RepeatWrapping;

  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    const SmokeMaterial = shaderMaterial(
      {
        time: 0,
        map: smokeTexture,
      },
      vertex,
      fragment
    );
    return new SmokeMaterial();
  }, [smokeTexture]);

  useFrame((state: RootState) => {
    if (material && meshRef.current) {
      (material as SmokeMaterialImpl).time = state.clock.elapsedTime;
      meshRef.current.rotation.y = Math.atan2(
        state.camera.position.x - meshRef.current.position.x,
        state.camera.position.z - meshRef.current.position.z
      );
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <planeGeometry args={[1.5, 15, 50, 50]} />
      <primitive
        object={material}
        attach="material"
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

export default Smoke;
