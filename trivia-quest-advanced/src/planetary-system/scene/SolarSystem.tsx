import React from 'react';
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
  focus?: string | null;
}

const planetComponents: { [key: string]: React.FC<any> } = {
    'Timber Hearth': TimberHearth,
    'Ember Twin': EmberTwin,
    'Ash Twin': AshTwin,
    'Brittle Hollow': BrittleHollow,
    'Giants Deep': GiantsDeep,
    'Dark Bramble': DarkBramble,
    'Quantum Moon': QuantumMoon,
};

const SolarSystem: React.FC<SolarSystemProps> = ({ onPlanetClick, focus }) => {
    const { selectedPlanet } = useSolarSystemStore();
    const isAnyPlanetFocused = focus !== null && focus !== undefined;

    return (
        <group>
            {PLANET_DATA.map((planet) => {
                const PlanetComponent = planetComponents[planet.name];
                return PlanetComponent ? (
                    <PlanetComponent
                        key={planet.name}
                        position={planet.position}
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