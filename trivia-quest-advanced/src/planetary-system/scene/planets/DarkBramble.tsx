import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import React from 'react';

import Label from "../../ui/label/Label";
import { useSolarSystemStore } from '../../States';

interface DarkBrambleProps {
    onPlanetClick: (planetName: string) => void;
    visible: boolean;
    name: string;
    position: [number, number, number];
    selectedPlanet: string | null;
}

type GLTFResult = GLTF & {
    nodes: {
        ["bramble-seed"]: THREE.Mesh;
        ["bramble-ice"]: THREE.Mesh;
        ["bramble-vine"]: THREE.Mesh;
        ["bramble-vine001"]: THREE.Mesh;
    };
    materials: Record<string, unknown>;
};

const DarkBramble: React.FC<DarkBrambleProps> = ({ onPlanetClick, name, selectedPlanet, ...props }) => {
    const planet = useRef<THREE.Group>(null);
    const { nodes } = useGLTF("/planetary-system/planets/dark-bramble/models/dark-bramble.glb") as unknown as GLTFResult;
    const seed = useTexture("/planetary-system/planets/dark-bramble/textures/seed.webp")
    const ice = useTexture("/planetary-system/planets/dark-bramble/textures/ice.webp")
    const vines = useTexture("/planetary-system/planets/dark-bramble/textures/vines.webp")
    const vines2 = useTexture("/planetary-system/planets/dark-bramble/textures/vines2.webp")

    seed.flipY = ice.flipY = vines.flipY = vines2.flipY = false

    const { questAreas, selectedQuestAreaIndex } = useSolarSystemStore();
    const isSelected = name === selectedPlanet;
    const questArea = isSelected ? questAreas[selectedQuestAreaIndex] : null;

    useFrame((state) => {
        if (planet.current) {
            planet.current.rotation.y = state.clock.elapsedTime * 0.1
        }
    })

    return (
        <group {...props} dispose={null} ref={planet} onClick={() => onPlanetClick(name)}>
            <Label position={[0, 2, 0]} fontSize={0.15} isSelected={questArea?.name === 'Feldspar\'s Camp'}>
                Feldspar's Camp
            </Label>
            <mesh
                geometry={nodes["bramble-seed"].geometry}
                position={[0, 0, 0]}
                scale={0.005}
            >
                <meshLambertMaterial map={seed} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["bramble-ice"].geometry}
                position={[0, 0, 0]}
                scale={0.005}
            >
                <meshLambertMaterial map={ice} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["bramble-vine"].geometry}
                position={[0, 0, 0]}
                scale={0.005}
            >
                <meshLambertMaterial map={vines} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["bramble-vine001"].geometry}
                position={[0, 0, 0]}
                scale={0.005}
            >
                <meshLambertMaterial map={vines2} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
        </group>
    );
}
export default DarkBramble
useGLTF.preload("/planetary-system/planets/dark-bramble/models/dark-bramble.glb");
useTexture.preload("/planetary-system/planets/dark-bramble/textures/seed.webp")
useTexture.preload("/planetary-system/planets/dark-bramble/textures/ice.webp")
useTexture.preload("/planetary-system/planets/dark-bramble/textures/vines.webp")
useTexture.preload("/planetary-system/planets/dark-bramble/textures/vines2.webp")
