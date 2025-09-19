import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Utility functions
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const random = Math.random;

// Enhanced Space Station Component
const SpaceStation = ({ position, scale = 1, color = "#4F46E5" }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x += 0.01;
      ringsRef.current.rotation.z += 0.008;
    }
    if (dotsRef.current) {
      dotsRef.current.rotation.y -= 0.02;
    }
  });

  return (
    <group position={position} ref={groupRef} scale={[scale, scale, scale]}>
      {/* Central core with animated glow */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.9} 
          roughness={0.1}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Pulsing inner glow */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Enhanced rotating rings */}
      <group ref={ringsRef}>
        <mesh rotation={[0, 0, PI / 2]}>
          <torusGeometry args={[1.2, 0.08, 16, 64]} />
          <meshStandardMaterial 
            color={color} 
            transparent 
            opacity={0.8}
            emissive={color}
            emissiveIntensity={0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh rotation={[PI / 2, 0, 0]}>
          <torusGeometry args={[1.5, 0.06, 16, 64]} />
          <meshStandardMaterial 
            color="#00FFFF" 
            transparent 
            opacity={0.6}
            emissive="#00FFFF"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh rotation={[PI / 4, PI / 4, 0]}>
          <torusGeometry args={[1.8, 0.04, 12, 48]} />
          <meshStandardMaterial 
            color="#FF6B6B" 
            transparent 
            opacity={0.4}
            emissive="#FF6B6B"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      
      {/* Enhanced solar panels */}
      <mesh position={[2.2, 0, 0]}>
        <boxGeometry args={[1.0, 1.5, 0.03]} />
        <meshStandardMaterial 
          color="#10B981" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#10B981"
          emissiveIntensity={0.2}
        />
      </mesh>
      <mesh position={[-2.2, 0, 0]}>
        <boxGeometry args={[1.0, 1.5, 0.03]} />
        <meshStandardMaterial 
          color="#10B981" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#10B981"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Communication arrays */}
      <group ref={dotsRef}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[
            cos(i * PI / 4) * 2.5,
            sin(i * PI / 4) * 2.5,
            0
          ]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#FFD700" 
              emissive="#FFD700"
              emissiveIntensity={0.8}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Enhanced Planet Component
const Planet = ({ 
  position, 
  radius, 
  color, 
  hasRings = false, 
  hasMoons = false,
  cloudLayer = false 
}: {
  position: [number, number, number];
  radius: number;
  color: string;
  hasRings?: boolean;
  hasMoons?: boolean;
  cloudLayer?: boolean;
}) => {
  const planetRef = useRef<THREE.Group>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group position={position} ref={planetRef}>
      {/* Main planet */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.1} />
      </mesh>
      
      {/* Atmosphere */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[radius * 1.05, 32, 32]} />
        <meshStandardMaterial 
          color={color}
          transparent 
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Cloud layer */}
      {cloudLayer && (
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[radius * 1.02, 32, 32]} />
          <meshStandardMaterial 
            color="#FFFFFF"
            transparent 
            opacity={0.3}
            roughness={0.9}
          />
        </mesh>
      )}
      
      {/* Enhanced planet rings */}
      {hasRings && (
        <group>
          <mesh rotation={[PI / 2, 0, 0]}>
            <torusGeometry args={[radius * 1.8, radius * 0.15, 16, 128]} />
            <meshStandardMaterial 
              color="#FBBF24" 
              transparent 
              opacity={0.7} 
              side={THREE.DoubleSide}
              emissive="#FBBF24"
              emissiveIntensity={0.1}
            />
          </mesh>
          <mesh rotation={[PI / 2, 0, 0]}>
            <torusGeometry args={[radius * 2.2, radius * 0.08, 12, 96]} />
            <meshStandardMaterial 
              color="#F59E0B" 
              transparent 
              opacity={0.5} 
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
      
      {/* Enhanced moons with orbits */}
      {hasMoons && [1, 2, 3].map((i) => {
        const orbitRadius = radius * (2.5 + i * 0.5);
        const angle = i * (PI * 2 / 3);
        return (
          <group key={i}>
            {/* Orbit trail */}
            <mesh rotation={[PI / 2, 0, 0]}>
              <torusGeometry args={[orbitRadius, 0.01, 8, 64]} />
              <meshBasicMaterial color="#555555" transparent opacity={0.3} />
            </mesh>
            {/* Moon */}
            <mesh position={[orbitRadius * cos(angle), 0, orbitRadius * sin(angle)]}>
              <sphereGeometry args={[radius * 0.2, 16, 16]} />
              <meshStandardMaterial color="#9CA3AF" roughness={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Enhanced Asteroid Field Component
const AsteroidField = ({ count = 50, radius = 20 }: {
  count?: number;
  radius?: number;
}) => {
  const asteroidsRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (asteroidsRef.current) {
      asteroidsRef.current.rotation.x += 0.0003;
      asteroidsRef.current.rotation.y += 0.0007;
      asteroidsRef.current.rotation.z += 0.0005;
    }
  });

  const asteroids = useMemo(() => {
    return Array.from({ length: count }, () => {
      const angle1 = random() * PI * 2;
      const angle2 = random() * PI;
      const distance = radius * (0.3 + random() * 0.7);
      
      return {
        position: [
          distance * sin(angle2) * cos(angle1),
          distance * sin(angle2) * sin(angle1),
          distance * cos(angle2)
        ] as [number, number, number],
        scale: 0.05 + random() * 0.25,
        rotation: [random() * PI, random() * PI, random() * PI] as [number, number, number],
        color: `hsl(${30 + random() * 60}, 50%, ${20 + random() * 30}%)`
      };
    });
  }, [count, radius]);

  return (
    <group ref={asteroidsRef}>
      {asteroids.map((asteroid, i) => (
        <mesh 
          key={i} 
          position={asteroid.position} 
          scale={[asteroid.scale, asteroid.scale, asteroid.scale]}
          rotation={asteroid.rotation}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={asteroid.color}
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
};

// Enhanced Nebula Component
const Nebula = ({ position, scale = 1 }: {
  position: [number, number, number];
  scale?: number;
}) => {
  const nebulaRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += 0.0008;
    }
    if (innerRef.current) {
      innerRef.current.rotation.x += 0.0005;
      innerRef.current.rotation.y -= 0.0003;
    }
    if (outerRef.current) {
      outerRef.current.rotation.x -= 0.0003;
      outerRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group position={position} ref={nebulaRef} scale={[scale, scale, scale]}>
      {/* Inner nebula core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial 
          color="#EC4899" 
          transparent 
          opacity={0.25} 
          side={THREE.BackSide}
          emissive="#EC4899"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Middle layer */}
      <mesh>
        <sphereGeometry args={[6, 32, 32]} />
        <meshStandardMaterial 
          color="#8B5CF6" 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
          emissive="#8B5CF6"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Outer layer */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[8, 32, 32]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          transparent 
          opacity={0.08} 
          side={THREE.BackSide}
          emissive="#3B82F6"
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
};

// Enhanced Rollercoaster Track Generator
const generateRollercoasterTrack = (
  startPoint: [number, number, number], 
  endPoint: [number, number, number], 
  complexity = 15
) => {
  const points = [];
  points.push(new THREE.Vector3(...startPoint));
  
  // Generate more complex intermediate points with loops and spirals
  for (let i = 0; i < complexity; i++) {
    const t = (i + 1) / (complexity + 1);
    const spiralFactor = sin(t * PI * 6) * 2;
    const loopFactor = cos(t * PI * 4) * 1.5;
    
    const x = startPoint[0] + (endPoint[0] - startPoint[0]) * t + spiralFactor;
    const y = startPoint[1] + (endPoint[1] - startPoint[1]) * t + sin(t * PI * 8) * 4 + loopFactor;
    const z = startPoint[2] + (endPoint[2] - startPoint[2]) * t + cos(t * PI * 6) * 3;
    points.push(new THREE.Vector3(x, y, z));
  }
  
  points.push(new THREE.Vector3(...endPoint));
  return new THREE.CatmullRomCurve3(points);
};

// Enhanced Rollercoaster Car Component
const RollercoasterCar = () => {
  const carRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (carRef.current) {
      // Add subtle bobbing motion
      carRef.current.position.y += sin(Date.now() * 0.01) * 0.02;
    }
  });

  return (
    <group ref={carRef}>
      {/* Main car body */}
      <mesh>
        <boxGeometry args={[1.0, 0.5, 1.8]} />
        <meshStandardMaterial 
          color="#EF4444" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#EF4444"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Spoiler */}
      <mesh position={[0, 0.4, -0.8]}>
        <boxGeometry args={[0.8, 0.1, 0.3]} />
        <meshStandardMaterial color="#1F2937" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Enhanced wheels with glow */}
      {[-0.7, 0.7].map((x, i) => (
        <group key={i} position={[x, -0.35, 0]}>
          {[0.6, -0.6].map((z, j) => (
            <group key={j} position={[0, 0, z]}>
              <mesh>
                <cylinderGeometry args={[0.18, 0.18, 0.12, 16]} />
                <meshStandardMaterial 
                  color="#374151"
                  metalness={0.8}
                  roughness={0.3}
                />
              </mesh>
              {/* Wheel glow */}
              <mesh>
                <cylinderGeometry args={[0.22, 0.22, 0.08, 16]} />
                <meshStandardMaterial 
                  color="#00FFFF"
                  transparent
                  opacity={0.4}
                  emissive="#00FFFF"
                  emissiveIntensity={0.5}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      
      {/* Windshield */}
      <mesh position={[0, 0.25, 0.7]}>
        <boxGeometry args={[0.8, 0.35, 0.05]} />
        <meshStandardMaterial 
          color="#93C5FD" 
          transparent 
          opacity={0.8}
          metalness={0.1}
          roughness={0.0}
        />
      </mesh>

      {/* Exhaust particles */}
      <mesh position={[0, 0, -1.2]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial 
          color="#FF6B6B"
          transparent
          opacity={0.6}
          emissive="#FF6B6B"
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};

// Enhanced Menu Item Component
const MenuItem = ({ 
  item, 
  position, 
  onHover, 
  onLeave, 
  onClick, 
  isActive 
}: {
  item: any;
  position: [number, number, number];
  onHover: (item: any) => void;
  onLeave: () => void;
  onClick: (item: any) => void;
  isActive: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (groupRef.current) {
      // More dynamic rotation
      groupRef.current.rotation.y += 0.008 + (hovered ? 0.012 : 0);
      groupRef.current.rotation.x = sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Enhanced scaling with bounce effect
      const targetScale = hovered || isActive ? 1.4 : 1;
      groupRef.current.scale.x += (targetScale - groupRef.current.scale.x) * 0.15;
      groupRef.current.scale.y += (targetScale - groupRef.current.scale.y) * 0.15;
      groupRef.current.scale.z += (targetScale - groupRef.current.scale.z) * 0.15;
      
      // Floating animation
      groupRef.current.position.y = position[1] + sin(state.clock.elapsedTime * 3 + position[0]) * 0.3;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    onHover(item);
  };

  const handlePointerOut = () => {
    setHovered(false);
    onLeave();
  };

  return (
    <group 
      ref={groupRef} 
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={() => onClick(item)}
    >
      {/* Main glowing orb */}
      <mesh>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshStandardMaterial 
          color={item.color} 
          emissive={item.color}
          emissiveIntensity={hovered || isActive ? 1.2 : 0.4}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Inner core */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          emissive={item.color}
          emissiveIntensity={hovered || isActive ? 0.8 : 0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Outer pulsing aura */}
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial 
          color={item.color} 
          transparent 
          opacity={hovered || isActive ? 0.3 : 0.15}
          side={THREE.BackSide}
          emissive={item.color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Orbiting particles */}
      {hovered && Array.from({ length: 6 }, (_, i) => (
        <mesh
          key={i}
          position={[
            cos(i * PI / 3 + Date.now() * 0.005) * 2,
            sin(i * PI / 3 + Date.now() * 0.005) * 0.5,
            sin(i * PI / 3 + Date.now() * 0.005) * 2
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial 
            color={item.color}
            emissive={item.color}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
      
      {/* Enhanced text label */}
      <Text
        position={[0, -2, 0]}
        fontSize={0.4}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        font={undefined}
      >
        {item.text}
      </Text>

      {/* Subtitle */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.2}
        color="#CCCCCC"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
        font={undefined}
      >
        {item.subtitle}
      </Text>
    </group>
  );
};

// Enhanced Preview Scene Component
const PreviewScene = ({ sceneType }: { sceneType: string }) => {
  switch (sceneType) {
    case 'story':
      return (
        <group>
          <Planet 
            position={[0, 0, 0]} 
            radius={2.5} 
            color="#F59E0B" 
            hasRings 
            hasMoons 
            cloudLayer 
          />
          <SpaceStation position={[6, 4, 3]} scale={1.0} color="#10B981" />
          <Nebula position={[-8, 2, -5]} scale={1.2} />
        </group>
      );
    case 'options':
      return (
        <group>
          <Nebula position={[0, 0, 0]} scale={2} />
          <Planet position={[5, -3, 4]} radius={1.8} color="#8B5CF6" hasRings />
          <AsteroidField count={25} radius={12} />
        </group>
      );
    case 'trivia':
      return (
        <group>
          <AsteroidField count={40} radius={18} />
          <Planet position={[0, 0, 0]} radius={2.2} color="#EC4899" hasMoons />
          <SpaceStation position={[-7, 3, 2]} scale={0.7} color="#06B6D4" />
        </group>
      );
    case 'profile':
      return (
        <group>
          <SpaceStation position={[0, 0, 0]} scale={1.5} color="#06B6D4" />
          <Planet position={[8, 3, -4]} radius={1.5} color="#F97316" cloudLayer />
          <Nebula position={[-6, -4, 3]} scale={1} />
        </group>
      );
    case 'settings':
      return (
        <group>
          <Nebula position={[0, 0, 0]} scale={2.5} />
          <AsteroidField count={30} radius={15} />
          <Planet position={[6, -2, 5]} radius={1.3} color="#10B981" />
        </group>
      );
    default:
      return null;
  }
};

// Enhanced Rollercoaster Ride Component
const RollercoasterRide = ({ 
  startPosition, 
  targetPosition, 
  onComplete 
}: {
  startPosition: [number, number, number];
  targetPosition: [number, number, number];
  onComplete: () => void;
}) => {
  const carRef = useRef<THREE.Group>(null);
  
  const track = useMemo(() => {
    return generateRollercoasterTrack(startPosition, targetPosition, 20);
  }, [startPosition, targetPosition]);
  
  const [progress, setProgress] = useState(0);
  
  useFrame(() => {
    if (progress < 1) {
      setProgress(prev => Math.min(prev + 0.008, 1)); // Slightly faster
      
      const point = track.getPointAt(progress);
      const tangent = track.getTangentAt(progress).normalize();
      
      if (carRef.current) {
        carRef.current.position.copy(point);
        
        // Enhanced rotation calculation for more realistic banking
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
        const newUp = new THREE.Vector3().crossVectors(right, tangent).normalize();
        
        const matrix = new THREE.Matrix4();
        matrix.makeBasis(right, newUp, tangent.clone().negate());
        carRef.current.quaternion.setFromRotationMatrix(matrix);
        
        // Add banking effect on turns
        const nextPoint = track.getPointAt(Math.min(progress + 0.01, 1));
        const banking = point.distanceTo(nextPoint) * 2;
        carRef.current.rotateZ(banking);
      }
    } else {
      setTimeout(onComplete, 1000); // Add delay before completion
    }
  });

  // Enhanced track visualization
  const trackPoints = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 200; i++) {
      points.push(track.getPointAt(i / 200));
    }
    return points;
  }, [track]);

  return (
    <group>
      {/* Enhanced track with supports */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={trackPoints.length}
            array={new Float32Array(trackPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#00FFFF" transparent opacity={0.8} linewidth={3} />
      </line>
      
      {/* Track supports */}
      {trackPoints.filter((_, i) => i % 10 === 0).map((point, i) => (
        <mesh key={i} position={[point.x, point.y - 2, point.z]}>
          <cylinderGeometry args={[0.05, 0.1, 2, 8]} />
          <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Enhanced rollercoaster car */}
      <group ref={carRef}>
        <RollercoasterCar />
        
        {/* Speed trail effect */}
        {progress > 0.1 && (
          <mesh position={[0, 0, -2]}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial 
              color="#FF6B6B"
              transparent
              opacity={0.6}
              emissive="#FF6B6B"
              emissiveIntensity={0.8}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

// Main Space Menu Component
const SpaceMenu = () => {
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [rideActive, setRideActive] = useState(false);
  
  const menuItems = [
    { 
      id: 'story', 
      text: 'STORY MODE', 
      subtitle: 'Epic Adventures',
      color: '#F59E0B', 
      position: [-10, 5, 0] as [number, number, number], 
      scene: 'story' 
    },
    { 
      id: 'options', 
      text: 'OPTIONS', 
      subtitle: 'Customize Experience',
      color: '#10B981', 
      position: [10, 5, 0] as [number, number, number], 
      scene: 'options' 
    },
    { 
      id: 'trivia', 
      text: 'TRIVIA GAME', 
      subtitle: 'Test Your Knowledge',
      color: '#EC4899', 
      position: [-10, -5, 0] as [number, number, number], 
      scene: 'trivia' 
    },
    { 
      id: 'profile', 
      text: 'PROFILE', 
      subtitle: 'Your Stats',
      color: '#06B6D4', 
      position: [10, -5, 0] as [number, number, number], 
      scene: 'profile' 
    },
    { 
      id: 'settings', 
      text: 'SETTINGS', 
      subtitle: 'Configuration',
      color: '#8B5CF6', 
      position: [0, 0, 10] as [number, number, number], 
      scene: 'settings' 
    }
  ];

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setRideActive(true);
  };

  const handleRideComplete = () => {
    console.log(`Arrived at ${selectedItem?.text}`);
    // Here you would navigate to the actual game screen
    setRideActive(false);
    setSelectedItem(null);
  };

  return (
    <>
      {/* Enhanced background elements */}
      <Stars radius={150} depth={80} count={8000} factor={6} />
      
      {/* Central enhanced space station */}
      <SpaceStation position={[0, 0, 0]} scale={2} color="#4F46E5" />
      
      {/* Enhanced distant planets and nebulas */}
      <Planet position={[30, 15, -45]} radius={4} color="#F59E0B" hasRings hasMoons cloudLayer />
      <Planet position={[-35, -20, -50]} radius={3.5} color="#8B5CF6" hasRings />
      <Planet position={[25, -18, -40]} radius={2.8} color="#10B981" hasMoons cloudLayer />
      <Nebula position={[20, -25, -60]} scale={4} />
      <Nebula position={[-40, 30, -70]} scale={3.5} />
      <Nebula position={[35, 20, -55]} scale={3} />
      
      {/* Enhanced asteroid fields */}
      <AsteroidField count={150} radius={50} />
      <AsteroidField count={80} radius={25} />
      
      {/* Menu items */}
      {!rideActive && menuItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          position={item.position}
          onHover={setHoveredItem}
          onLeave={() => setHoveredItem(null)}
          onClick={handleItemClick}
          isActive={selectedItem?.id === item.id}
        />
      ))}
      
      {/* Enhanced preview scene for hovered item */}
      {hoveredItem && !rideActive && (
        <group position={[0, 0, -20]}>
          <PreviewScene sceneType={hoveredItem.scene} />
        </group>
      )}
      
      {/* Enhanced rollercoaster ride */}
      {rideActive && selectedItem && (
        <RollercoasterRide
          startPosition={[0, 0, 0]}
          targetPosition={selectedItem.position.map((coord: number) => coord * 2.5) as [number, number, number]}
          onComplete={handleRideComplete}
        />
      )}
      
      {/* Enhanced camera controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        enableRotate={!rideActive}
        autoRotate={!rideActive}
        autoRotateSpeed={0.3}
        minDistance={15}
        maxDistance={120}
        maxPolarAngle={Math.PI * 0.8}
        minPolarAngle={Math.PI * 0.2}
      />
    </>
  );
};

// Enhanced UI Overlay Component
const UIOverlay = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Enhanced title with animations */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <h1 className="text-5xl md:text-7xl font-bold text-white text-center animate-pulse">
          <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-2xl">
            COSMIC ROLLERCOASTER
          </span>
        </h1>
        <p className="text-center text-gray-300 mt-4 text-xl tracking-wider">
          🚀 Navigate the galaxy in style ✨
        </p>
      </div>
      
      {/* Enhanced instructions */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4 border border-blue-500">
          <p className="text-blue-400 text-lg font-semibold mb-2">
            🎮 Controls
          </p>
          <p className="text-gray-300 text-sm">
            Hover over destinations to preview • Click to embark on your journey
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Use mouse to rotate • Scroll to zoom
          </p>
        </div>
      </div>
      
      {/* Enhanced decorative elements */}
      <div className="absolute top-8 left-8 w-40 h-40 border-2 border-blue-500 rounded-full opacity-30 animate-spin"></div>
      <div className="absolute top-12 right-12 w-32 h-32 border-2 border-purple-500 rounded-full opacity-40 animate-bounce"></div>
      <div className="absolute bottom-20 left-16 w-24 h-24 border-2 border-pink-500 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute top-1/2 right-8 w-16 h-16 border border-green-500 rounded-full opacity-60"></div>
      
      {/* Particle overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <Canvas
        camera={{ position: [0, 5, 30], fov: 65 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={['#000022']} />
        
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.15} color="#4A5568" />
        <pointLight position={[15, 15, 15]} intensity={1.5} color="#4F46E5" />
        <pointLight position={[-15, -15, -15]} intensity={0.8} color="#EC4899" />
        <pointLight position={[0, 25, 0]} intensity={0.6} color="#10B981" />
        <pointLight position={[20, -10, 10]} intensity={0.4} color="#F59E0B" />
        <directionalLight position={[10, 10, 5]} intensity={0.3} color="#FFFFFF" />
        
        {/* Space menu */}
        <SpaceMenu />
      </Canvas>
      
      {/* Enhanced UI Overlay */}
      <UIOverlay />
    </div>
  );
}