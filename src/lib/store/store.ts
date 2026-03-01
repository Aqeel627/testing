/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export const useAppStore = create<any>((set) => ({
  userBalance: null,
  allEventsList: null,
  casinoEvents: null,
  exchangeTypeList: null,
  menuList: null,
  exchangeNews: null,
  stakeValue: null,
  selectedEventTypeId: null,
  selectedBet: null,
  inplayEvents: null,
  /* new data variables */

  setCasinoEvents: (data: any) => set({ casinoEvents: data }),
  setExchangeTypeList: (data: any) => set({ exchangeTypeList: data }),
  setMenuList: (data: any) => set({ menuList: data }),
  setExchangeNews: (data: any) => set({ exchangeNews: data }),
  setStakeValue: (data: any) => set({ stakeValue: data }),
  setUserBalance: (value: any) => set({ userBalance: value }),
  setSelectedEventTypeId: (id: string) => set({ selectedEventTypeId: id }),
  setSelectedBet: (data: any) => set({ selectedBet: data }),
  clearSelectedBet: () => set({ selectedBet: null }),
  /* new data functions */
slipPreview: { stake: 0, price: 0 },
setSlipPreview: (v: { stake: number; price: number }) => 
  set({ slipPreview: v }),


  setAllEventsList: (data: any) =>
    set(() => {
      if (!data) return { allEventsList: data, inplayEvents: null };

      // descending keys order: 4 → 2 → 1
      const keys = Object.keys(data)
        .map(Number)
        .sort((a, b) => b - a);

      const result: any = {};
      let all: any[] = [];

      keys.forEach((key) => {
        const filtered = (data[key] || []).filter((item: any) => item?.inplay);
        result[key] = filtered;
        all = [...all, ...filtered];
      });

      result.all = all;
      result.totalLength = all.length;

      return {
        allEventsList: data,
        inplayEvents: result,
      };
    }),
}));
