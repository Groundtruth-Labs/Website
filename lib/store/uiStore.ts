import { create } from "zustand";

interface UiStore {
  droneSectionActive: boolean;
  setDroneActive: (active: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  droneSectionActive: false,
  setDroneActive: (active) => set({ droneSectionActive: active }),
}));
