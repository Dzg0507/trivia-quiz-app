import { create } from 'zustand'
import { QUEST_DEFINITIONS } from "../config/questDefinitions";
import { Quest } from '../types/quests';

// Define the store state type
export interface SolarSystemState {
  focus: string | null;
  quantumObserved: boolean;
  selectedPlanet: string | null;
  selectedQuestAreaIndex: number;
  questAreas: Quest[];
  isPlanetJustSelected: boolean;
  
  setFocus: (focus: string | null) => void;
  setQuantumObserved: (quantumObserved: boolean) => void;
  setSelectedPlanet: (planetName: string | null) => void;
  setIsPlanetJustSelected: (value: boolean) => void;
  setQuestAreas: (areas: Quest[]) => void;
  nextQuestArea: () => void;
  previousQuestArea: () => void;
}

export const useSolarSystemStore = create<SolarSystemState>((set, get) => ({
  focus: null,
  quantumObserved: false,
  selectedPlanet: null,
  selectedQuestAreaIndex: 0,
  questAreas: [],
  isPlanetJustSelected: false,

  setFocus: (focus) => set({ focus }),
  setQuantumObserved: (quantumObserved) => set({ quantumObserved }),
  setIsPlanetJustSelected: (value) => set({ isPlanetJustSelected: value }),
  setQuestAreas: (areas) => set({ questAreas: areas }),

  setSelectedPlanet: (planetName) => {
      if (planetName === null) {
          set({ selectedPlanet: null, questAreas: [], selectedQuestAreaIndex: 0, isPlanetJustSelected: false });
          return;
      }
      const areas = QUEST_DEFINITIONS.filter(q => q.planetName === planetName);
      set({ selectedPlanet: planetName, questAreas: areas, selectedQuestAreaIndex: 0, isPlanetJustSelected: true });
  },

  nextQuestArea: () => {
      const { selectedQuestAreaIndex, questAreas } = get();
      if (questAreas.length === 0) return;
      const newIndex = (selectedQuestAreaIndex + 1) % questAreas.length;
      console.log('Next quest area:', {
        current: selectedQuestAreaIndex,
        new: newIndex,
        total: questAreas.length
      });
      set({ selectedQuestAreaIndex: newIndex, isPlanetJustSelected: false });
  },

  previousQuestArea: () => {
      const { selectedQuestAreaIndex, questAreas } = get();
      if (questAreas.length === 0) return;
      const prevIndex = (selectedQuestAreaIndex - 1 + questAreas.length) % questAreas.length;
      console.log('Previous quest area:', {
        current: selectedQuestAreaIndex,
        new: prevIndex,
        total: questAreas.length
      });
      set({ selectedQuestAreaIndex: prevIndex, isPlanetJustSelected: false });
  },
}))
