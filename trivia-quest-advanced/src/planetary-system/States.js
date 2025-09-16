import { create } from 'zustand'
import { QUEST_DEFINITIONS } from "../config/questDefinitions";

export const useSolarSystemStore = create((set, get) => ({
  focus: null,
  quantumObserved: false,
  setFocus: (focus) => set({ focus }),
  setQuantumObserved: (quantumObserved) => set({ quantumObserved }),

  selectedPlanet: null,
  selectedQuestAreaIndex: 0,
  questAreas: [],

  setSelectedPlanet: (planetName) => {
      const areas = QUEST_DEFINITIONS.filter(q => q.planetName === planetName);
      set({ selectedPlanet: planetName, questAreas: areas, selectedQuestAreaIndex: 0 });
  },

  nextQuestArea: () => {
      const { selectedQuestAreaIndex, questAreas } = get();
      if (questAreas.length === 0) return;
      const nextIndex = (selectedQuestAreaIndex + 1) % questAreas.length;
      set({ selectedQuestAreaIndex: nextIndex });
  },

  previousQuestArea: () => {
      const { selectedQuestAreaIndex, questAreas } = get();
      if (questAreas.length === 0) return;
      const prevIndex = (selectedQuestAreaIndex - 1 + questAreas.length) % questAreas.length;
      set({ selectedQuestAreaIndex: prevIndex });
  },
}))
