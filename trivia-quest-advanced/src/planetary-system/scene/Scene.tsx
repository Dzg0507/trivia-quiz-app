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

import { useRef } from "react";

import { useEffect } from "react";

const Scene: React.FC<SceneProps> = ({ onPlanetClick, cameraTarget }) => {
    const { scene } = useThree();
    const { selectedPlanet, questAreaIndex, questAreas, nextQuestArea, previousQuestArea } = useSolarSystemStore();
    const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
        if (selectedPlanet) {
            const planetObject = scene.getObjectByName(selectedPlanet);
            if (questAreas.length > 0 && questAreaIndex !== null) {
                const questArea = questAreas[questAreaIndex];
                const questAreaObject = planetObject?.getObjectByName(questArea.name);
                setSelectedObject(questAreaObject || planetObject);
            } else {
                setSelectedObject(planetObject || null);
            }
        } else {
            setSelectedObject(null);
        }
    }, [selectedPlanet, questAreaIndex, questAreas, scene]);

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

            {selectedObject && (
                <group position={selectedObject.position}>
                    <Html center>
                        <ArrowNavigation onNext={handleNext} onPrevious={handlePrevious} />
                    </Html>
                </group>
            )}
        </>
    );
}

export default Scene;