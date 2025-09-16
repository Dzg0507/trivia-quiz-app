export interface PlanetData {
  name: string;
  position: [number, number, number];
}

export const PLANET_DATA: PlanetData[] = [
  { name: 'Timber Hearth', position: [0, 0, 0] },
  { name: 'Ember Twin', position: [20, 0, 0] },
  { name: 'Ash Twin', position: [20, 0, 5] },
  { name: 'Brittle Hollow', position: [40, 0, 0] },
  { name: 'Giants Deep', position: [60, 0, 0] },
  { name: 'Dark Bramble', position: [80, 0, 0] },
  { name: 'Quantum Moon', position: [100, 0, 0] },
];
