import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';

const vertexShader = `
  uniform float u_time;
  uniform vec2 u_mouse;

  varying float v_dist;

  void main() {
    vec3 pos = position;

    // More complex animation
    float time = u_time * 0.3;
    pos.x += sin(pos.y * 1.5 + time) * cos(pos.x * 1.5 + time) * 0.7;
    pos.y += cos(pos.z * 1.5 + time) * sin(pos.y * 1.5 + time) * 0.7;
    pos.z += sin(pos.x * 1.5 + time) * cos(pos.z * 1.5 + time) * 0.7;

    // Mouse interaction
    float dist = distance(pos.xy, u_mouse);
    pos.z += smoothstep(0.0, 1.5, 1.5 - dist) * 2.0;

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 4.0;

    v_dist = dist;
  }
`;

const fragmentShader = `
  uniform float u_time;
  varying float v_dist;

  void main() {
    float alpha = smoothstep(0.0, 1.0, 1.0 - v_dist);
    gl_FragColor = vec4(0.2, 0.5, 1.0, alpha);
  }
`;

const Particles = () => {
  const count = 5000;
  const { viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * viewport.width;
      const y = (Math.random() - 0.5) * viewport.height;
      const z = (Math.random() - 0.5) * 5;
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count, viewport.width, viewport.height]);

  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(mousePos.x, mousePos.y) },
  }), [mousePos]);

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.u_time.value = clock.getElapsedTime();
      shaderRef.current.uniforms.u_mouse.value.x = mousePos.x * (viewport.width / 2);
      shaderRef.current.uniforms.u_mouse.value.y = mousePos.y * (viewport.height / 2);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={shaderRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </points>
  );
};

const SceneContent = () => {
  return (
    <>
      <Particles />
    </>
  );
};

const LoomScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 60 }}>
      <SceneContent />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} />
        <DepthOfField focusDistance={0.0} focalLength={0.2} bokehScale={2} />
      </EffectComposer>
    </Canvas>
  );
};

export default LoomScene;
