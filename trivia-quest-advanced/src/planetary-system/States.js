import { create } from 'zustand'

export const useSolarSystemStore = create((set) => ({
  focus: null,
  quantumObserved: false,
  setFocus: (focus) => set({ focus }),
  setQuantumObserved: (quantumObserved) => set({ quantumObserved }),
}))
