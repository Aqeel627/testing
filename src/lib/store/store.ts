/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAppStore = create<any>()(
  persist(
    (set) => ({
      userBalance: null,
      allEventsList: null,
      casinoEvents: null,
      exchangeTypeList: null,
      menuList: null,
      exchangeNews: null,
      stakeValue: null,

      setCasinoEvents: (data: any) => set({ casinoEvents: data }),
      setExchangeTypeList: (data: any) => set({ exchangeTypeList: data }),
      setMenuList: (data: any) => set({ menuList: data }),
      setAllEventsList: (data: any) => set({ allEventsList: data }),
      setExchangeNews: (data: any) => set({ exchangeNews: data }),
      setStakeValue: (data: any) => set({ stakeValue: data }),
      setUserBalance: (value: any) => set({ userBalance: value }),
    }),
    {
      name: "app-storage", // localStorage key
    }
  )
);
