import React from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import { Vector3 } from '@react-three/fiber';
import AshTwin from './planets/AshTwin.tsx';
import EmberTwin from './planets/EmberTwin.tsx';
import BrittleHollow from './planets/BrittleHollow.tsx';
import GiantsDeep from './planets/GiantsDeep.tsx';
import TimberHearth from './planets/TimberHearth.tsx';
import DarkBramble from './planets/DarkBramble.tsx';
import QuantumMoon from './planets/QuantumMoon.tsx';
import { useSolarSystemStore } from '../States';
import { PLANET_DATA } from '../../config/planetData';

interface SolarSystemProps {
  onPlanetClick: (planetName: string) => void;
  onPointerMissed?: () => void;
  focus?: string | null;
}

interface PlanetComponentProps {
  position?: Vector3;
  visible: boolean;
  name: string;
  onPlanetClick: (planetName: string) => void;
  selectedPlanet: string | null;
}

const planetComponents: { [key: string]: React.FC<PlanetComponentProps> } = {
    'Timber Hearth': TimberHearth,
    'Ember Twin': EmberTwin,
    'Ash Twin': AshTwin,
    'Brittle Hollow': BrittleHollow,
    'Giants Deep': GiantsDeep,
    'Dark Bramble': DarkBramble,
    'Quantum Moon': QuantumMoon,
};

const SolarSystem: React.FC<SolarSystemProps> = ({ onPlanetClick, onPointerMissed, focus }) => {
    const { selectedPlanet } = useSolarSystemStore();
    const isAnyPlanetFocused = focus !== null && focus !== undefined;

    return (
        <group>
            <Plane
                args={[1000, 1000]}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0, 0]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onPointerMissed) {
                        onPointerMissed();
                    }
                }}
            >
                <meshBasicMaterial transparent opacity={0} />
            </Plane>
            {PLANET_DATA.map((planet) => {
                const PlanetComponent = planetComponents[planet.name];
                const position = new THREE.Vector3(...planet.position);
                return PlanetComponent ? (
                    <PlanetComponent
                        key={planet.name}
                        position={position}
                        visible={!isAnyPlanetFocused || focus === planet.name}
                        name={planet.name}
                        onPlanetClick={onPlanetClick}
                        selectedPlanet={selectedPlanet}
                    />
                ) : null;
            })}
        </group>
    );
};

export default SolarSystem;
