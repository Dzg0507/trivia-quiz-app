import { useRef } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import Label from "../../ui/label/Label";
import Smoke from "../../shaders/materials/smoke/Smoke";
import * as THREE from "three";
import { GLTF } from "three-stdlib";

import React from 'react';

interface EmberTwinProps {
    onPlanetClick: (planetName: string) => void;
    visible: boolean;
    name: string;
    position: [number, number, number];
    selectedPlanet: string | null;
}

type GLTFResult = GLTF & {
    nodes: {
        ["terrain-bottom"]: THREE.Mesh;
        ["terrain-top"]: THREE.Mesh;
        ["ember-structures"]: THREE.Mesh;
    };
    materials: Record<string, unknown>;
};

import { useSolarSystemStore } from '../../States';

const EmberTwin: React.FC<EmberTwinProps> = ({ onPlanetClick, name, selectedPlanet, ...props }) => {
    const planet = useRef<THREE.Group>(null);
    const { nodes } = useGLTF(
        "/planetary-system/planets/hourglass-twins/models/ember-twin.glb"
    ) as unknown as GLTFResult;

    const terrainTop = useTexture(
        "/planetary-system/planets/hourglass-twins/textures/ember-terrain-top.webp"
    );
    const terrainBottom = useTexture(
        "/planetary-system/planets/hourglass-twins/textures/ember-terrain-bottom.webp"
    );
    const structures = useTexture(
        "/planetary-system/planets/hourglass-twins/textures/ember-structures.webp"
    );
    terrainTop.flipY = terrainBottom.flipY = structures.flipY = false;

    const { questAreas, selectedQuestAreaIndex } = useSolarSystemStore();
    const isSelected = name === selectedPlanet;
    const questArea = isSelected ? questAreas[selectedQuestAreaIndex] : null;

    useFrame((state) => {
        if (planet.current) {
            planet.current.rotation.y = state.clock.elapsedTime * 0.1;
        }
    });

    return (
        <group {...props} dispose={null} ref={planet} onClick={() => onPlanetClick(name)}>
            <Label position={[2.75, -2.0, 2.0]} fontSize={0.1} isSelected={questArea?.name === 'Escape Pod 2'}>
                Escape Pod 2
            </Label>
            <Label position={[0, -1.0, -4.0]} fontSize={0.1} isSelected={questArea?.name === 'Gravity Cannon'}>
                Gravity Cannon
            </Label>
            <Label position={[-3.5, 1.0, 3.0]} fontSize={0.1} isSelected={questArea?.name === 'High Energy Lab'}>
                High Energy Lab
            </Label>
            <Label position={[0, -4.0, 0]} fontSize={0.1} isSelected={questArea?.name === 'Quantum Moon Locator'}>
                Quantum Moon Locator
            </Label>
            <Label position={[0, 3.5, 0]} fontSize={0.1} isSelected={questArea?.name === 'Chert\'s Camp'}>
                Chert's Camp
            </Label>

            <mesh
                geometry={nodes["terrain-bottom"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.02}
            >
                <meshLambertMaterial map={terrainBottom} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["terrain-top"].geometry}
                rotation={[Math.PI / 2, 0, 0]}
                scale={0.02}
            >
                <meshLambertMaterial map={terrainTop} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>
            <mesh
                geometry={nodes["ember-structures"].geometry}
                position={[0, 0.005, 0.001]}
                scale={2}
            >
                <meshLambertMaterial map={structures} emissive={isSelected ? 'yellow' : 'black'} emissiveIntensity={isSelected ? 0.5 : 0} />
            </mesh>

            <Smoke position={[0, 5, 0]} scale={0.3} />
        </group>
    );
}
export default EmberTwin;
useGLTF.preload("/planetary-system/planets/hourglass-twins/models/ember-twin.glb");
useTexture.preload("/planetary-system/planets/hourglass-twins/textures/ember-terrain-top.webp");
useTexture.preload(
    "/planetary-system/planets/hourglass-twins/textures/ember-terrain-bottom.webp"
);
useTexture.preload("/planetary-system/planets/hourglass-twins/textures/ember-structures.webp");
