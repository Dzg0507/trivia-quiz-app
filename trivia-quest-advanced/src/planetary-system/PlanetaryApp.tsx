import { Canvas } from "@react-three/fiber";
import Scene from "./scene/Scene";
import UI from "./ui/UI";
import LoadingScreen from "./ui/loading-screen/LoadingScreen";
import '@fontsource-variable/jost';
import '@fontsource/space-mono';
import React from 'react';

type CameraTarget = {
  planetName: string;
  objectName?: string;
  position?: [number, number, number];
} | null;

interface PlanetaryAppProps {
    onPlanetClick: (planetName: string) => void;
    cameraTarget: CameraTarget;
}

const PlanetaryApp: React.FC<PlanetaryAppProps> = ({ onPlanetClick, cameraTarget }) => {
    return (
        <>
            <Canvas
                className="three-canvas"
                shadows
                camera={{ fov: 25, position: [0, 0, 20] }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
            >
                <Scene onPlanetClick={onPlanetClick} cameraTarget={cameraTarget} />
            </Canvas>

            <UI />
            <LoadingScreen />
        </>
    );
}

export default PlanetaryApp;