import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

const Loom = () => {
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.001;
      group.current.rotation.x += 0.0005;
    }
  });

  const loomParts = useMemo(() => {
    const parts = [];
    const mainArm = new THREE.BoxGeometry(0.2, 10, 0.2);
    const gear = new THREE.TorusGeometry(1.5, 0.1, 8, 32);
    const smallGear = new THREE.TorusKnotGeometry(0.5, 0.05, 100, 16);
    const connection = new THREE.CylinderGeometry(0.05, 0.05, 6, 16);

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      parts.push({
        geometry: mainArm,
        position: [Math.sin(angle) * 4, 0, Math.cos(angle) * 4],
        rotation: [0, angle, Math.PI / 2],
      });
    }

    parts.push({ geometry: gear, position: [0, 4, 0], rotation: [Math.PI / 2, 0, 0] });
    parts.push({ geometry: gear, position: [0, -4, 0], rotation: [Math.PI / 2, 0, 0] });
    parts.push({ geometry: smallGear, position: [2, 2, 2], rotation: [Math.random(), Math.random(), Math.random()] });
    parts.push({ geometry: smallGear, position: [-2, -2, -2], rotation: [Math.random(), Math.random(), Math.random()] });
    parts.push({ geometry: connection, position: [0, 0, 0], rotation: [0, 0, 0] });

    return parts;
  }, []);

  return (
    <group ref={group} position={[0, 0, -8]}>
      {loomParts.map((part, i) => (
        <mesh key={i} position={new THREE.Vector3(...part.position)} rotation={new THREE.Euler(...part.rotation)}>
          <primitive object={part.geometry} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.7} metalness={1} emissive="#000000" />
        </mesh>
      ))}
    </group>
  );
};

const Shuttle = React.forwardRef((props, ref) => {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.01;
    }
  });

  return (
    <group {...props} ref={ref}>
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="black" roughness={0.1} metalness={0.8} emissive="#111111" />
        </mesh>
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.sin(angle) * 0.2, 0, Math.cos(angle) * 0.2]}
              rotation={[Math.PI / 2, 0, angle]}
            >
              <cylinderGeometry args={[0.02, 0.01, 0.4, 8]} />
              <meshStandardMaterial color="#b5a642" roughness={0.4} metalness={1} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
});

import { vertexShader, fragmentShader } from './threadShaders';

const Thread = ({ curve, material, progress }) => {
  const geometryRef = useRef<THREE.TubeGeometry>(null);
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_color: { value: new THREE.Color(material.color) },
      },
      transparent: true,
    });
  }, [material.color]);

  useFrame(({ clock }) => {
    shaderMaterial.uniforms.u_time.value = clock.getElapsedTime();
  });

  useEffect(() => {
    if (geometryRef.current) {
      const totalLength = geometryRef.current.attributes.position.count;
      geometryRef.current.setDrawRange(0, totalLength * progress);
    }
  }, [progress]);

  return (
    <mesh>
      <tubeGeometry ref={geometryRef} args={[curve, 64, 0.02, 8, false]} />
      <primitive object={shaderMaterial} />
    </mesh>
  );
};


const TitleWeave = ({ letterCurves, progress }) => {
  return (
    <group>
      {letterCurves.map((curve, i) => (
        <Thread
          key={i}
          curve={curve}
          material={new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false })}
          progress={progress}
        />
      ))}
    </group>
  );
};

const useLoomController = (threads, titleThreads, unravel) => {
  const { camera } = useThree();
  const shuttleRefs = useRef(threads.map(() => React.createRef<THREE.Group>()));
  const [titleProgress, setTitleProgress] = useState(0);
  const [threadProgress, setThreadProgress] = useState(threads.map(() => 0));

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    // Main weaving animation
    threads.forEach((thread, i) => {
      const shuttle = shuttleRefs.current[i].current;
      if (!shuttle) return;
      tl.to(shuttle.position, {
        duration: 4,
        motionPath: { path: thread.curve.getPoints(50).map(p => ({x: p.x, y: p.y, z: p.z})), align: "self" },
      }, i * 0.5);

      const progress = { value: 0 };
      tl.to(progress, {
        value: 1,
        duration: 4,
        ease: 'power1.inOut',
        onUpdate: () => {
          setThreadProgress(prev => {
            const newProgress = [...prev];
            newProgress[i] = progress.value;
            return newProgress;
          });
        }
      }, i * 0.5);
    });

    // Title weave animation
    tl.to({ value: 0 }, {
      value: 1,
      duration: 2,
      onUpdate: function() {
        setTitleProgress(this.targets()[0].value);
      }
    }, "-=1"); // Overlap with the end of the main animation

    if (unravel) {
      tl.reverse();
    } else {
      tl.play();
    }

    return () => tl.kill();
  }, [threads, titleThreads, camera, unravel]);

  return { shuttleRefs, titleProgress, threadProgress };
};

