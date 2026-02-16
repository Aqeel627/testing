/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export const useAppStore = create<any>((set) => ({
  userBalance: null,

  allEventsList: null,
  casinoEvents: null,
  exchangeTypeList: null,
  menuList: null,
  exchangeNews: null,
  stakeValue:null,

  setCasinoEvents: (data: any) => set({ casinoEvents: data }),
  setExchangeTypeList: (data: any) => set({ exchangeTypeList: data }),
  setMenuList: (data: any) => set({ menuList: data }),
  setAllEventsList: (data: any) => set({ allEventsList: data }),
  setExchangeNews: (data: any) => set({ exchangeNews: data }),
  setStakeValue: (data: any) => set({ stakeValue: data }),

  // auth setter
  setUserBalance: (value: any) => set({ userBalance: value }),
  

  //   reset: () =>
  //     set({
  //       trendingList: [],
  //       allEventsList: [],
  //       isAuthUser: false,
  //       AllSportList: [],
  //       isLoginOpen: false,
  //       isRegisterOpen: false,
  //     }),
}));
