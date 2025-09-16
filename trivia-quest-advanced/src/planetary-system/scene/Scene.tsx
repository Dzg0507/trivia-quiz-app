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
    const { scene, camera } = useThree();
    const { selectedPlanet, nextQuestArea, previousQuestArea } = useSolarSystemStore();
    const htmlRef = useRef<HTMLDivElement>(null);
    const selectedPlanetRef = useRef<THREE.Object3D | null>(null);

    useEffect(() => {
        if (selectedPlanet) {
            selectedPlanetRef.current = scene.getObjectByName(selectedPlanet);
        } else {
            selectedPlanetRef.current = null;
        }
    }, [selectedPlanet, scene]);

    useFrame(() => {
        if (selectedPlanetRef.current && htmlRef.current) {
            const position = new THREE.Vector3();
            selectedPlanetRef.current.getWorldPosition(position);

            const screenPosition = position.clone().project(camera);

            htmlRef.current.style.top = `${(-screenPosition.y + 1) / 2 * window.innerHeight}px`;
            htmlRef.current.style.left = `${(screenPosition.x + 1) / 2 * window.innerWidth}px`;
            htmlRef.current.style.transform = 'translate(-50%, -50%)';
            htmlRef.current.style.display = 'block';
        } else if (htmlRef.current) {
            htmlRef.current.style.display = 'none';
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

            <Html ref={htmlRef} style={{ display: 'none' }}>
                <ArrowNavigation onNext={handleNext} onPrevious={handlePrevious} />
            </Html>
        </>
    );
}

export default Scene;