import { create } from "zustand";

interface LayoutWidthState {
  mainWidth: number;
  setMainWidth: (width: number) => void;
}

export const useLayoutWidthStore = create<LayoutWidthState>((set) => ({
  mainWidth: 0,
  setMainWidth: (width) => set({ mainWidth: width }),
}));
