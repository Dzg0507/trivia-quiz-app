import React from 'react';
import AshTwin from './planets/AshTwin.tsx';
import EmberTwin from './planets/EmberTwin.tsx';
import BrittleHollow from './planets/BrittleHollow.tsx';
import GiantsDeep from './planets/GiantsDeep.tsx';
import TimberHearth from './planets/TimberHearth.tsx';
import DarkBramble from './planets/DarkBramble.tsx';
import QuantumMoon from './planets/QuantumMoon.tsx';

import { useSolarSystemStore } from '../States';

interface SolarSystemProps {
  onPlanetClick: (planetName: string) => void;
  focus?: string | null;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ onPlanetClick, focus }) => {
  const { selectedPlanet } = useSolarSystemStore();
  const isAnyPlanetFocused = focus !== null && focus !== undefined;

  return (
    <group>
      <group name="Hour" position={[30, 0, 0]}>
        <EmberTwin onPlanetClick={onPlanetClick} visible={!isAnyPlanetFocused || focus === 'Ember Twin'} name="Ember Twin" position={[5, 0, 0]} selectedPlanet={selectedPlanet} />
        <AshTwin onPlanetClick={onPlanetClick} visible={!isAnyPlanetFocused || focus === 'Ash Twin'} name="Ash Twin" position={[-5, 0, 0]} selectedPlanet={selectedPlanet} />
      </group>

      <TimberHearth position={[0, 0, 0]} visible={!isAnyPlanetFocused || focus === 'Timber Hearth'} name="Timber Hearth" onPlanetClick={onPlanetClick} selectedPlanet={selectedPlanet} />
      <BrittleHollow position={[-40, 0, 20]} visible={!isAnyPlanetFocused || focus === 'Brittle Hollow'} name="Brittle Hollow" onPlanetClick={onPlanetClick} selectedPlanet={selectedPlanet} />
      <GiantsDeep position={[60, 0, -30]} visible={!isAnyPlanetFocused || focus === 'Giants Deep'} name="Giants Deep" onPlanetClick={onPlanetClick} selectedPlanet={selectedPlanet} />
      <DarkBramble position={[-80, 0, -50]} visible={!isAnyPlanetFocused || focus === 'Dark Bramble'} name="Dark Bramble" onPlanetClick={onPlanetClick} selectedPlanet={selectedPlanet} />
      <QuantumMoon position={[10, 0, 90]} name="Quantum Moon" onPlanetClick={onPlanetClick} selectedPlanet={selectedPlanet} />
    </group>
  );
};

export default SolarSystem;