import { create } from "zustand";

type AppState = {
  isOpenSearch: boolean;
  toggleSearch: (open: boolean) => void;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
  openSidebar: () => void;
  isBetsOpen: boolean;
  toggleBets: () => void;
};

export const useUIStore = create<AppState>((set) => ({
  isOpenSearch: false,
  toggleSearch: (open) => set({ isOpenSearch: open }),
  isSidebarOpen: false,
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  isBetsOpen: true,
  toggleBets: () => set((state) => ({ isBetsOpen: !state.isBetsOpen })),
}));