const LoomScene = ({ inspect, unravel }) => {
  const threads = useMemo(() => [
    // ... same thread definitions
        {
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, -3, -5),
        new THREE.Vector3(0, 3, -5),
        new THREE.Vector3(4, -3, -5),
      ]),
      material: new THREE.MeshBasicMaterial({ color: '#00ffff', toneMapped: false }),
      progress: 0,
    },
    {
      curve: new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4, 3, -5),
        new THREE.Vector3(0, -3, -5),
        new THREE.Vector3(4, 3, -5),
      ]),
      material: new THREE.MeshBasicMaterial({ color: '#ff00ff', toneMapped: false }),
      progress: 0,
    },
  ], []);

  const letterCurves = useMemo(() => {
    const letterSpacing = 2;
    const startX = -5;
    const y = 0;
    const z = -4;

    const t = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, y + 1, z),
        new THREE.Vector3(startX + 2, y + 1, z),
    ]);
    const t_stem = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX + 1, y + 1, z),
        new THREE.Vector3(startX + 1, y - 1, z),
    ]);
    const e = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX + letterSpacing * 1 + 2, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 1, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 1, y, z),
        new THREE.Vector3(startX + letterSpacing * 1 + 2, y, z),
        new THREE.Vector3(startX + letterSpacing * 1, y, z),
        new THREE.Vector3(startX + letterSpacing * 1, y - 1, z),
        new THREE.Vector3(startX + letterSpacing * 1 + 2, y - 1, z),
    ]);
    const n = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX + letterSpacing * 2, y - 1, z),
        new THREE.Vector3(startX + letterSpacing * 2, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 2 + 2, y - 1, z),
        new THREE.Vector3(startX + letterSpacing * 2 + 2, y + 1, z),
    ]);
    const s = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX + letterSpacing * 3 + 2, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 3, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 3, y, z),
        new THREE.Vector3(startX + letterSpacing * 3 + 2, y, z),
        new THREE.Vector3(startX + letterSpacing * 3 + 2, y - 1, z),
        new THREE.Vector3(startX + letterSpacing * 3, y - 1, z),
    ]);
    const o = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX + letterSpacing * 4, y, z),
        new THREE.Vector3(startX + letterSpacing * 4, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 4 + 2, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 4 + 2, y - 1, z),
        new THREE.Vector3(startX + letterSpacing * 4, y - 1, z),
        new THREE.Vector3(startX + letterSpacing * 4, y, z),
    ]);
    const r = new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX + letterSpacing * 5, y - 1, z),
        new THREE.Vector3(startX + letterSpacing * 5, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 5 + 2, y + 1, z),
        new THREE.Vector3(startX + letterSpacing * 5 + 2, y, z),
        new THREE.Vector3(startX + letterSpacing * 5, y, z),
        new THREE.Vector3(startX + letterSpacing * 5 + 2, y - 1, z),
    ]);
    return [t, t_stem, e, n, s, o, r];
  }, []);

  const { shuttleRefs, titleProgress, threadProgress } = useLoomController(threads, letterCurves, unravel);
  const { camera } = useThree();

  useEffect(() => {
    if (inspect) {
      gsap.to(camera.position, { z: 5, duration: 1 });
    } else {
      gsap.to(camera.position, { z: 10, duration: 1 });
    }
  }, [inspect, camera]);

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
      <ambientLight intensity={0.2} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="magenta" />
      <Loom />
      {threads.map((thread, i) => (
        <React.Fragment key={i}>
          <Shuttle ref={shuttleRefs.current[i]} position={thread.curve.getPoint(0)} />
          <Thread {...thread} progress={threadProgress[i]} />
        </React.Fragment>
      ))}
      <TitleWeave letterCurves={letterCurves} progress={titleProgress} />
      <OrbitControls />
    </Canvas>
  );
};

export default LoomScene;
