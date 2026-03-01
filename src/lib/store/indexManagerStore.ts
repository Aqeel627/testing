/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export const useIndexManagerStore = create<any>((set) => ({
  banners: null,
  casinoGames: null,
  allEventsList: null,
  competitions: null,
  eventsByApi: null,
  eventTypes: null,

  setBanners: (data: any) => set({ banners: data }),
  setCasinoGames: (data: any) => set({ casinoGames: data }),
  setAllEventsList: (data: any) => set({ allEventsList: data }),
  setCompetitions: (data: any) => set({ competitions: data }),
  setEventsByApi: (data: any) => set({ eventsByApi: data }),
  setEventTypes: (data: any) => set({ eventTypes: data }),
}));
