import { create } from "zustand";

interface UIState {
  selectedDriverId: string;
  focusedTyre: "fl" | "fr" | "rl" | "rr" | null;

  selectDriver: (driverId: string) => void;
  focusTyre: (
    tyre: "fl" | "fr" | "rl" | "rr" | null,
  ) => void;
}

export const useUIStore = create<UIState>((set) => ({
  selectedDriverId: "nova-07",

  focusedTyre: null,

  selectDriver: (driverId) =>
    set({
      selectedDriverId: driverId,
      focusedTyre: null,
    }),

  focusTyre: (tyre) =>
    set({
      focusedTyre: tyre,
    }),
}));