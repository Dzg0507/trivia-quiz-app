import React from 'react';
import AshTwin from './planets/AshTwin.tsx';
import EmberTwin from './planets/EmberTwin.tsx';
import BrittleHollow from './planets/BrittleHollow.tsx';
import GiantsDeep from './planets/GiantsDeep.tsx';
import TimberHearth from './planets/TimberHearth.tsx';
import DarkBramble from './planets/DarkBramble.tsx';
import QuantumMoon from './planets/QuantumMoon.tsx';

interface SolarSystemProps {
  onPlanetClick: (planetName: string) => void;
  focus?: string | null;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ onPlanetClick, focus }) => {
  const isAnyPlanetFocused = focus !== null && focus !== undefined;

  return (
    <group>
      <group name="Hour" position={[30, 0, 0]}>
        <EmberTwin onPlanetClick={onPlanetClick} visible={!isAnyPlanetFocused || focus === 'ember-twin'} name="ember-twin" position={[5, 0, 0]} />
        <AshTwin onPlanetClick={onPlanetClick} visible={!isAnyPlanetFocused || focus === 'ash-twin'} name="ash-twin" position={[-5, 0, 0]} />
      </group>

      <TimberHearth position={[0, 0, 0]} visible={!isAnyPlanetFocused || focus === 'limber'} name="limber" onPlanetClick={onPlanetClick} />
      <BrittleHollow position={[-40, 0, 20]} visible={!isAnyPlanetFocused || focus === 'brittle'} name="brittle" onPlanetClick={onPlanetClick} />
      <GiantsDeep position={[60, 0, -30]} visible={!isAnyPlanetFocused || focus === 'deep'} name="deep" onPlanetClick={onPlanetClick} />
      <DarkBramble position={[-80, 0, -50]} visible={!isAnyPlanetFocused || focus === 'bramble'} name="bramble" onPlanetClick={onPlanetClick} />
      <QuantumMoon position={[10, 0, 90]} name="quantum" onPlanetClick={onPlanetClick} />
    </group>
  );
};

export default SolarSystem;