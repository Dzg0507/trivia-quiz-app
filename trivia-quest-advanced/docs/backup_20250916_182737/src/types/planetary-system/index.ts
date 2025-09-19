// Planetary System Types
export interface Planet {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  texture: string;
  questId?: string;
  unlocked: boolean;
}

export interface PlanetarySystemState {
  planets: Planet[];
  activePlanet: Planet | null;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  isAnimating: boolean;
  isZoomedIn: boolean;
}
