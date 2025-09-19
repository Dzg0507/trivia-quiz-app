import { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stars } from '@react-three/drei';
import { useControls } from 'leva';
import gsap from 'gsap';
import * as THREE from 'three'; // Import THREE

function Model() {
  const { scene: normalScene } = useGLTF('/models/glow-button.glb');
  const { scene: fracturedScene } = useGLTF('/models/glow-button-fractures1.glb');

  const [isFractured, setIsFractured] = useState(false);
  const fracturedGroupRef = useRef<THREE.Group>(null!); // Explicitly type the ref

  const { position, scale, rotation, visible, showFractured, modelColor, mainColor, secondaryColor, fracturedColor } = useControls({
    position: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.1,
    },
    scale: {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
    },
    rotation: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.01,
    },
    visible: true,
    showFractured: {
      value: false,
      label: 'Show Fractured GLB',
    },
    modelColor: {
      value: '#ffffff', // Default color white
      label: 'Model Color',
    },
    mainColor: {
      value: '#00ff00', // Default green for main
      label: 'Main Color',
    },
    secondaryColor: {
      value: '#000000', // Default black for secondary
      label: 'Secondary Color',
    },
    fracturedColor: {
      value: '#ff0000', // Default red for fractured
      label: 'Fractured Color',
    },
    triggerExplosion: {
      value: false,
      onChange: (v) => {
        if (v) {
          handleExplosion();
        }
      },
      label: 'Explode Button',
    },
    resetModel: {
      value: false,
      onChange: (v) => {
        if (v) {
          handleReset();
        }
      },
      label: 'Reset Model',
    },
  });

  useEffect(() => {
    // Apply general model color
    normalScene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const material = (obj as THREE.Mesh).material as THREE.Material;
        if (material instanceof THREE.MeshStandardMaterial) {
          material.color.set(modelColor);
        }
      }
    });

    fracturedScene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const material = (obj as THREE.Mesh).material as THREE.Material;
        if (material instanceof THREE.MeshStandardMaterial) {
          material.color.set(modelColor);
        }
      }
    });

    // Apply specific colors based on material names (you'll need to adjust these names)
    normalScene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const material = (obj as THREE.Mesh).material as THREE.Material;
        if (material instanceof THREE.MeshStandardMaterial) {
          // Example: Assuming your main color material is named 'mainMaterial'
          if (material.name === 'mainMaterial') {
            material.color.set(mainColor);
          }
          // Example: Assuming your secondary color material is named 'secondaryMaterial'
          if (material.name === 'secondaryMaterial') {
            material.color.set(secondaryColor);
          }
        }
      }
    });

    fracturedScene.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).isMesh) {
        const material = (obj as THREE.Mesh).material as THREE.Material;
        if (material instanceof THREE.MeshStandardMaterial) {
          // Example: Assuming your fractured model has a material named 'fracturedMaterial'
          if (material.name === 'fracturedMaterial') {
            material.color.set(fracturedColor);
          }
        }
      }
    });

  }, [modelColor, mainColor, secondaryColor, fracturedColor, normalScene, fracturedScene]);

  const handleExplosion = () => {
    setIsFractured(true);
    // Trigger explosion animation
    if (fracturedGroupRef.current) {
      fracturedGroupRef.current.children.forEach((child: THREE.Object3D) => {
        const randomX = (Math.random() - 0.5) * 20; // Increased spread
        const randomY = (Math.random() - 0.5) * 20;
        const randomZ = (Math.random() - 0.5) * 20;
        gsap.to(child.position, { x: randomX, y: randomY, z: randomZ, duration: 3, ease: 'power2.out' }); // Increased duration
        gsap.to(child.rotation, { x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2, z: Math.random() * Math.PI * 2, duration: 3, ease: 'power2.out' }); // Increased duration
        // Ensure child has a material before trying to animate it
        if ((child as THREE.Mesh).material) {
          gsap.to((child as THREE.Mesh).material, { opacity: 0, duration: 2, ease: 'power2.out', delay: 1.5 }); // Increased delay and duration
          ((child as THREE.Mesh).material as THREE.Material).transparent = true; // Enable transparency
        }
        gsap.to(child.scale, { x: 0.1, y: 0.1, z: 0.1, duration: 2, ease: 'power2.out', delay: 1.5 }); // Shrink slightly
      });
    }
  };

  const handleReset = () => {
    setIsFractured(false);
    if (fracturedGroupRef.current) {
      fracturedGroupRef.current.children.forEach((child: THREE.Object3D) => {
        // Reset position, rotation, and scale to initial values
        gsap.to(child.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(child.rotation, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(child.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        if ((child as THREE.Mesh).material) {
          gsap.to((child as THREE.Mesh).material, { opacity: 1, duration: 0.5 });
        }
      });
    }
  };

  // Reset materials to be opaque when the component mounts or isFractured changes
  useEffect(() => {
    if (!isFractured && fracturedGroupRef.current) {
      fracturedGroupRef.current.traverse((obj: THREE.Object3D) => {
        if ((obj as THREE.Mesh).isMesh) {
          const material = (obj as THREE.Mesh).material as THREE.Material;
          material.transparent = false; // Make it opaque
          material.opacity = 1;
        }
      });
    }
  }, [isFractured]);

  return (
    <group
      position={[position.x, position.y, position.z]}
      scale={scale}
      rotation={[rotation.x, rotation.y, rotation.z]}
      visible={visible}
    >
      {!showFractured && !isFractured && (
        <primitive object={normalScene.clone()} onClick={handleExplosion} />
      )}
      {(showFractured || isFractured) && (
        <primitive ref={fracturedGroupRef} object={fracturedScene.clone()} />
      )}
    </group>
  );
}

export default function ThreeDPlayground() {
  return (
    <Canvas camera={{ position: [0, 0, 10], far: 10000 }} style={{ background: 'black' }} className="w-full h-full">
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />
      <Model />
      <OrbitControls makeDefault target={[0, 0, 0]} />
      <Stars radius={1000} depth={1000} count={10000} factor={10} saturation={1} fade />
    </Canvas>
  );
}