import { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber"; // Import Vector3
import { SandColumnMaterial } from "../../shaders/materials/sand-column/SandColumnMaterial";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

// The props interface was already correct, which is great.
interface AshTwinProps {
    onPlanetClick: (planetName: string) => void;
    visible: boolean;
    name: string;
    position?: Vector3; // Using the optional '?' is good practice
}

type GLTFResult = GLTF & {
    nodes: {
        ["sand-column"]: THREE.Mesh;
        ["ash-terrain"]: THREE.Mesh;
        ["ash-structures"]: THREE.Mesh;
    };
    materials: Record<string, unknown>;
};

// FIX #1: Destructure ALL the props from the function arguments, including 'position'.
const AshTwin: React.FC<AshTwinProps> = ({ onPlanetClick, name, visible, position }) => {
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
        // FIX #2: Apply the props directly to the main group.
        <group 
            name={name}
            position={position}
            visible={visible}
            ref={groupRef}
            onClick={(e) => {
                e.stopPropagation();
                onPlanetClick(name); // Use the 'name' prop for accuracy
            }}
            dispose={null}
        >
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
                    <meshLambertMaterial map={terrain} />
                </mesh>
                <mesh
                    geometry={nodes["ash-structures"].geometry}
                    position={[-0.323, -0.003, -10.161]}
                    scale={2}
                    ref={structureRef}
                >
                    <meshLambertMaterial map={structures} />
                </mesh>
            </group>
        </group>
    );
}
export default AshTwin;
useGLTF.preload("/planetary-system/planets/hourglass-twins/models/ash-twin.glb");
useTexture.preload("/planetary-system/planets/hourglass-twins/textures/ash-terrain.webp")
useTexture.preload("/planetary-system/planets/hourglass-twins/textures/ash-structures.webp")