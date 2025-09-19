import { Suspense, useState } from "react";
import React from 'react';
import SolarSystem from "./SolarSystem";
import Stars from "./Stars";
import CamControls from "./CamControls";
import CameraAnimator from './CameraAnimator';
import { useThree } from "@react-three/fiber";
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
  position?: [number, number, number];
} | null;

interface SceneProps {
    onPlanetClick: (planetName: string) => void;
    onPlanetDeselect: () => void;
    cameraTarget: CameraTarget;
}

import { useEffect } from "react";

const Scene: React.FC<SceneProps> = ({ onPlanetClick, onPlanetDeselect, cameraTarget }) => {
    const { scene } = useThree();

    // Select specific slices/actions from the store
    const selectedPlanet = useSolarSystemStore(s => s.selectedPlanet);
    const selectedQuestAreaIndex = useSolarSystemStore(s => s.selectedQuestAreaIndex);
    const questAreas = useSolarSystemStore(s => s.questAreas);
    const nextQuestArea = useSolarSystemStore(s => s.nextQuestArea);
    const previousQuestArea = useSolarSystemStore(s => s.previousQuestArea);

    const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
        if (selectedPlanet) {
            const planetObject = scene.getObjectByName(selectedPlanet);
            const hasValidIndex = selectedQuestAreaIndex >= 0 && selectedQuestAreaIndex < questAreas.length;
            if (questAreas.length > 0 && hasValidIndex) {
                const questArea = questAreas[selectedQuestAreaIndex];
                const questAreaObject = planetObject?.getObjectByName(questArea.name);
                setSelectedObject(questAreaObject || planetObject || null);
            } else {
                setSelectedObject(planetObject || null);
            }
        } else {
            setSelectedObject(null);
        }
    }, [selectedPlanet, selectedQuestAreaIndex, questAreas, scene]);

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
                  onPointerMissed={onPlanetDeselect}
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