export interface QuestArea {
  id: string;
  name: string;
  planetName: string;
  position: [number, number, number];
  description: string;
}

export const QUEST_AREAS: QuestArea[] = [
  // Timber Hearth
  { id: 'timber-hearth-village', name: 'The Village', planetName: 'Timber Hearth', position: [0.1, 0.1, 4.5], description: 'The heart of the Hearthian society.' },
  { id: 'timber-hearth-crater', name: 'Youngbark Crater', planetName: 'Timber Hearth', position: [-2, 4, 0], description: 'A notable crater on Timber Hearth.' },
  { id: 'timber-hearth-geyser', name: 'Geyser Mountains', planetName: 'Timber Hearth', position: [-5.0, 0.0, 0.0], description: 'A mountain range known for its geysers.' },
  { id: 'timber-hearth-tower', name: 'Radio Tower', planetName: 'Timber Hearth', position: [3.0, 3.5, 1.0], description: 'A communication tower on a hill.' },
  { id: 'timber-hearth-grove', name: 'Quantum Grove', planetName: 'Timber Hearth', position: [0, -4.2, 0], description: 'A grove with quantum properties.' },
  { id: 'timber-hearth-mines', name: 'Nomai Mines', planetName: 'Timber Hearth', position: [3.5, 0, -4.0], description: 'Ancient mines left by the Nomai.' },

  // Ember Twin
  { id: 'ember-twin-pod', name: 'Escape Pod 2', planetName: 'Ember Twin', position: [2.75, -2.0, 2.0], description: 'A crashed Nomai escape pod.' },
  { id: 'ember-twin-cannon', name: 'Gravity Cannon', planetName: 'Ember Twin', position: [0, -1.0, -4.0], description: 'A large Nomai device.' },
  { id: 'ember-twin-lab', name: 'High Energy Lab', planetName: 'Ember Twin', position: [-3.5, 1.0, 3.0], description: 'A lab for high-energy experiments.' },
  { id: 'ember-twin-locator', name: 'Quantum Moon Locator', planetName: 'Ember Twin', position: [0, -4.0, 0], description: 'A device to locate the Quantum Moon.' },
  { id: 'ember-twin-camp', name: 'Chert\'s Camp', planetName: 'Ember Twin', position: [0, 3.5, 0], description: 'The camp of the astronomer, Chert.' },

  // Brittle Hollow
  { id: 'brittle-hollow-city', name: 'Hanging City', planetName: 'Brittle Hollow', position: [1.0, 1.5, 0], description: 'A city hanging from the crust.' },
  { id: 'brittle-hollow-observatory', name: 'Southern Observatory', planetName: 'Brittle Hollow', position: [0, -4.5, 0], description: 'An observatory at the south pole.' },
  { id: 'brittle-hollow-glacier', name: 'Northern Glacier', planetName: 'Brittle Hollow', position: [0, 4.2, 0], description: 'A glacier at the north pole.' },
  { id: 'brittle-hollow-cannon', name: 'Gravity Cannon', planetName: 'Brittle Hollow', position: [4.2, 0, 0], description: 'A large Nomai device.' },
  { id: 'brittle-hollow-pod', name: 'Escape Pod 1', planetName: 'Brittle Hollow', position: [0, 1.0, -4.5], description: 'A crashed Nomai escape pod.' },
  { id: 'brittle-hollow-tower', name: 'Tower of Quantum Knowledge', planetName: 'Brittle Hollow', position: [-1.0, -1.0, 0], description: 'A tower with quantum secrets.' },

  // Giant's Deep
  { id: 'giants-deep-cannon', name: 'Orbital Probe Cannon', planetName: 'Giants Deep', position: [4.0, 0.5, 5.0], description: 'The cannon that launches probes.' },

  // Quantum Moon
  { id: 'quantum-moon', name: 'Quantum Moon', planetName: 'Quantum Moon', position: [0, 1.2, 0], description: 'A mysterious moon with quantum properties.' },

  // Ash Twin (Placeholder)
  { id: 'ash-twin-project', name: 'Ash Twin Project', planetName: 'Ash Twin', position: [0, 0, 0], description: 'The core of the Ash Twin.' },

  // Dark Bramble (Placeholder)
  { id: 'dark-bramble-feldspar', name: 'Feldspar\'s Camp', planetName: 'Dark Bramble', position: [0, 0, 0], description: 'The camp of the lost explorer, Feldspar.' },
];
