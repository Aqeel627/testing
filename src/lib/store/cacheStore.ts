/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCacheStore = create<any>()(
  persist(
    (set) => ({
      loginModal: false,
      setLoginModal: (open: boolean) => set({ loginModal: open }),
    }),
    {
      name: "cache-store", // localStorage key
    },
  ),
);
