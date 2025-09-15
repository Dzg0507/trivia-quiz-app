import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Physics, usePlane, useBox, useSphere } from '@react-three/cannon';
import { KeyboardControls, OrbitControls, useKeyboardControls } from '@react-three/drei';
import * as THREE from 'three';
import { useQuestManager } from '../hooks/useQuestManager';

// Define collision filter groups
export const COLLISION_GROUPS = {
  PLAYER: 1,
  QUEST: 2,
  OBSTACLE: 4,
  GROUND: 8,
};

const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    collisionFilterGroup: COLLISION_GROUPS.GROUND,
    collisionFilterMask: COLLISION_GROUPS.PLAYER | COLLISION_GROUPS.OBSTACLE,
  }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
};

const Obstacle = ({ position }: { position: [number, number, number] }) => {
  const [ref] = useBox(() => ({
    mass: 1,
    position,
    args: [2, 2, 2],
    collisionFilterGroup: COLLISION_GROUPS.OBSTACLE,
    collisionFilterMask: COLLISION_GROUPS.PLAYER | COLLISION_GROUPS.GROUND | COLLISION_GROUPS.OBSTACLE,
  }));
  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

const Player = () => {
  const [ref, api] = useSphere(() => ({
    mass: 1,
    position: [0, 1, 0],
    type: 'Dynamic',
    collisionFilterGroup: COLLISION_GROUPS.PLAYER,
    collisionFilterMask: COLLISION_GROUPS.GROUND | COLLISION_GROUPS.OBSTACLE | COLLISION_GROUPS.QUEST,
  }));
  const { forward, backward, left, right, jump } = useKeyboardControls((state) => state);
  const velocity = useRef([0, 0, 0]);

  useEffect(() => {
    api.velocity.subscribe((v) => (velocity.current = v));
  }, [api.velocity]);

  useFrame((state) => {
    const speed = 5;
    const frontVector = new THREE.Vector3(0, 0, Number(backward) - Number(forward));
    const sideVector = new THREE.Vector3(Number(left) - Number(right), 0, 0);
    const direction = new THREE.Vector3();

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(speed)
      .applyEuler(state.camera.rotation);

    api.velocity.set(direction.x, velocity.current[1], direction.z);

    if (jump && Math.abs(velocity.current[1]) < 0.05) {
      api.applyImpulse([0, 5, 0], [0, 0, 0]);
    }
  });

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="blue" />
    </mesh>
  );
};

const QuestObject = ({ position, quest }: { position: [number, number, number], quest: any }) => {
  const [ref] = useBox(() => ({
    isTrigger: true,
    args: [2, 2, 2],
    position,
    collisionFilterGroup: COLLISION_GROUPS.QUEST,
    collisionFilterMask: COLLISION_GROUPS.PLAYER,
    onCollide: () => {
      console.log('Collided with quest:', quest.definition.name);
    },
  }));

  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="purple" wireframe />
    </mesh>
  );
};

const QuestWorld = () => {
  const { quests, loading } = useQuestManager();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-trivia-neon border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
          <p className="text-white text-xl font-semibold">Loading Quest World...</p>
        </div>
      </div>
    );
  }

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'w', 'W'] },
        { name: 'backward', keys: ['ArrowDown', 's', 'S'] },
        { name: 'left', keys: ['ArrowLeft', 'a', 'A'] },
        { name: 'right', keys: ['ArrowRight', 'd', 'D'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <Physics>
          <Ground />
          <Obstacle position={[5, 1, -5]} />
          <Obstacle position={[-5, 1, -10]} />
          <Obstacle position={[0, 1, -15]} />
          <Player />
          {quests.map((quest, i) => (
            <QuestObject key={quest.questId} position={[i * 5, 1, -20]} quest={quest} />
          ))}
        </Physics>
        <OrbitControls />
      </Canvas>
    </KeyboardControls>
  );
};

export default QuestWorld;
