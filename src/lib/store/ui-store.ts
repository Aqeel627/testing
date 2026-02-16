import { create } from "zustand";

type AppState = {
  isOpenSearch: boolean;
  toggleSearch: (open: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  isOpenSearch: false,
  toggleSearch: (open) => set({ isOpenSearch: open }),
}));