/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export const useIndexManagerStore = create<any>((set) => ({
  banners: null,
  casinoGames: null,
  eventsBySocket: null,
  inplayEvents: null,
  competitions: null,
  eventsByApi: null,
  eventTypes: null,

  setBanners: (data: any) => set({ banners: data }),
  setCasinoGames: (data: any) => set({ casinoGames: data }),
  setCompetitions: (data: any) => set({ competitions: data }),
  setEventsByApi: (data: any) => set({ eventsByApi: data }),
  setEventTypes: (data: any) => set({ eventTypes: data }),
  setEventsBySocket: (data: any) =>
    set(() => {
      if (!data) return { eventsBySocket: data, inplayEvents: null };

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
        eventsBySocket: data,
        inplayEvents: result,
      };
    }),
}));
