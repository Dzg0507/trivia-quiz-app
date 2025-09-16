import { useRef } from "react";
import { useSolarSystemStore } from "../States";

import AshTwin from "./planets/AshTwin";
import BrittleHollow from "./planets/BrittleHollow";
import EmberTwin from "./planets/EmberTwin";
import TimberHearth from "./planets/TimberHearth";
import GiantsDeep from "./planets/GiantsDeep";
import DarkBramble from "./planets/DarkBramble";
import QuantumMoon from "./planets/QuantumMoon";

import PlanetAtmosphere from "./PlanetAtmosphere";

import React from 'react';

interface SolarSystemProps {
    onPlanetClick: (planetName: string) => void;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ onPlanetClick }) => {
    const focus = useSolarSystemStore((state) => state.focus);
    const moon = useRef(null);

    return (
        <>
            <group scale={0.2}>
                {/* Hourglass Twins */}
                <group visible={focus === "hour"} name="hour">
                    <EmberTwin onPlanetClick={onPlanetClick} />
                    <AshTwin onPlanetClick={onPlanetClick} />
                </group>

                {/* Timber Hearth */}
                <TimberHearth visible={focus === "timber"} name="timber" onPlanetClick={onPlanetClick} />

                {/* Brittle Hollow */}
                <BrittleHollow visible={focus === "brittle"} name="brittle" onPlanetClick={onPlanetClick} />

                {/* Giants Deep */}
                <GiantsDeep visible={focus === "deep"} name="deep" onPlanetClick={onPlanetClick} />

                {/* Dark Bramble */}
                <DarkBramble visible={focus == "bramble"} name="bramble" onPlanetClick={onPlanetClick} />

                {/* Quantum Moon */}
                <QuantumMoon name="quantum" ref={moon} onPlanetClick={onPlanetClick} />
            </group>

            <PlanetAtmosphere moon={moon} />
        </>
    );
}

export default SolarSystem;
