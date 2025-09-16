import { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber"; // Import Vector3
import { SandColumnMaterial } from "../../shaders/materials/sand-column/SandColumnMaterial";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

// The props interface was already correct, which is great.
import Label from "../../ui/label/Label";
import { useSolarSystemStore } from '../../States';

interface AshTwinProps {
    onPlanetClick: (planetName: string) => void;
    visible: boolean;
    name: string;
    position?: Vector3;
    selectedPlanet: string | null;
}

type GLTFResult = GLTF & {
    nodes: {
        ["sand-column"]: THREE.Mesh;
        ["ash-terrain"]: THREE.Mesh;
        ["ash-structures"]: THREE.Mesh;
    };
    materials: Record<string, unknown>;
};

const AshTwin: React.FC<AshTwinProps> = ({ onPlanetClick, name, visible, position, selectedPlanet }) => {
    const { nodes } = useGLTF(
        "/planetary-system/planets/hourglass-twins/models/ash-twin.glb"
    ) as unknown as GLTFResult;
    const terrain = useTexture(
        "/planetary-system/planets/hourglass-twins/textures/ash-terrain.webp"
    );
    const structures = useTexture(
        "/planetary-system/planets/hourglass-twins/textures/ash-structures.webp"
    );
    terrain.flipY = structures.flipY = false;

    const groupRef = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);
    const structureRef = useRef<THREE.Mesh>(null);
    const sandMat = useRef<THREE.ShaderMaterial>(null);

    const { questAreas, selectedQuestAreaIndex } = useSolarSystemStore();
    const isSelected = name === selectedPlanet;
    const questArea = isSelected ? questAreas[selectedQuestAreaIndex] : null;

    useFrame((state) => {
        if (sandMat.current) {
            sandMat.current.uniforms.time.value = state.clock.elapsedTime;
        }
        if (structureRef.current) {
            structureRef.current.rotation.y = 0.1 * state.clock.elapsedTime;
        }
        if (planetRef.current) {
            planetRef.current.rotation.y = 0.1 * state.clock.elapsedTime;
        }
        if (groupRef.current) {
            groupRef.current.rotation.y = 0.05 * state.clock.elapsedTime;
        }
    });

    return (
        <group 
            name={name}
            position={position}
            visible={visible}
            ref={groupRef}
            onClick={(e) => {
                e.stopPropagation();
                onPlanetClick(name);
            }}
            dispose={null}
        >
            <Label position={[0, 2, 0]} fontSize={0.15} isSelected={questArea?.name === 'Ash Twin Project'}>
                Ash Twin Project
            </Label>
            <mesh
                geometry={nodes["sand-column"].geometry}
                position={[0.006, 0.001, -4.842]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.02}
            >
                <primitive object={SandColumnMaterial} attach="material" ref={sandMat} />
            </mesh>
            <group>
                <mesh
                    geometry={nodes["ash-terrain"].geometry}
                    position={[-0.323, -0.003, -10.161]}
                    scale={2}
                    ref={planetRef}
                >
                    <meshLambertMaterial map={terrain} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
                </mesh>
                <mesh
                    geometry={nodes["ash-structures"].geometry}
                    position={[-0.323, -0.003, -10.161]}
                    scale={2}
                    ref={structureRef}
                >
                    <meshLambertMaterial map={structures} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
                </mesh>
            </group>
        </group>
    );
}
export default AshTwin;
useGLTF.preload("/planetary-system/planets/hourglass-twins/models/ash-twin.glb");
useTexture.preload("/planetary-system/planets/hourglass-twins/textures/ash-terrain.webp")
useTexture.preload("/planetary-system/planets/hourglass-twins/textures/ash-structures.webp")