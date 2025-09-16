import { Suspense } from "react";
import React from 'react';
import SolarSystem from "./SolarSystem";
import Stars from "./Stars";
import CamControls from "./CamControls";
import CameraAnimator from './CameraAnimator';

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
        </>
    );
}

export default Scene;