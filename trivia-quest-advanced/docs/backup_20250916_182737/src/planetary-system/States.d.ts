import { StoreApi, UseBoundStore } from 'zustand';

interface SolarSystemState {
    focus: string | null;
    quantumObserved: boolean;
    setFocus: (focus: string | null) => void;
    setQuantumObserved: (quantumObserved: boolean) => void;
}

export const useSolarSystemStore: UseBoundStore<StoreApi<SolarSystemState>>;
