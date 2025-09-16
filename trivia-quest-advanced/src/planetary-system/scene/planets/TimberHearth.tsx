import { useRef } from "react";
import { useFrame, Vector3 } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import Label from "../../ui/label/Label";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import React from 'react';

// The interface now uses the optional Vector3 type for position
interface TimberHearthProps {
    onPlanetClick: (planetName: string) => void;
    visible: boolean;
    name: string;
    position?: Vector3;
}

type GLTFResult = GLTF & {
    nodes: {
        ["timber-surface"]: THREE.Mesh;
        ["timber-structures"]: THREE.Mesh;
    };
    materials: Record<string, unknown>;
};

// All props are now explicitly destructured from the function arguments
const TimberHearth: React.FC<TimberHearthProps> = ({ onPlanetClick, name, visible, position }) => {
    const planet = useRef<THREE.Group>(null)
    const { nodes } = useGLTF(
        "/planetary-system/planets/timber-hearth/models/timber-hearth.glb"
    ) as unknown as GLTFResult;
    const terrain = useTexture(
        "/planetary-system/planets/timber-hearth/textures/timber-surface.webp"
    );
    const structures = useTexture(
        "/planetary-system/planets/timber-hearth/textures/timber-structures.webp"
    );
    terrain.flipY = false;
    structures.flipY = false;

    useFrame((state) => {
        if (planet.current) {
            planet.current.rotation.y = state.clock.elapsedTime * 0.1
        }
    })

    return (
        // The main group now correctly uses all the props
        <group 
            name={name}
            position={position}
            visible={visible}
            ref={planet}
            onClick={(e) => {
                e.stopPropagation();
                console.log('Click registered on TimberHearth model!'); // Debug log
                onPlanetClick(name);
            }}
            dispose={null}
        >
            <Label position={[-2,4,0]} fontSize={0.15}>
                Youngbark Crater
            </Label>
            <Label position={[0.1,0.1,4.5]} fontSize={0.15}>
                The Village
            </Label>
            <Label position={[-5.0,0.0,0.0]} fontSize={0.15}>
                Geyser Mountains
            </Label>
            <Label position={[3.0,3.5,1.0]} fontSize={0.15}>
                Radio Tower
            </Label>
            <Label position={[0,-4.2,0]} fontSize={0.15}>
                Quantum Grove
            </Label>
            <Label position={[3.5,0,-4.0]} fontSize={0.15}>
                Nomai Mines
            </Label>
            {/* This JSX is the original, correct structure for your model */}
            <mesh scale={15} geometry={(nodes["timber-surface"] as THREE.Mesh).geometry}>
                <meshLambertMaterial map={terrain} />
            </mesh>
            <mesh scale={15} geometry={(nodes["timber-structures"] as THREE.Mesh).geometry}>
                <meshLambertMaterial map={structures} />
            </mesh>
        </group>
    )
}
export default TimberHearth;
useGLTF.preload("/planetary-system/planets/timber-hearth/models/timber-hearth.glb");
useTexture.preload("/planetary-system/planets/timber-hearth/textures/timber-surface.webp")
useTexture.preload("/planetary-system/planets/timber-hearth/textures/timber-structures.webp")