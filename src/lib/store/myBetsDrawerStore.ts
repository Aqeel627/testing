import { create } from "zustand";

type Mode = "MY_BETS" | "OPEN_BETS";

type State = {
  isOpen: boolean;
  mode: Mode;
  eventId: string | null;
  sportId: string | null;

  openMyBets: () => void;
  openOpenBets: (eventId: string, sportId: string) => void;
  close: () => void;

  // internal safe setter (no-op on same value)
  setOpen: (v: boolean) => void;
};

export const useMyBetsDrawerStore = create<State>((set) => ({
  isOpen: false,
  mode: "MY_BETS",
  eventId: null,
  sportId: null,

  setOpen: (v) => set((s) => (s.isOpen === v ? s : { isOpen: v })),

  openMyBets: () =>
    set((s) =>
      s.isOpen && s.mode === "MY_BETS"
        ? s
        : { isOpen: true, mode: "MY_BETS", eventId: null, sportId: null },
    ),

  openOpenBets: (eventId, sportId) =>
    set((s) =>
      s.isOpen && s.mode === "OPEN_BETS" && s.eventId === eventId && s.sportId === sportId
        ? s
        : { isOpen: true, mode: "OPEN_BETS", eventId, sportId },
    ),

  close: () => set((s) => (!s.isOpen ? s : { isOpen: false })),
}));