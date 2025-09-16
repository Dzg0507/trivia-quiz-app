import { Suspense, useState } from "react";
import React from 'react';
import SolarSystem from "./SolarSystem";
import Stars from "./Stars";
import CamControls from "./CamControls";
import CameraAnimator from './CameraAnimator';
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import ArrowNavigation from "../ui/ArrowNavigation";
import * as THREE from "three";
import { useSolarSystemStore } from "../States";

function Lights() {
    return (
        <>
            <ambientLight intensity={2.0} />
            <pointLight
                position={[-50, 0, 50]}
                intensity={2}
                color={"#ffe0a6"}
            />
        </>
    );
}

type CameraTarget = {
  planetName: string;
  objectName?: string;
} | null;

interface SceneProps {
    onPlanetClick: (planetName: string) => void;
    cameraTarget: CameraTarget;
}

const Scene: React.FC<SceneProps> = ({ onPlanetClick, cameraTarget }) => {
    const { scene, camera } = useThree();
    const [arrowPosition, setArrowPosition] = useState<{ x: number; y: number } | null>(null);
    const { selectedPlanet, nextQuestArea, previousQuestArea } = useSolarSystemStore();

    useFrame(() => {
        if (selectedPlanet) {
            const planetObject = scene.getObjectByName(selectedPlanet);
            if (planetObject) {
                const position = new THREE.Vector3();
                planetObject.getWorldPosition(position);

                const screenPosition = position.clone().project(camera);

                setArrowPosition({
                    x: (screenPosition.x + 1) / 2 * window.innerWidth,
                    y: (-screenPosition.y + 1) / 2 * window.innerHeight,
                });
            }
        } else {
            setArrowPosition(null);
        }
    });

    const handleNext = () => {
        nextQuestArea();
    };

    const handlePrevious = () => {
        previousQuestArea();
    };

    return (
        <>
            <color attach="background" args={["#050505"]} />
            
            <Suspense fallback={null}>
                <SolarSystem 
                  onPlanetClick={onPlanetClick} 
                  focus={cameraTarget?.planetName} 
                />
            </Suspense>

            <Lights />
            <Stars count={5000} />
            <CamControls />
            <CameraAnimator target={cameraTarget} />

            {arrowPosition && (
                <Html>
                    <ArrowNavigation onNext={handleNext} onPrevious={handlePrevious} position={arrowPosition} />
                </Html>
            )}
        </>
    );
}

export default Scene;