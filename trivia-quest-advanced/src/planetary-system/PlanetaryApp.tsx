import { Canvas } from "@react-three/fiber";
import Scene from "./scene/Scene";
import UI from "./ui/UI"
import LoadingScreen from "./ui/loading-screen/LoadingScreen";

import '@fontsource-variable/jost';
import '@fontsource/space-mono';

import React from 'react';

interface PlanetaryAppProps {
    onPlanetClick: (planetName: string) => void;
}

const PlanetaryApp: React.FC<PlanetaryAppProps> = ({ onPlanetClick }) => {

    return (
        <>
            <Canvas className="three-canvas" camera={{fov: 25}}>
                <Scene onPlanetClick={onPlanetClick} />
            </Canvas>

            <UI />
            <LoadingScreen />
        </>
    );
}
export default PlanetaryApp;
