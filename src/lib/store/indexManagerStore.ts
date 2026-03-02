/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export const useIndexManagerStore = create<any>((set) => ({
  banners: null,
  casinoGames: null,
  inplayEvents: null,
  competitions: null,
  allEventsList: null,
  eventTypes: null,

  setBanners: (data: any) => set({ banners: data }),
  setCasinoGames: (data: any) => set({ casinoGames: data }),
  setCompetitions: (data: any) => set({ competitions: data }),
  setEventTypes: (data: any) => set({ eventTypes: data }),
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
