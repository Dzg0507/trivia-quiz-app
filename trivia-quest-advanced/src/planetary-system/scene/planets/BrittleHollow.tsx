import { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame, Vector3 } from "@react-three/fiber";
import Label from "../../ui/label/Label";
import BlackHole from "../../shaders/black-hole/BlackHole";
import * as THREE from "three";
import { GLTF } from "three-stdlib";
import React from 'react';

interface BrittleHollowProps {
    onPlanetClick: (planetName: string) => void;
    visible: boolean;
    name: string;
    position?: Vector3;
    selectedPlanet: string | null;
}

type GLTFResult = GLTF & {
    nodes: {
        ["south-ice"]: THREE.Mesh;
        ["north-ice"]: THREE.Mesh;
        structures: THREE.Mesh;
        ["land-piece-1"]: THREE.Mesh;
        ["land-piece-2"]: THREE.Mesh;
        ["land-piece-3"]: THREE.Mesh;
        ["land-piece-5"]: THREE.Mesh;
        ["land-piece-4"]: THREE.Mesh;
        ["land-piece-6"]: THREE.Mesh;
    };
    materials: Record<string, unknown>;
};

import { useSolarSystemStore } from '../../States';

const BrittleHollow: React.FC<BrittleHollowProps> = ({ onPlanetClick, name, visible, position, selectedPlanet }) => {
    const planet = useRef<THREE.Group>(null);
    const { nodes } = useGLTF(
        "/planetary-system/planets/brittle-hollow/models/brittle-hollow.glb"
    ) as unknown as GLTFResult;

    const { questAreas, selectedQuestAreaIndex } = useSolarSystemStore();
    const isSelected = name === selectedPlanet;
    const questArea = isSelected ? questAreas[selectedQuestAreaIndex] : null;

    useFrame(
        (state) => {
            if (planet.current) {
                planet.current.rotation.y = state.clock.elapsedTime * 0.1
            }
        }
    );

    const land1 = useTexture("/planetary-system/planets/brittle-hollow/textures/land1.webp");
    const land2 = useTexture("/planetary-system/planets/brittle-hollow/textures/land2.webp");
    const land3 = useTexture("/planetary-system/planets/brittle-hollow/textures/land3.webp");
    const land4 = useTexture("/planetary-system/planets/brittle-hollow/textures/land4.webp");
    const land5 = useTexture("/planetary-system/planets/brittle-hollow/textures/land5.webp");
    const land6 = useTexture("/planetary-system/planets/brittle-hollow/textures/land6.webp");
    const north = useTexture("/planetary-system/planets/brittle-hollow/textures/north.webp");
    const south = useTexture("/planetary-system/planets/brittle-hollow/textures/south.webp");
    const structures = useTexture(
        "/planetary-system/planets/brittle-hollow/textures/structures.webp"
    );

    land1.flipY =
        land2.flipY =
        land3.flipY =
        land4.flipY =
        land5.flipY =
        land6.flipY =
        north.flipY =
        south.flipY =
        structures.flipY =
        false;

    return (
        <group 
            name={name}
            position={position}
            visible={visible}
            ref={planet} 
            onClick={(e) => {
                e.stopPropagation();
                onPlanetClick(name);
            }}
            dispose={null}
        >
            <Label position={[1.0, 1.5, 0]} fontSize={0.1} isSelected={questArea?.name === 'Hanging City'}>
                Hanging City
            </Label>
            <Label position={[0, -4.5, 0]} fontSize={0.1} isSelected={questArea?.name === 'Southern Observatory'}>
                Southern Observatory
            </Label>
            <Label position={[0, 4.2, 0]} fontSize={0.1} isSelected={questArea?.name === 'Northern Glacier'}>
                Northern Glacier
            </Label>
            <Label position={[4.2, 0, 0]} fontSize={0.1} isSelected={questArea?.name === 'Gravity Cannon'}>
                Gravity Cannon
            </Label>
            <Label position={[0, 1.0, -4.5]} fontSize={0.1} isSelected={questArea?.name === 'Escape Pod 1'}>
                Escape Pod 1
            </Label>
            <Label position={[-1.0, -1.0, 0]} fontSize={0.1} maxWidth={15} isSelected={questArea?.name === 'Tower of Quantum Knowledge'}>
                Tower of Quantum Knowledge
            </Label>
            <mesh
                geometry={nodes["south-ice"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.012}
            >
                <meshLambertMaterial map={south} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["north-ice"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.012}
            >
                <meshLambertMaterial map={north} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes.structures.geometry}
                rotation={[1.911, -0.112, 1.66]}
                scale={0.012}
            >
                <meshLambertMaterial map={structures} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["land-piece-1"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.012}
            >
                <meshLambertMaterial map={land1} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["land-piece-2"].geometry}
                rotation={[-2.324, 1.251, -0.977]}
                scale={0.012}
            >
                <meshLambertMaterial map={land2} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["land-piece-3"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.012}
            >
                <meshLambertMaterial map={land3} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["land-piece-5"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.012}
            >
                <meshLambertMaterial map={land5} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["land-piece-4"].geometry}
                rotation={[0.591, -0.038, -0.072]}
                scale={0.012}
            >
                <meshLambertMaterial map={land4} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["land-piece-6"].geometry}
                rotation={[-Math.PI, 0, -1.693]}
                scale={0.012}
            >
                <meshLambertMaterial map={land6} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <BlackHole />
        </group>
    );
}

export default BrittleHollow;
useGLTF.preload("/planetary-system/planets/brittle-hollow/models/brittle-hollow.glb");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/land1.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/land2.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/land3.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/land4.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/land5.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/land6.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/north.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/south.webp");
useTexture.preload("/planetary-system/planets/brittle-hollow/textures/structures.webp");