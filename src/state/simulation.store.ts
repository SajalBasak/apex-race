import { create } from "zustand";

import { createInitialSimulation } from "@/data/create-initial-simulation";
import type { SimulationState } from "@/simulation/simulation.types";

interface SimulationStore {
  state: SimulationState;

  setState: (
    updater:
      | SimulationState
      | ((current: SimulationState) => SimulationState),
  ) => void;

  reset: () => void;
}

export const useSimulationStore =
  create<SimulationStore>((set) => ({
    state: createInitialSimulation(),

    setState: (updater) =>
      set((current) => ({
        state:
          typeof updater === "function"
            ? updater(current.state)
            : updater,
      })),

    reset: () =>
      set({
        state: createInitialSimulation(),
      }),
  }));