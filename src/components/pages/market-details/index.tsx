"use client";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { CONFIG } from "@/lib/config";
import axios from "axios";
import { useAppStore } from "@/lib/store/store";
import { useAppRateHighlighter } from "@/lib/highlaterMarket";
import { motion, AnimatePresence } from "framer-motion";

// WebSocket service (assumed to exist)
import { webSocketService } from "@/lib/websocket.service";
import { VideoSimple } from "@/components/video-simple/VideoSimple";
import dynamic from "next/dynamic";
// import MarketLoader from "@/components/common/market-loader";
const MarketLoader = dynamic(() => import("@/components/common/market-loader"));
import RuleModal from "@/components/modal/role";
import Icon from "@/icons/icons";
import MBetSlip from "@/components/common/m-betslip";
import { EventTimer } from "@/components/common/single-market/event-timer";
import { useTheme } from "next-themes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/common/tooltip";
import Link from "next/link";
import { eventBus } from "@/lib/eventBus";
import http from "@/lib/axios-instance";
import { useAuthStore } from "@/lib/useAuthStore";
import { useToast } from "@/components/common/toast/toast-context";
import { fetchData } from "@/lib/functions";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";

interface RunnerName {
  selectionId: number;
  runnerName: string;
  metadata?: string;
}

interface Market {
  sequence: any;
  popular: boolean;
  status: string;
  marketId: string;
  exMarketId?: string;
  event?: { name: string };
  eventType?: { name?: string };
  marketName?: string;
  oddsType?: string;
  marketType?: string;
  min?: number;
  max?: number;
  runnersName: RunnerName[];
  runnerNameMap?: Record<number, string>;
  racingInfo?: Record<number, string>;
  runners?: Array<{
    selectionId: number;
    status?: string;
    ex?: {
      availableToBack: Array<{ price: number; size: number }>;
      availableToLay: Array<{ price: number; size: number }>;
    };
  }>;
}

type TabKey = "ALL" | "POPULAR" | string;

const isSuspendedLike = (s?: string) => {
  const v = String(s || "").toUpperCase();
  return (
    v === "SUSPENDED" || v === "SUSPEND" || v === "CLOSED" || v === "BALLRUN"
  );
};

const cleanPrice = (v: any) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) return "0";
  return n.toFixed(2).replace(/\.?0+$/, "");
};

const shortNumber = (value: any): string => {
  const n = Number(value);
  if (!Number.isFinite(n) || n === 0) return "0";
  const abs = Math.abs(n);

  const powers = [
    { key: "Q", value: 1e15 },
    { key: "T", value: 1e12 },
    { key: "B", value: 1e9 },
    { key: "M", value: 1e6 },
    { key: "K", value: 1e3 },
  ];

  for (const p of powers) {
    const reduced = Math.round((abs / p.value) * 10) / 10;
    if (reduced >= 1) return `${n < 0 ? "-" : ""}${reduced}${p.key}`;
  }
  return String(Math.round(n * 10) / 10);
};

export default function MarketDetails() {
  const {
    setSelectedBet,
    // menuList,
    selectedBet,
    slipPreview,
    setAllEventsList,
  } = useAppStore();

  const { eventTypes, competitions } = useIndexManagerStore();
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const eventId = String(params.eventId ?? "");
  const sportId = String(params.sportId ?? params.marketId ?? "");
  const { isLoggedIn } = useAuthStore();
  const sportNames: any = { "4": "Cricket", "2": "Tennis", "1": "Soccer" };

  // API states
  const [allMarketPl, setAllMarketPl] = useState<
    Record<string, Record<string, number>>
  >({});
  const [fancyInfo, setFancyInfo] = useState<Market[]>([]);
  const [manualData, setManualData] = useState<Market[]>([]);
  const [liveStreaming, setLiveStreaming] = useState(false);
  const [isScorePanelOpen, setIsScorePanelOpen] = useState(false);
  const [betfairData, setBetfairData] = useState<Market[]>([]);
  const [sportsbookData, setSportsbookData] = useState<Market[]>([]);
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [popularMarkets, setPopularMarkets] = useState<Market[]>([]);
  const [teamOne, setTeamOne] = useState("");
  const [teamTwo, setTeamTwo] = useState("");
  const [tournamentName, setTournamentName] = useState("");
  const [sportName, setSportName] = useState("");
  const [eventName, setEventName] = useState("");
  const [marketTime, setMarketTime] = useState("");
  const [ruleContent, setRuleContent] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [competition, setCompetition] = useState([]);
  const [openRules, setOpenRules] = useState(false);
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const [isEventsDropDown, setIsEventsDropDown] = useState(false);
  const [streamCounter, setStreamCounter] = useState(0);
  const { resolvedTheme, theme } = useTheme();
  const subTabsListRef = useRef<HTMLDivElement>(null);
  const [subActiveTab, setSubActiveTab] = useState<"FANCY" | "SPORTSBOOK">(
    "FANCY",
  );
  const [subIndicatorStyle, setSubIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const [matchedBets, setMatchedBets] = useState<any[]>([]);
  const handleAllEvents = (data: any) => {
    setAllEventsList(data);
    router.push("/");
  };
  // ── ADD: fetch PL ───────────────────────────────────────────────

  const fetchMarketPL = useCallback(async () => {
    if (!eventId || !sportId || !isLoggedIn) return;
    try {
      const res: any = await http.post(CONFIG.getAllMarketplURL, {
        eventId: String(eventId),
        sportId: String(sportId),
      });
      if (res?.data?.pl) {
        setAllMarketPl(JSON.parse(JSON.stringify(res.data.pl)));
      }
    } catch {
      /* silent */
    }
  }, [eventId, sportId, isLoggedIn]);

  const fetchBets = useCallback(async () => {
    if (!eventId || !sportId || !isLoggedIn) return;
    try {
      const res: any = await http.post(CONFIG.unmatchedBets, {
        eventId: String(eventId),
        sportId: String(sportId),
      });
      setMatchedBets(res?.data?.data?.matchedBets || []);
    } catch {
      /* silent */
    }
  }, [eventId, sportId, isLoggedIn]);

  // ── ADD: call on mount ──────────────────────────────────────────
  useEffect(() => {
    fetchMarketPL();
    fetchBets();
  }, [eventId, sportId, fetchMarketPL, fetchBets]);

  // ── ADD: listen for post-bet refresh event ──────────────────────
  useEffect(() => {
    const unsub = eventBus.on("REFRESH_AFTER_PLACE", () => {
      fetchMarketPL();
      fetchBets();
    });
    return unsub;
  }, [fetchMarketPL, fetchBets]);

  // ── ADD: PL helper (same logic as old project) ──────────────────
  const getRunnerPL = (
    marketId: string,
    selectionId: number,
  ): number | null => {
    const plMap = allMarketPl[String(marketId)] as
      | Record<string, number>
      | undefined;
    if (!plMap) return null;
    const val = plMap[String(selectionId)];
    return val !== undefined ? Number(val) : null;
  };

  function getSide(type: string): "BACK" | "LAY" {
    if (type === "back") return "BACK";
    if (type === "lay") return "LAY";
    if (type === "yes") return "BACK"; // LINE yes → BACK
    if (type === "no") return "LAY"; // LINE no  → LAY
    return "BACK";
  }

  const dynamicSportsConfig = useMemo(() => {
    if (!eventTypes||!competitions) return [];

    const sportMap = new Map<string, any>();

    eventTypes.forEach((item: any) => {
      const sId = item?.id;
      sportMap.set(sId, {
        name: item?.name,
        id: sId,
        tournaments: new Map(),
      });
    });

    // 3. Ab events ko unke respective sports mein daalein
    competitions?.forEach((event: any) => {
      const sportId = event?.eventType?.id || "";
      const compId = event?.competition?.name || "";
      const compName = event?.competition?.name || "";
      const eventId = event?.event?.id || "";
      const eventName = event?.event?.name || "";

      if (!sportId || !compId || !eventId || !sportMap.has(sportId)) return;

      const sport = sportMap.get(sportId)!;

      if (!sport.tournaments.has(compId)) {
        sport.tournaments.set(compId, {
          name: compName,
          id: compId,
          events: [],
        });
      }

      sport.tournaments
        .get(compId)!
        .events.push({ id: eventId, name: eventName });
    });

    // 4. Return formatted data (Insertion order will be preserved)
    return Array.from(sportMap.values())
      .map((sport) => {
        const tournaments = Array.from(sport.tournaments.values()).map(
          (comp: any) => ({
            name: comp.name,
            count: comp.events.length,
            href: undefined,
            thirdItems: comp.events.map((evt: any) => ({
              name: evt.name,
              count: 1,
              id: evt.id,
              href: `/market-details/${evt.id}/${sport.id}`,
            })),
          }),
        );

        return {
          id: sport.id,
          name: sport.name,
          count: tournaments.reduce((sum, t) => sum + t.count, 0),
          tournaments,
        };
      })
      .filter((sport) => sport.count > 0);
  }, [eventTypes, competitions]);

  const thirdItems = useMemo(() => {
    // Agar data mojood nahi hai toh empty array bhej dein
    if (!dynamicSportsConfig || !Array.isArray(dynamicSportsConfig)) return [];

    // 1. Pehle sport ko uski 'id' se find karein
    const matchedSport = dynamicSportsConfig?.find(
      (sport) => sport.id === sportId,
    );

    if (matchedSport && matchedSport.tournaments) {
      // 2. Phir uske andar 'tournaments' array mein se tournament ka naam match karein
      const matchedTournament = matchedSport.tournaments.find(
        (tournament) => tournament.name === tournamentName,
      );

      if (matchedTournament && matchedTournament.thirdItems) {
        // 3. Agar tournament mil jaye, toh uske 'thirdItems' return kar dein
        return matchedTournament.thirdItems;
      }
    }

    // Agar sport ya tournament na mile toh empty array return karein
    return [];
  }, [dynamicSportsConfig, sportId, tournamentName]); // Dependency array

  const [selectedEventType, setSelectedEventType] = useState<string>(
    sportName || "",
  );
  const [selectedCompetition, setSelectedCompetition] = useState<string>("");

  const eventTypeRef = useRef<HTMLSpanElement | null>(null);
  const competitionRef = useRef<HTMLSpanElement | null>(null);
  const eventDropRef = useRef<HTMLSpanElement | null>(null);

  // Current market type for filtering - IMPORTANT: track current tab
  const [currentMarketType, setCurrentMarketType] = useState<string>("POPULAR");
  const [currentMarketId, setCurrentMarketId] = useState<string>("");

  // Tabs + indicator
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("POPULAR");
  const [isMarketSectionOpen, setIsMarketSectionOpen] = useState(true);
  const [subMarketSectionOpen, setSubMarketSectionOpen] = useState(true);
  const [isLineSectionOpen, setIsLineSectionOpen] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
    animate: false,
  });

  useEffect(() => {
    if (!selectedBet?.selectionId) return;
    setTimeout(() => {
      const el = document.getElementById(
        `betslip-${selectedBet.selectionId}-${selectedBet.marketType}`,
      );
      if (el) {
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offset = window.innerHeight / 2 - el.offsetHeight / 2;
        let position = elementPosition - offset;
        if (position < 0) position = 0;
        window.scrollTo({ top: position, behavior: "smooth" });
      }
    }, 50);
  }, [selectedBet?.selectionId, selectedBet?.marketType]);
  // Socket cleanup refs
  const socketCleanupRef = useRef<(() => void) | null>(null);
  const subscribedMarketIdsRef = useRef<string[]>([]);

  // Add highlighter hook
  useAppRateHighlighter();

  const buildRunnerNameMap = (market: any) => {
    const map: Record<number, string> = {};
    (market?.runnersName || []).forEach((r: any) => {
      map[Number(r.selectionId)] = r.runnerName;
    });
    return map;
  };

  // Merge helper for odds update
  const mergeSide = (prevSide: any[], incoming: any): any[] => {
    const base: any[] = Array.isArray(prevSide) ? [...prevSide] : [];

    const write = (i: number, val: any) => {
      base[i] = {
        price: val?.price ?? 0,
        size: val?.size ?? 0,
        totalMatched: val?.totalMatched ?? 0,
        status: val?.status ?? base[i]?.status ?? "ACTIVE",
      };
    };

    if (Array.isArray(incoming)) {
      incoming.forEach((v, i) => v && write(i, v));
    } else if (incoming && typeof incoming === "object") {
      Object.keys(incoming).forEach((k) => {
        const i = Number(k);
        if (!Number.isNaN(i)) write(i, incoming[k]);
      });
    }

    for (let i = 0; i < 3; i++) {
      if (!base[i]) {
        base[i] = {
          price: 0,
          size: 0,
          status: incoming?.status ?? "ACTIVE",
        };
      }
    }
    return base;
  };

  const getMarketList = async () => {
    try {
      const req = {
        eventId: String(params?.eventId ?? ""),
        eventTypeId: String(params?.sportId ?? params?.marketId ?? ""),
        key: "10",
      };

      const res = await axios.post(CONFIG.marketList, req);
      const data = res.data?.data;

      if (res?.data?.pl) {
        const freshPl = JSON.parse(JSON.stringify(res.data.pl));
        setAllMarketPl(freshPl);
      }

      if (!data) return;
      setTournamentName(data?.matchOddsData[0]?.competition?.name);
      setSportName(data?.matchOddsData[0]?.eventType.name);
      setMarketTime(data?.matchOddsData[0]?.marketStartTime);
      const matchOdds = data?.matchOddsData?.[0];
      setTeamOne(matchOdds?.runnersName[0]?.runnerName);
      setTeamTwo(matchOdds?.runnersName[1]?.runnerName);
      const fancy = (data?.fancyData || []) as Market[];
      const manual = (data?.bookmakersData || []) as Market[];
      const betfair = (data?.matchOddsData || []) as Market[];
      const sportsbook = (data?.sportsbookData || []) as Market[];

      // attach maps on each market
      const all = [...fancy, ...manual, ...betfair, ...sportsbook].map(
        (m: any) => {
          const mm = { ...m } as any;
          mm.runnerNameMap = buildRunnerNameMap(mm);

          // 🐎 Racing info
          if (
            String(params.sportId) === "7" ||
            String(params.sportId) === "4339"
          ) {
            const rmap: Record<number, string> = {};
            (mm.runnersName || []).forEach((r: any) => {
              if (r.metadata) rmap[Number(r.selectionId)] = r.metadata;
            });
            mm.racingInfo = rmap;
          }
          return mm;
        },
      );

      setFancyInfo(fancy);
      setManualData(manual);
      setBetfairData(betfair);
      setSportsbookData(sportsbook);
      setAllMarkets(all);

      //  NEW LOGIC: Handle No Active Markets Found
      // if (all.length === 0) {
      //   showToast(
      //     "error",
      //     "No Market Found ",
      //     "We couldn't locate any active markets for your selection.",
      //   );
      //  this.toastService.showFromResponse(
      //             'error,  No Market Found, We couldn’t locate any active markets for your selection.'
      //           );
      // console.log("No Markets are active");

      // // 2. Fetch fresh lists in background (mimicking your old project services)
      // try {
      //   const isRacing = sportId === '7' || sportId === '4339';
      //   const endpoint = isRacing ? CONFIG.racingEventsList : CONFIG.getAllEventsList;

      //   // Using axios to refresh lists in background
      //   axios.post(endpoint, { key: CONFIG.siteKey || "10" })
      //     .catch(err => console.error("Background refresh failed", err));
      // } catch (e) {
      //   console.error("Service error:", e);
      // }

      // 3. Navigate to home and stop execution
      //   router.push("/");
      //   return;
      // }
      // Calculate popular markets
      const popular = all
        .filter((market: any) => market.popular && market?.status !== "CLOSED")
        .sort((a: any, b: any) => a.sequence - b.sequence);
      setPopularMarkets(popular);

      // Set default filtered markets based on current tab
      if (currentMarketType === "POPULAR") {
        setFilteredMarkets(popular);
      } else if (currentMarketType === "ALL") {
        setFilteredMarkets(
          all.sort((a: any, b: any) => a.sequence - b.sequence),
        );
      } else if (currentMarketId) {
        const specific = all
          .filter(
            (market: any) =>
              market.marketId === currentMarketId &&
              market?.status !== "CLOSED",
          )
          .sort((a: any, b: any) => a.sequence - b.sequence);
        setFilteredMarkets(specific);
      } else {
        setFilteredMarkets(popular);
      }

      // event name best-effort
      if ((betfair as any)?.[0]?.event?.name)
        setEventName((betfair as any)[0].event.name);
      else if ((manual as any)?.[0]?.event?.name)
        setEventName((manual as any)[0].event.name);

      // 🎯 No Market Found → fallback IndexedDB
      if (all.length === 0) {
        showToast(
          "error",
          "No Market Found ",
          "We couldn't locate any active markets for your selection.",
        );
        const readAllFromStore = <T,>(
          dbName: string,
          storeName: string,
        ): Promise<T[]> =>
          new Promise((resolve, reject) => {
            const req = indexedDB.open(dbName);
            req.onerror = () => reject(req.error);
            req.onsuccess = () => {
              const db = req.result;
              try {
                if (!db.objectStoreNames.contains(storeName)) {
                  db.close();
                  resolve([]);
                  return;
                }
                const tx = db.transaction(storeName, "readonly");
                const store = tx.objectStore(storeName);
                const getAll = store.getAll();
                getAll.onsuccess = () => {
                  resolve(getAll.result as T[]);
                  db.close();
                };
                getAll.onerror = () => {
                  reject(getAll.error);
                  db.close();
                };
              } catch (e) {
                db.close();
                reject(e);
              }
            };
            req.onupgradeneeded = () => {};
          });

        try {
          const fallbackMarkets: any[] = await readAllFromStore<any>(
            "beteverb-db",
            "markets",
          );
          if (fallbackMarkets && fallbackMarkets.length > 0) {
            const filteredBySport = fallbackMarkets.filter(
              (m: any) =>
                !params.sportId ||
                String(m.sportId) === String(params.sportId) ||
                String(m.sportId) === String(params.marketId),
            );

            const useMarkets = (
              filteredBySport.length ? filteredBySport : fallbackMarkets
            ).map((m: any) => {
              const mm = { ...m } as any;
              mm.runnerNameMap = buildRunnerNameMap(mm);

              if (
                String(params.sportId) === "7" ||
                String(params.sportId) === "4339"
              ) {
                const rmap: Record<number, string> = {};
                (mm.runnersName || []).forEach((r: any) => {
                  if (r.metadata) rmap[Number(r.selectionId)] = r.metadata;
                });
                mm.racingInfo = rmap;
              }
              return mm;
            });

            setAllMarketPl({});
            setFancyInfo([]);
            setManualData([]);
            setBetfairData([]);
            setSportsbookData([]);
            setAllMarkets(useMarkets);

            const popular = useMarkets
              .filter(
                (market: any) => market.popular && market?.status !== "CLOSED",
              )
              .sort((a: any, b: any) => a.sequence - b.sequence);
            setPopularMarkets(popular);

            // Set filtered based on current tab
            if (currentMarketType === "POPULAR") {
              setFilteredMarkets(popular);
            } else if (currentMarketType === "ALL") {
              setFilteredMarkets(
                useMarkets.sort((a: any, b: any) => a.sequence - b.sequence),
              );
            } else if (currentMarketId) {
              const specific = useMarkets
                .filter(
                  (market: any) =>
                    market.marketId === currentMarketId &&
                    market?.status !== "CLOSED",
                )
                .sort((a: any, b: any) => a.sequence - b.sequence);
              setFilteredMarkets(specific);
            } else {
              setFilteredMarkets(popular);
            }

            const bf = useMarkets.find(
              (m: any) =>
                m.oddsType === "MATCH_ODDS" || m.marketType === "MATCH_ODDS",
            );
            if (bf) setEventName(bf.event?.name || bf?.eventName || "");
          } else {
            fetchData({
              url: CONFIG.getAllEventsList,
              payload: { key: CONFIG.siteKey },
              cachedKey: "allEventsList",
              forceApiCall: true,
              setFn: handleAllEvents,
              expireIn: CONFIG.getAllEventsListTime,
            });
            return;
          }
        } catch (e) {
          // console.warn("IndexedDB read failed:", e);
          router.push("/");
        }
      }
    } catch (e) {
      // console.warn("getMarketList failed:", e);
    } finally {
      setIsLoading(false);
    }
  };

  function formatDate(dateString: any) {
    const date = new Date(dateString);

    // Get date components
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const year = date.getUTCFullYear();

    // Get time components
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    // Convert to 12-hour format
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}-${month}-${year} ${formattedHours}:${minutes}`;
  }

  // Socket subscription function - FIXED: preserves current tab
  const subscribeForMarkets = (marketIds: string[]) => {
    const cleaned = Array.from(
      new Set((marketIds || []).filter(Boolean).map(String)),
    );

    // Clean previous subscription
    if (socketCleanupRef.current) {
      socketCleanupRef.current();
      socketCleanupRef.current = null;
    }

    if (cleaned.length === 0) return;

    // Subscribe to new markets
    webSocketService.subscribeMarket(cleaned, "market-details");

    // Setup odds listener
    const offOdds = webSocketService.onEvent<any>("odds", (raw) => {
      try {
        let payload: any = raw;
        if (typeof raw === "string") payload = JSON.parse(raw);
        else if (Array.isArray(raw) && raw.length >= 2) {
          const maybe = raw[1];
          payload = typeof maybe === "string" ? JSON.parse(maybe) : maybe;
        }

        const marketId = payload?.marketId;
        if (!marketId) return;

        const exMap: Record<string, any> = payload.ex || {};
        const pt = payload?.pt || {};

        // Update all relevant states - FIXED: preserves current tab
        const updateMarketData = (prev: Market[]) =>
          prev.map((m) => {
            const id = m.exMarketId || m.marketId;
            if (String(id) !== String(marketId)) return m;

            const runners = (m.runners || []).map((r: any) => {
              const key = String(r.selectionId);
              let exEntry = exMap[key] ?? exMap[r.selectionId];

              if (!exEntry) {
                for (const k in exMap) {
                  const v = exMap[k];
                  if (v && String(v.selectionId) === key) {
                    exEntry = v;
                    break;
                  }
                }
              }

              if (!exEntry) return r;

              const prevEx = r.ex || {};
              return {
                ...r,
                ex: {
                  ...prevEx,
                  availableToBack: mergeSide(
                    prevEx.availableToBack,
                    exEntry.availableToBack,
                  ),
                  availableToLay: mergeSide(
                    prevEx.availableToLay,
                    exEntry.availableToLay,
                  ),
                },
              };
            });

            return { ...m, runners };
          });

        // Update base states
        setBetfairData(updateMarketData);
        setAllMarkets(updateMarketData);
        setPopularMarkets(updateMarketData);

        // For filtered markets, only update the odds but keep the same market list
        setFilteredMarkets((prevFiltered) => {
          return prevFiltered.map((m) => {
            const id = m.exMarketId || m.marketId;
            if (String(id) !== String(marketId)) return m;

            // Find updated market from allMarkets
            const updatedMarket = allMarkets.find(
              (am) => (am.exMarketId || am.marketId) === marketId,
            );

            if (updatedMarket) {
              return { ...updatedMarket };
            }

            // If not found in allMarkets, update manually
            const runners = (m.runners || []).map((r: any) => {
              const key = String(r.selectionId);
              let exEntry = exMap[key] ?? exMap[r.selectionId];

              if (!exEntry) {
                for (const k in exMap) {
                  const v = exMap[k];
                  if (v && String(v.selectionId) === key) {
                    exEntry = v;
                    break;
                  }
                }
              }

              if (!exEntry) return r;

              const prevEx = r.ex || {};
              return {
                ...r,
                ex: {
                  ...prevEx,
                  availableToBack: mergeSide(
                    prevEx.availableToBack,
                    exEntry.availableToBack,
                  ),
                  availableToLay: mergeSide(
                    prevEx.availableToLay,
                    exEntry.availableToLay,
                  ),
                },
              };
            });

            return { ...m, runners };
          });
        });
      } catch (e) {
        // console.error("Failed to apply odds update:", e);
      }
    });

    // Store cleanup handler
    subscribedMarketIdsRef.current = cleaned;
    socketCleanupRef.current = () => {
      webSocketService.unsubscribeMarket(cleaned);
      offOdds();
    };
  };

  // Market type filtering function
  const setMarketType = (
    type: any,
    event: any,
    catType: any,
    index: any,
    marketid: any,
  ) => {
    setSelectedBet(null);

    // Save current tab state
    setActiveTab(type);
    setCurrentMarketType(type);

    if (event) {
      // Remove active class from all list items
      const listItems = document.querySelectorAll("#naviMarketList li");
      listItems.forEach((item) => item.classList.remove("active"));

      // Add active class to clicked item
      if (event.currentTarget) {
        event.currentTarget.classList.add("active");
      }

      if (window.innerWidth < 900) {
        const listItem = document.getElementById(catType + index);
        if (listItem) {
          listItem.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }
    }

    let filtered: Market[] = [];

    if (type == "POPULAR" || type == "Popular") {
      filtered = allMarkets
        .filter((market: any) => market.popular && market?.status !== "CLOSED")
        .sort((a: any, b: any) => a.sequence - b.sequence);
    } else if (type == "ALL") {
      filtered = [...allMarkets].sort(
        (a: any, b: any) => a.sequence - b.sequence,
      );
    } else {
      filtered = allMarkets
        .filter(
          (market: any) =>
            market.marketId == marketid && market?.status !== "CLOSED",
        )
        .sort((a: any, b: any) => a.sequence - b.sequence);
    }

    setFilteredMarkets(filtered);

    // Subscribe to new filtered markets
    const idsToSubscribe = filtered
      .map((m) => m.exMarketId || m.marketId)
      .filter(Boolean)
      .map(String);
    subscribeForMarkets(idsToSubscribe);
  };

  useEffect(() => {
    if (!eventId || !sportId) return;
    setIsLoading(true);
    getMarketList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.eventId, params.sportId]);

  // Set default active tab to POPULAR when markets load - but only once
  const initialLoadRef = useRef(true);
  useEffect(() => {
    if (allMarkets.length === 0) return;

    // Only set default on initial load, not on subsequent updates
    if (initialLoadRef.current) {
      initialLoadRef.current = false;

      setActiveTab("POPULAR");
      setCurrentMarketType("POPULAR");
      setCurrentMarketId("");

      const popular = allMarkets
        .filter((market: any) => market.popular && market?.status !== "CLOSED")
        .sort((a: any, b: any) => a.sequence - b.sequence);
      setFilteredMarkets(popular);

      // Subscribe to popular markets
      const idsToSubscribe = popular
        .map((m) => m.exMarketId || m.marketId)
        .filter(Boolean)
        .map(String);
      subscribeForMarkets(idsToSubscribe);
    }
  }, [allMarkets]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketCleanupRef.current) {
        socketCleanupRef.current();
        socketCleanupRef.current = null;
      }
    };
  }, []);

  const navTabs: TabKey[] = useMemo(() => {
    const tabs: TabKey[] = ["ALL", "POPULAR"];

    popularMarkets.forEach((market) => {
      if (market.marketName && !tabs.includes(market.marketName)) {
        tabs.push(market.marketName);
      }
    });

    return tabs;
  }, [popularMarkets]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  const scrollToActiveTab = useCallback(() => {
    if (!tabsListRef.current || !activeTab || !scrollContainerRef.current)
      return;

    const activeBtn = tabsListRef.current.querySelector(
      `button[data-tab="${activeTab}"]`,
    ) as HTMLElement;

    if (!activeBtn) return;

    const container = scrollContainerRef.current;
    const containerWidth = container.clientWidth;
    const scrollWidth = container.scrollWidth;

    let targetScroll =
      activeBtn.offsetLeft - containerWidth / 2 + activeBtn.offsetWidth / 2;
    targetScroll = Math.max(
      0,
      Math.min(targetScroll, scrollWidth - containerWidth),
    );

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  }, [activeTab]);

  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;

    // Thoda delay taake DOM render ho jaye
    const timer = setTimeout(() => {
      const activeBtn = tabsListRef.current?.querySelector(
        `button[data-tab="${activeTab}"]`,
      ) as HTMLElement;

      if (activeBtn) {
        setIndicatorStyle({
          left: activeBtn.offsetLeft,
          top: activeBtn.offsetTop + activeBtn.offsetHeight / 2, // Vertically center
          width: activeBtn.offsetWidth,
          height: 32,
          opacity: 1,
          animate: true,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  // ----- Effect to run after navItems or tab change -----
  useEffect(() => {
    scrollToActiveTab();
  }, [activeTab]);

  const updateSubIndicator = useCallback(() => {
    setTimeout(() => {
      if (!subTabsListRef.current || !subActiveTab) return;

      const activeBtn = subTabsListRef.current.querySelector(
        `button[data-subtab="${subActiveTab}"]`,
      ) as HTMLElement;

      if (activeBtn) {
        setSubIndicatorStyle({
          left: activeBtn.offsetLeft,
          top: activeBtn.offsetTop + activeBtn.offsetHeight / 2,
          width: activeBtn.offsetWidth,
          height: 32,
          opacity: 1,
        });
      }
    }, 50);
  }, [subActiveTab]);

  useEffect(() => {
    if (!isLoading) {
      updateIndicator();
      updateSubIndicator();
    }

    window.addEventListener("resize", () => {
      updateIndicator();
      updateSubIndicator();
    });

    return () =>
      window.removeEventListener("resize", () => {
        updateIndicator();
        updateSubIndicator();
      });
  }, [
    updateIndicator,
    updateSubIndicator,
    isLoading,
    allMarkets,
    popularMarkets,
  ]);

  // const updateIndicator = useCallback(() => {
  //   if (!tabsListRef.current || !activeTab) return;
  //   const activeBtn = tabsListRef.current.querySelector(
  //     `button[data-tab="${activeTab}"]`,
  //   ) as HTMLElement | null;
  //   if (activeBtn) {
  //     setIndicatorStyle({
  //       left: activeBtn.offsetLeft,
  //       width: activeBtn.offsetWidth,
  //       opacity: 1,
  //     });
  //   }
  // }, [activeTab]);

  useEffect(() => {
    const t = setTimeout(() => updateIndicator(), 80);
    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator, activeTab]);

  // ---------- UI helpers ----------
  // const getMarketTitle = (m: any) =>
  //   m?.marketName || m?.marketType || m?.oddsType || m?.name || "Market";
  const getMarketTitle = useCallback((m: any) => {
    return m?.marketName || m?.marketType || m?.oddsType || m?.name || "Market";
  }, []);
  const getBettingType = useCallback((m: any) => {
    return String(
      m?.description?.bettingType ?? m?.bettingType ?? "",
    ).toUpperCase();
  }, []);

  const isLineMarketFn = useCallback(
    (m: any) => {
      return getBettingType(m) === "LINE";
    },
    [getBettingType],
  );

  // ONLY for ALL/POPULAR accordion area (existing flow safe)
  const accordionMarkets = useMemo(() => {
    if (activeTab === "ALL") return allMarkets || [];
    if (activeTab === "POPULAR") return popularMarkets || [];
    return [];
  }, [activeTab, allMarkets, popularMarkets]);

  const oddsMarketsForAccordion = useMemo(() => {
    let baseMarkets = [...accordionMarkets];
    if (subActiveTab === "FANCY") {
      baseMarkets = baseMarkets.filter(
        (m) =>
          m.marketType === "FANCY" ||
          m.marketName?.toUpperCase().includes("FANCY"),
      );
    } else {
      baseMarkets = baseMarkets.filter(
        (m) =>
          m.marketType === "SPORTSBOOK" ||
          m.marketName?.toUpperCase().includes("SPORTSBOOK"),
      );
    }

    return [...accordionMarkets]
      .filter((m: any) => !isLineMarketFn(m))
      .sort(
        (a: any, b: any) => Number(a.sequence || 0) - Number(b.sequence || 0),
      );
  }, [accordionMarkets, isLineMarketFn]);

  const lineMarketsForAccordion = useMemo(() => {
    return [...accordionMarkets]
      .filter((m: any) => isLineMarketFn(m))
      .sort(
        (a: any, b: any) => Number(a.sequence || 0) - Number(b.sequence || 0),
      );
  }, [accordionMarkets, isLineMarketFn]);

  const getLimits = (m: any) => {
    const mn = Number(m?.min);
    const mx = Number(m?.max);
    const has = Number.isFinite(mn) && Number.isFinite(mx);
    return has ? { min: mn, max: mx } : null;
  };

  const getRunnersList = (m: any) => {
    if (Array.isArray(m?.runners) && m.runners.length) return m.runners;
    if (Array.isArray(m?.runnersName) && m.runnersName.length) {
      return m.runnersName.map((r: any) => ({
        selectionId: r.selectionId,
        status: m?.status,
        ex: { availableToBack: [], availableToLay: [] },
      }));
    }
    return [];
  };

  function filterCompetitions(eventTypeId: any) {
    const filtered =
      competitions?.filter(
        (item: any) => String(item.eventType.id) === String(eventTypeId),
      ) ?? [];

    setCompetition(filtered);

    // open competitions after selecting event type
    setIsEventTypeOpen(false);
    // setIsCompetitionOpen(false);

    return filtered;
  }

  useEffect(() => {
    const result = filterCompetitions(sportId);
  }, [competitions, sportId]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;

      const inEventType = eventTypeRef.current?.contains(t);
      const inCompetition = competitionRef.current?.contains(t);
      const inEventDrop = eventDropRef.current?.contains(t);

      if (!inEventType) setIsEventTypeOpen(false);
      if (!inCompetition) setIsCompetitionOpen(false);
      if (!inEventDrop) setIsEventsDropDown(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function setOpenRulesModal(rule: any) {
    // console.log("rule", rule);
    setOpenRules(true);
    setRuleContent(rule);
  }
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const renderMarketTable = (market: any) => {
    const runners = getRunnersList(market);
    const limits = getLimits(market);
    const data = market;
    const marketIsSusp = isSuspendedLike(market?.status);
    const isBetOnThisMarket =
      selectedBet?.eventName === (market.event?.name || eventName) &&
      selectedBet?.marketType === (market.marketType || market.marketName);

    // ✅ Sirf LINE market detection
    const isLineMarket = market?.description?.bettingType === "LINE";

    return (
      <>
        <div className="border w-full border-dashed border-(--dotted-line) rounded-[4px] overflow-hidden">
          {/* HEADER */}
          <div className="px-1 min-[900px]:px-2 bg-(--market-header-bg) flex flex-col justify-center w-full font-bold h-8 relative">
            <div className="absolute z-10 cursor-pointer right-2 top-1/2 -translate-y-1/2">
              <Tooltip
                open={activeTooltip === market.marketId}
                onOpenChange={(isOpen) => {
                  setActiveTooltip(isOpen ? market.marketId : null);

                  if (isOpen) {
                    // Auto-hide after 2.5 seconds (mobile-friendly)
                    setTimeout(() => {
                      setActiveTooltip(null);
                    }, 2500);
                  }
                }}
                disableHoverableContent
              >
                <TooltipTrigger asChild>
                  <div
                    onClick={() =>
                      setActiveTooltip((prev) =>
                        prev === market.marketId ? null : market.marketId,
                      )
                    }
                  >
                    <Icon name="info" className="text-(--accordion-text)" />
                  </div>
                </TooltipTrigger>

                <TooltipContent
                  side="top"
                  className="!bg-background text-[14px] font-normal px-4 py-[17px]"
                  sideOffset={12}
                  alignOffset={-10}
                  align="end"
                >
                  <div className="flex justify-center items-center gap-2">
                    <span>Min: {shortNumber(market?.min)}</span>
                    <span>Max: {shortNumber(market?.max)}</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative flex flex-row items-center h-8 justify-between w-full">
              <div className="text-[14px] text-(--accordion-text) font-[500] leading-[14px] flex-1 flex-[1_1_6rem] min-w-0 whitespace-nowrap truncate relative top-[1px]">
                {getMarketTitle(market)}
              </div>

              <div className="relative flex flex-col items-end max-w-[360px] w-full flex-[5_0_94px]">
                <div className="flex gap-1 w-full justify-end h-[20px] items-center relative ">
                  <div className="flex w-1/2 gap-1 justify-end">
                    <div className="flex-1 min-w-0 max-[464px]:hidden" />
                    <div className="flex-1 min-w-0 max-[346px]:hidden" />
                    <div
                      className={`flex items-center justify-center pb-[1px] font-semibold rounded-[2px] text-black select-none flex-1 min-w-0 text-[14px] leading-[18px] border h-6 ${
                        isLineMarket
                          ? "border-[#5baca7] bg-[#5baca7] text-black"
                          : "border-[var(--back-border)] bg-(--market-header-back-bg)"
                      }`}
                    >
                      {isLineMarket ? "No" : "Back"}
                    </div>
                  </div>

                  <div className="flex w-1/2 gap-1 justify-start">
                    <div
                      className={`flex items-center justify-center rounded-[2px] text-black select-none flex-1 min-w-0 text-[14px] font-semibold pb-[1px] leading-[18px] border h-6 ${
                        isLineMarket
                          ? "border-[#50d0ae] bg-[#50d0ae] text-black"
                          : "border-[var(--lay-border)] bg-(--market-header-lay-bg)"
                      }`}
                    >
                      {isLineMarket ? "Yes" : "Lay"}
                    </div>
                    <div className="flex-1 min-w-0 max-[346px]:hidden" />
                    <div className="flex-1 min-w-0 max-[464px]:hidden" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <ul className="relative list-none m-0 p-0 px-1 min-[900px]:px-2 bg-(--market-bg)">
            {runners.map((runner: any, index: number) => {
              const isBackSelected = (item: any) =>
                selectedBet?.selectionId === runner.selectionId &&
                selectedBet?.marketType ===
                  (market.marketType || market.marketName) &&
                ((selectedBet?.type === "back" &&
                  selectedBet?.odds === item.raw?.price) ||
                  (selectedBet?.type === "no" &&
                    selectedBet?.odds === item.raw?.price + 0.5));

              const isLaySelected = (item: any) =>
                selectedBet?.selectionId === runner.selectionId &&
                selectedBet?.marketType ===
                  (market.marketType || market.marketName) &&
                ((selectedBet?.type === "lay" &&
                  selectedBet?.odds === item.raw?.price) ||
                  (selectedBet?.type === "yes" &&
                    selectedBet?.odds === item.raw?.price + 0.5));
              const runnerName =
                market?.runnerNameMap?.[Number(runner.selectionId)] ||
                String(runner.selectionId);

              const runnerSusp =
                marketIsSusp || isSuspendedLike(runner?.status);

              const backs = Array.isArray(runner?.ex?.availableToBack)
                ? runner.ex.availableToBack
                : [];
              const lays = Array.isArray(runner?.ex?.availableToLay)
                ? runner.ex.availableToLay
                : [];

              const back3 = [backs[0], backs[1], backs[2]].map((x) => ({
                odd: cleanPrice(x?.price),
                vol: shortNumber(x?.size),
                raw: x,
              }));
              const lay3 = [lays[0], lays[1], lays[2]].map((x) => ({
                odd: cleanPrice(x?.price),
                vol: shortNumber(x?.size),
                raw: x,
              }));

              return (
                <React.Fragment
                  key={`${market.marketId}-${runner.selectionId}-${index}`}
                >
                  <li
                    key={`${market.marketId}-${runner.selectionId}-${index}`}
                    className="flex flex-col justify-start items-center relative w-full box-border text-left no-underline border-b border-dashed border-(--dotted-line) bg-clip-padding transition-colors"
                  >
                    <div className="flex w-full flex-row flex-1 min-h-[50px] items-center justify-between py-1">
                      {/* Runner Name */}
                      <div className="font-[500] text-[14px] leading-[1] flex-[1_1_6rem] min-w-[120px] pr-2 overflow-hidden">
                        <span
                          className={`block break-words ${runnerSusp ? "" : "cursor-pointer"}`}
                        >
                          {runnerName}
                        </span>
                        {(() => {
                          // 1) Current backend PL (null = no bets placed yet)
                          const actualPL = getRunnerPL(
                            market.marketId,
                            runner.selectionId,
                          );

                          // 2) Betslip is open on this market + valid stake entered
                          const isBetOnThisMarket =
                            selectedBet &&
                            selectedBet.marketId === market.marketId &&
                            slipPreview.stake > 0 &&
                            slipPreview.price > 1;

                          // 3) Calculate preview delta for this runner
                          let previewPL: number | null = null;

                          if (isBetOnThisMarket) {
                            const side = getSide(selectedBet!.type); // "BACK" or "LAY"
                            const isSelectedRunner =
                              selectedBet!.selectionId === runner.selectionId;

                            if (side === "BACK") {
                              previewPL = isSelectedRunner
                                ? slipPreview.stake * (slipPreview.price - 1) // profit if win
                                : -slipPreview.stake; // loss on other runners
                            } else {
                              // LAY
                              previewPL = isSelectedRunner
                                ? slipPreview.stake // profit if lay wins
                                : -(
                                    slipPreview.stake *
                                    (slipPreview.price - 1)
                                  ); // liability on other runners
                            }
                          }

                          // 4) Decide what to show
                          const hasActual = actualPL !== null && actualPL !== 0;
                          const hasPreview = previewPL !== null;

                          // Nothing to show
                          if (!hasActual && !hasPreview) return null;

                          const currentVal = actualPL ?? 0; // show 0 if no backend PL
                          const projectedVal = hasPreview
                            ? currentVal + previewPL!
                            : null;

                          const renderValue = (val: number) => (
                            <span
                              className={
                                val >= 0 ? "text-green-600" : "text-red-500"
                              }
                            >
                              {val >= 0 ? "" : "-"}
                              {shortNumber(Math.abs(val))}
                            </span>
                          );

                          return (
                            <div className="flex flex-wrap items-center gap-1 text-[12px] font-semibold leading-tight mt-0.5">
                              {/* Arrow + Current PL */}
                              <div className="flex items-center gap-1 shrink-0">
                                <i className="fa fa-arrow-right text-[10px] text-gray-400" />
                                {renderValue(currentVal)}
                              </div>

                              {/* Projected PL */}
                              {projectedVal !== null && (
                                <div className="flex items-center gap-1 min-w-0">
                                  <span className="text-gray-400 font-bold text-[11px]">
                                    {">>"}
                                  </span>
                                  {renderValue(projectedVal)}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Odds Boxes */}
                      <div className="relative flex gap-1 max-w-[360px] w-full flex-[5_0_94px]">
                        {/* BACK side */}
                        <div
                          className={`flex flex-row-reverse w-1/2 gap-1 overflow-hidden ${runnerSusp ? "bg-black" : ""}`}
                        >
                          {runnerSusp
                            ? [0, 1, 2].map((_, i) => (
                                <div
                                  key={`back-susp-${i}`}
                                  className={`flex flex-col h-full rounded-[2px] flex-1 min-w-0 bg-[#041117] ${
                                    i === 2 ? "max-[464px]:hidden" : ""
                                  } ${i === 1 ? "max-[346px]:hidden" : ""}`}
                                />
                              ))
                            : back3.map((item, i) => {
                                // ✅ Sirf LINE market ke liye colors change
                                if (isLineMarket) {
                                  return (
                                    <div
                                      key={`back-${i}`}
                                      data-app-rate-highlighter
                                      className={`back-${i + 1} 
flex flex-col items-center justify-center 
w-[75%] @min-[700]:w-[57.5px] 
h-[45px] rounded-[8px] border 
flex-1 min-w-0 cursor-pointer 
text-black transition-colors

${
  theme === "light"
    ? i === 0
      ? "border-[#5baca7] bg-[#5baca7]"
      : i === 1
        ? "border-[#5baca7] bg-[#5baca7]"
        : "border-[#5baca7] bg-[#5baca7]"
    : "border-[#5baca7] bg-[rgba(15,69,66,0.6)] hover:bg-[rgba(15,69,66,0.8)]"
}

${isBackSelected(item) ? "!bg-(--line-no-selected-bg) hover:bg-[var(--line-no-selected-bg)] !border-(--line-no-selected-border)" : ""}


${i === 2 ? "max-[464px]:hidden" : ""}
${i === 1 ? "max-[346px]:hidden" : ""}
`}
                                      onClick={() => {
                                        if (
                                          !item.raw?.price ||
                                          item.raw?.price === 0
                                        )
                                          return;
                                        const isLineMarket =
                                          market?.description?.bettingType ===
                                          "LINE";
                                        const betType = isLineMarket
                                          ? "no"
                                          : "back";

                                        setSelectedBet({
                                          type: betType,
                                          odds: item.raw?.price + 0.5,
                                          teamName: runnerName,
                                          eventName:
                                            market.event?.name || eventName,
                                          marketType:
                                            market.marketType ||
                                            market.marketName,
                                          selectionId: runner.selectionId,
                                          isLineMarket: isLineMarket,
                                          marketId: market.marketId,
                                          eventId: market.event?.id || eventId,
                                          sportId: market.sportId || sportId,
                                        });
                                      }}
                                    >
                                      <span
                                        className={`price sm:text-[13px] font-bold leading-[1.1] truncate ${isBackSelected(item) ? "text-white" : theme === "dark" ? "text-[#5baca7]" : "text-black"}`}
                                      >
                                        {cleanPrice(item?.raw?.price + 0.5)}
                                      </span>

                                      <span
                                        className={`size sm:text-[10px] font-normal leading-[1] truncate truncate ${isBackSelected(item) ? "text-white" : theme === "dark" ? "text-[#5baca7]" : "text-black"}`}
                                      >
                                        {item.vol}
                                      </span>
                                    </div>
                                  );
                                }

                                // ✅ Normal market (original code - bilkul same)
                                return (
                                  <div
                                    key={`back-${i}`}
                                    data-app-rate-highlighter
                                    className={`back-${i + 1} flex flex-col items-center justify-center w-[75%] @min-[700]:w-[57.5px] h-[45px] rounded-[8px] border border-[var(--back-border)] bg-[var(--back-bg)]
hover:bg-[var(--back-hover)] flex-1 min-w-0 cursor-pointer text-black transition-colors ${
                                      i === 0
                                        ? isBackSelected(item)
                                          ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)]"
                                          : "bg-[#0591cf] hover:bg-(--secondary-color)"
                                        : isBackSelected(item)
                                          ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)]"
                                          : "bg-[#0a77a8] hover:bg-(--secondary-color)"
                                    } ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                                    onClick={() => {
                                      if (
                                        !item.raw?.price ||
                                        item?.raw?.price === 0
                                      )
                                        return;
                                      setSelectedBet({
                                        type: "back",
                                        odds: item.raw?.price,
                                        teamName: runnerName,
                                        eventName:
                                          market.event?.name || eventName,
                                        marketType:
                                          market.marketType ||
                                          market.marketName,
                                        selectionId: runner.selectionId,
                                        marketId: market.marketId,
                                        eventId: market.event?.id || eventId,
                                        sportId: market.sportId || sportId,
                                      });
                                    }}
                                  >
                                    <span
                                      className={`price sm:text-[13px] font-bold leading-[1.1] truncate text-[var(--back-price-text)] ${isBackSelected(item) ? "dark:text-white" : ""}`}
                                    >
                                      {item.odd}
                                    </span>
                                    <span
                                      className={`size sm:text-[10px] font-normal leading-[1] truncate text-[var(--back-size-text)] ${isBackSelected(item) ? "dark:text-white" : ""}`}
                                    >
                                      {item.vol}
                                    </span>
                                  </div>
                                );
                              })}
                        </div>

                        {/* LAY side */}
                        <div
                          className={`flex w-1/2 gap-1 overflow-hidden ${runnerSusp ? "bg-black" : ""}`}
                        >
                          {runnerSusp
                            ? [0, 1, 2].map((_, i) => (
                                <div
                                  key={`lay-susp-${i}`}
                                  className={`flex flex-col h-full rounded-[2px] flex-1 min-w-0 bg-[#140d0f] ${
                                    i === 2 ? "max-[464px]:hidden" : ""
                                  } ${i === 1 ? "max-[346px]:hidden" : ""}`}
                                />
                              ))
                            : lay3.map((item, i) => {
                                // ✅ Sirf LINE market ke liye colors change
                                if (isLineMarket) {
                                  return (
                                    <div
                                      key={`lay-${i}`}
                                      data-app-rate-highlighter
                                      className={`lay-${i + 1} 
flex flex-col items-center justify-center 
w-[75%] @min-[700]:w-[57.5px] 
h-[45px] rounded-[8px] border 
flex-1 min-w-0 cursor-pointer 
text-black transition-colors

${
  theme === "light"
    ? i === 0
      ? "border-[#50d0ae] bg-[#50d0ae]"
      : i === 1
        ? "border-[#50d0ae] bg-[#50d0ae]"
        : "border-[#50d0ae] bg-[#50d0ae]"
    : "border-[#50d0ae] bg-[rgba(13,59,46,0.6)] hover:bg-[rgba(13,59,46,0.8)]"
}

${isLaySelected(item) ? "!bg-(--line-yes-selected-bg) hover:bg-[var(--line-yes-selected-bg)] !border-(--line-yes-selected-border)" : ""}

${i === 2 ? "max-[464px]:hidden" : ""}
${i === 1 ? "max-[346px]:hidden" : ""}
`}
                                      onClick={() => {
                                        if (
                                          !item.raw?.price ||
                                          item.raw?.price === 0
                                        )
                                          return;
                                        const isLineMarket =
                                          market?.description?.bettingType ===
                                          "LINE";
                                        const betType = isLineMarket
                                          ? "yes"
                                          : "lay";

                                        setSelectedBet({
                                          type: betType,
                                          odds: item.raw?.price + 0.5,
                                          teamName: runnerName,
                                          eventName:
                                            market.event?.name || eventName,
                                          marketType:
                                            market.marketType ||
                                            market.marketName,
                                          selectionId: runner.selectionId,
                                          isLineMarket: isLineMarket,
                                          marketId: market.marketId,
                                          eventId: market.event?.id || eventId,
                                          sportId: market.sportId || sportId,
                                        });
                                      }}
                                    >
                                      <span
                                        className={`price text-[11px] sm:text-[13px] font-bold leading-[1.1] truncate ${isLaySelected(item) ? "text-white" : theme === "dark" ? "text-[#50d0ae]" : "text-black"}`}
                                      >
                                        {cleanPrice(item?.raw?.price + 0.5)}
                                      </span>
                                      <span
                                        className={`size text-[9px] sm:text-[10px] font-normal leading-[1] truncate truncate ${isLaySelected(item) ? "text-white" : theme === "dark" ? "text-[#50d0ae]" : "text-black"}`}
                                      >
                                        {item.vol}
                                      </span>
                                    </div>
                                  );
                                }

                                // ✅ Normal market (original code - bilkul same)
                                return (
                                  <div
                                    key={`lay-${i}`}
                                    data-app-rate-highlighter
                                    className={`lay-${i + 1} flex flex-col items-center justify-center w-[75%] @min-[700]:w-[57.5px] h-[45px] rounded-[8px] border border-[var(--lay-border)]
bg-[var(--lay-bg)] hover:bg-[var(--lay-hover)] flex-1 min-w-0 cursor-pointer text-black transition-colors ${
                                      i === 0
                                        ? isLaySelected(item)
                                          ? "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)]"
                                          : "bg-[#d1686d] hover:bg-[#FFA4A7]"
                                        : isLaySelected(item)
                                          ? "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)]"
                                          : "bg-[#a3555b] hover:bg-[#FFA4A7]"
                                    } ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                                    onClick={() => {
                                      if (
                                        !item.raw?.price ||
                                        item.raw.price === 0
                                      )
                                        return;
                                      setSelectedBet({
                                        type: "lay",
                                        odds: item.raw?.price,
                                        teamName: runnerName,
                                        eventName:
                                          market.event?.name || eventName,
                                        marketType:
                                          market.marketType ||
                                          market.marketName,
                                        selectionId: runner.selectionId,
                                        marketId: market.marketId,
                                        eventId: market.event?.id || eventId,
                                        sportId: market.sportId || sportId,
                                      });
                                    }}
                                  >
                                    <span
                                      className={`price text-[11px] sm:text-[13px] font-bold leading-[1.1] truncate text-[var(--lay-price-text)] ${isLaySelected(item) ? "dark:text-white" : ""}`}
                                    >
                                      {item.odd}
                                    </span>
                                    <span
                                      className={`size text-[9px] sm:text-[10px] font-normal leading-[1] truncate text-[var(--lay-size-text)] ${isLaySelected(item) ? "dark:text-white" : ""}`}
                                    >
                                      {item.vol}
                                    </span>
                                  </div>
                                );
                              })}
                        </div>

                        {/* OVERLAY */}
                        {runnerSusp && (
                          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                            <p className="m-0 text-[#FF8C4B] text-[16px] font-[500] leading-[1.5] tracking-wide">
                              SUSPENDED
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                  <div
                    id={`betslip-${runner.selectionId}-${market.marketType || market.marketName}`}
                  >
                    {selectedBet?.selectionId === runner.selectionId &&
                      selectedBet?.marketType ===
                        (market.marketType || market.marketName) &&
                      (selectedBet.type === "back" ||
                        selectedBet.type === "lay" ||
                        selectedBet.type === "yes" ||
                        selectedBet.type === "no") && (
                        <div className="block lg:hidden">
                          <MBetSlip />
                        </div>
                      )}
                  </div>
                </React.Fragment>
              );
            })}

            {!runners.length && (
              <li className="py-4 text-center text-[#919EAB] text-sm">
                No runners found
              </li>
            )}
          </ul>
        </div>
      </>
    );
  };

  function navigateToMarket(path: any) {
    router.push(`/sport/${path}`);
  }

  function navigateToMarketComp(sportName: any, id: string) {
    router.push(`/sport/${sportName}/${id}`);
  }

  const toggleStreaming = () => {
    setLiveStreaming((prev) => {
      if (!prev) {
        setStreamCounter((c) => c + 1);
      }
      return !prev;
    });
  };

  return (
    <div id="market-details.tsx">
      <div className="w-full mx-auto box-border flex flex-auto flex-col pt-2 pb-2">
        {/* Breadcrumbs */}
        <div className="mb-2 min-[900px]:mb-[16px]">
          <div className="flex flex-wrap items-center gap-1.5 min-[900px]:gap-2.5 max-w-full ">
            <div className="grow">
              <div className=" flex flex-wrap gap-2 min-[900px]:gap-4">
                {/* <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] px-1.5 gap-2.5">
                <a href="" className="inline-flex">
                  Home
                </a>
              </span> */}
                <span
                  ref={eventTypeRef}
                  className="h-6 min-w-6 inline-flex justify-center items-center overflow-visible text-sm bg-(--sidebar-badge-bg) rounded-[6px] pl-[8px] pr-2 gap-2.5 relative"
                >
                  {/* ICON CLICK TOGGLE */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEventTypeOpen((v) => !v);
                      setIsCompetitionOpen(false);
                      setIsEventsDropDown(false);
                    }}
                    className="inline-flex cursor-pointer "
                  >
                    <Icon
                      name="play"
                      className="w-5 h-5 text-(--arrow-color)!"
                    />
                    {sportNames[sportId]}
                  </button>

                  {/* ORIGINAL TEXT */}

                  {/* ORIGINAL DROPDOWN DESIGN */}
                  {isEventTypeOpen && (
                    <ul className="absolute left-2 p-1 top-full mt-0 -ml-1 max-h-[200px] glass rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)] backdrop-blur-[2px]! text-(--palette-text-primary) z-40 overflow-y-auto no-scrollbar">
                      {eventTypes?.map((item: any) => (
                        <li key={item?.id}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSelectedEventType(item?.name);
                              filterCompetitions(item?.id);
                              setIsEventTypeOpen(false);
                              navigateToMarket(item?.name);
                            }}
                            className={`text-sm w-full text-nowrap text-left relative bg-transparent cursor-pointer gap-2 font-semibold transition px-2 py-1.5 rounded-[6px] ${
                              (selectedEventType &&
                                selectedEventType === item?.name) ||
                              (!selectedEventType &&
                                sportName === item?.name)
                                ? "bg-[rgba(255,255,255,0.25)]! text-(--primary-color)"
                                : "hover:bg-[rgba(255,255,255,0.25)]"
                            }`}
                          >
                            {item?.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </span>

                <span
                  ref={competitionRef}
                  className="h-6 min-w-6 inline-flex justify-center relative items-center text-sm bg-(--sidebar-badge-bg) rounded-[6px] pl-[8px] pr-2 gap-2.5"
                >
                  {/* ✅ ICON CLICK TOGGLE (same look) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsCompetitionOpen((v) => !v);
                      setIsEventTypeOpen(false);
                      setIsEventsDropDown(false);
                    }}
                    className="inline-flex cursor-pointer"
                  >
                    <Icon
                      name="play"
                      className="w-5 h-5 text-(--arrow-color)!"
                    />
                    {selectedCompetition || tournamentName || "Tournament"}
                  </button>

                  {/* ✅ ORIGINAL DROPDOWN DESIGN */}
                  {isCompetitionOpen && (
                    <ul className="absolute p-1 left-2 top-full glass mt-0 -ml-1 max-h-[200px] rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)] text-(--palette-text-primary) backdrop-blur-[2px]! z-40 overflow-y-auto no-scrollbar">
                      {Array.isArray(competition) && competition.length > 0 ? (
                        competition.map((item: any) => (
                          <li key={item.competition.id}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedCompetition(item.competition.name);
                                setIsCompetitionOpen(false);
                                navigateToMarketComp(
                                  item.eventType.name,
                                  item.competition.id,
                                );
                              }}
                              className={`text-sm w-full text-nowrap text-left relative bg-transparent cursor-pointer gap-2 font-semibold transition px-2 py-1.5 rounded-[6px] ${
                                (selectedCompetition &&
                                  selectedCompetition ===
                                    item.competition.name) ||
                                (!selectedCompetition &&
                                  tournamentName === item.competition.name)
                                  ? "bg-[rgba(255,255,255,0.25)]! text-(--primary-color)"
                                  : "hover:bg-[rgba(255,255,255,0.25)]"
                              }`}
                            >
                              {item.competition.name}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-xs opacity-70">
                          No competitions
                        </li>
                      )}
                    </ul>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Title Block */}
        <div className="bg-(--primary-hover) w-full border-[1px] border-dashed border-(--dotted-line) rounded-[16px] max-[637px]:mt-[6px]">
          <div className="relative no-underline w-full box-border text-left py-2 px-4 flex-wrap rounded-2">
            <div className="flex gap-2 justify-between items-center w-full">
              <div className="flex-auto min-w-0 m-0">
                <span
                  ref={eventDropRef}
                  className="py-0.5 relative min-w-6 inline-flex justify-center items-center text-sm bg-(--sidebar-badge-bg) rounded-[6px] pl-[8px] pr-2 gap-2.5"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsEventsDropDown((v) => !v);
                      setIsCompetitionOpen(false);
                      setIsEventTypeOpen(false);
                    }}
                    className="inline-flex cursor-pointer "
                  >
                    <Icon
                      name="play"
                      className="w-5 h-5 min-w-5 min-h-5 text-(--arrow-color)!"
                    />
                    {eventName || "Event"}
                  </button>

                  {!isLoading && isEventsDropDown && (
                    <ul className="absolute p-1 left-2 top-full glass mt-0 -ml-1 max-h-[200px] rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)] text-(--palette-text-primary) backdrop-blur-[2px]! z-40 overflow-y-auto no-scrollbar">
                      {Array.isArray(thirdItems) && thirdItems?.length > 0 ? (
                        thirdItems?.map((item: any) => (
                          <li key={item?.id}>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(item?.href);
                                setIsEventsDropDown(false);
                              }}
                              className={`text-sm w-full text-nowrap text-left relative bg-transparent cursor-pointer gap-2 font-semibold transition px-2 py-1.5 rounded-[6px] ${
                                eventName === item?.name
                                  ? "bg-[rgba(255,255,255,0.25)]! text-(--primary-color)"
                                  : "hover:bg-[rgba(255,255,255,0.25)]"
                              }`}
                            >
                              {item?.name}
                            </button>
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-xs opacity-70">
                          No competitions
                        </li>
                      )}
                    </ul>
                  )}
                </span>
                <span className="text-[0.875rem]">
                  <div className="flex gap-2 items-center text-(--tab-default-text)">
                    <EventTimer startTime={marketTime} />
                  </div>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon
                  name="scoreIcon"
                  className="w-5 h-5 mt-1 cursor-pointer text-(--primary-text-color)"
                  onClick={() => setIsScorePanelOpen((prev) => !prev)}
                />
                <Icon
                  name="watch"
                  className="w-5 h-5 cursor-pointer text-(--primary-text-color)"
                  onClick={toggleStreaming}
                />
              </div>
            </div>
            <AnimatePresence initial={false}>
              {liveStreaming && (
                <motion.div
                  key="live-stream-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden w-full"
                >
                  <VideoSimple
                    key={`stream-${eventId}-${streamCounter}`}
                    eventId={eventId}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {isScorePanelOpen && (
                <motion.div
                  key="score-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 30, opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden w-full"
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {isLoading ? (
          <MarketLoader />
        ) : (
          <>
            {/* Tabs */}
            <div className="mt-1 min-[900px]:mt-2 flex dark:bg-[#28323D] rounded-[8px] min-h-[48px] overflow-hidden w-full max-w-full">
              <div
                ref={scrollContainerRef}
                className="relative flex items-center flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                <div
                  ref={tabsListRef}
                  className="flex p-2 !pb-[6px] relative z-[1] *:text-nowrap w-full items-center relative"
                >
                  <div
                    className="absolute bg-(--tab-active-bg) rounded-[8px]  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 h-[32px]"
                    style={{
                      left: `${indicatorStyle.left}px`,
                      top: "24px",
                      transform: "translateY(-50%)",
                      width: `${indicatorStyle.width}px`,
                      opacity: indicatorStyle.opacity,
                    }}
                  />

                  {/* POPULAR Tab */}
                  <button
                    data-tab="POPULAR"
                    onClick={(e) => {
                      setMarketType("POPULAR", e, "Popular", 1, "");
                    }}
                    className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                      activeTab === "POPULAR"
                        ? "text-(--tab-active-text) font-semibold"
                        : "text-(--tab-default-text) font-medium"
                    }`}
                  >
                    POPULAR
                  </button>

                  {/* Individual Popular Market Tabs */}
                  {popularMarkets.map((market, i) => (
                    <button
                      key={`popular-tab-${i}`}
                      data-tab={market?.marketName}
                      onClick={(e) => {
                        setMarketType(
                          market?.marketName,
                          e,
                          "betfair",
                          i,
                          market?.marketId,
                        );
                      }}
                      className={`inline-flex uppercase items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                        activeTab === market?.marketName
                          ? "text-(--tab-active-text) font-semibold"
                          : "text-(--tab-default-text) font-medium"
                      }`}
                    >
                      {market?.marketName}
                    </button>
                  ))}

                  {/* ALL Tab */}
                  <button
                    data-tab="ALL"
                    onClick={(e) => {
                      setMarketType("ALL", e, "All", 0, "");
                    }}
                    className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                      activeTab === "ALL"
                        ? "text-(--tab-active-text) font-semibold"
                        : "text-(--tab-default-text) font-medium"
                    }`}
                  >
                    ALL Markets
                  </button>
                </div>
              </div>
            </div>

            {(activeTab === "ALL" || activeTab === "POPULAR") && (
              <div
                onClick={() => setIsMarketSectionOpen((prev) => !prev)}
                className="px-1 mt-2 min-[900px]:px-2 rounded-md bg-(--accordion-bg) flex flex-col justify-center w-full font-bold h-8 relative cursor-pointer"
              >
                <div className="relative flex flex-row items-center h-8 justify-between w-full">
                  <div className="text-[14px] text-(--accordion-text) font-[500] leading-[14px] flex-1 flex-[1_1_6rem] min-w-0 whitespace-nowrap truncate relative top-[1px]">
                    {"Odds"}
                  </div>
                  <span
                    className={`transition-transform duration-300 ${isMarketSectionOpen ? "rotate-90" : "rotate-0"}`}
                  >
                    <Icon
                      name="downArrow"
                      width={20}
                      height={20}
                      className="text-(--accordion-text)"
                    />
                  </span>
                </div>
              </div>
            )}

            {/* Display markets based on active tab */}
            {/* {activeTab === "ALL" || activeTab === "POPULAR" ? (
            <AnimatePresence initial={false}>
              {isMarketSectionOpen && (
                <motion.div
                  key="market-section"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-1">
                    {activeTab === "ALL" &&
                      allMarkets.length > 0 &&
                      allMarkets
                        .sort(
                          (a: any, b: any) =>
                            Number(a.sequence || 0) - Number(b.sequence || 0),
                        )
                        .map((m: any) => (
                          <React.Fragment
                            key={String(m.exMarketId ?? m.marketId)}
                          >
                            {renderMarketTable(m)}
                          </React.Fragment>
                        ))}

                    {activeTab === "POPULAR" &&
                      popularMarkets.length > 0 &&
                      popularMarkets
                        .sort(
                          (a: any, b: any) =>
                            Number(a.sequence || 0) - Number(b.sequence || 0),
                        )
                        .map((m: any) => (
                          <React.Fragment
                            key={String(m.exMarketId ?? m.marketId)}
                          >
                            {renderMarketTable(m)}
                          </React.Fragment>
                        ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-1">
              {filteredMarkets.length > 0 &&
                filteredMarkets
                  .sort(
                    (a: any, b: any) =>
                      Number(a.sequence || 0) - Number(b.sequence || 0),
                  )
                  .map((m: any) => (
                    <React.Fragment key={String(m.exMarketId ?? m.marketId)}>
                      {renderMarketTable(m)}
                    </React.Fragment>
                  ))}
            </div>
          )} */}
            {activeTab === "ALL" || activeTab === "POPULAR" ? (
              <>
                {/* ODDS (Non-LINE) - your current code stays */}
                <AnimatePresence initial={false}>
                  {isMarketSectionOpen && (
                    <motion.div
                      key="market-section"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-1">
                        {oddsMarketsForAccordion.map((m: any) => (
                          <React.Fragment
                            key={String(m.exMarketId ?? m.marketId)}
                          >
                            {renderMarketTable(m)}
                          </React.Fragment>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* LINE MARKETS - NEW (dynamic market name collapses) */}
                {/* LINE MARKETS - SINGLE COLLAPSE */}
                {lineMarketsForAccordion.length > 0 && (
                  <>
                    {/* Header */}
                    <div
                      onClick={() => setIsLineSectionOpen((prev) => !prev)}
                      className="px-1 mt-2 min-[900px]:px-2 rounded-md bg-(--accordion-bg) flex flex-col justify-center w-full font-bold h-8 relative cursor-pointer"
                    >
                      <div className="relative flex flex-row items-center h-8 justify-between w-full">
                        <div className="text-[14px] text-(--accordion-text) font-[500] leading-[14px] flex-1 flex-[1_1_6rem] min-w-0 whitespace-nowrap truncate relative top-[1px]">
                          Line
                        </div>
                        <span
                          className={`transition-transform duration-300 ${
                            isLineSectionOpen ? "rotate-90" : "rotate-0"
                          }`}
                        >
                          <Icon
                            name="downArrow"
                            width={20}
                            height={20}
                            className="text-(--accordion-text)"
                          />
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <AnimatePresence initial={false}>
                      {isLineSectionOpen && (
                        <motion.div
                          key="line-section"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-1">
                            {lineMarketsForAccordion.map((m: any) => (
                              <React.Fragment
                                key={String(m.exMarketId ?? m.marketId)}
                              >
                                {renderMarketTable(m)}
                              </React.Fragment>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </>
            ) : (
              // filtered tab branch - DON'T TOUCH
              <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-1">
                {filteredMarkets.length > 0 &&
                  filteredMarkets
                    .sort(
                      (a: any, b: any) =>
                        Number(a.sequence || 0) - Number(b.sequence || 0),
                    )
                    .map((m: any) => (
                      <React.Fragment key={String(m.exMarketId ?? m.marketId)}>
                        {renderMarketTable(m)}
                      </React.Fragment>
                    ))}
              </div>
            )}

            {/* If empty */}
            {!allMarkets.length && (
              <div className="mt-3 text-center text-[#919EAB] text-sm">
                No markets available
              </div>
            )}

            <div className="mt-1 min-[900px]:mt-2 flex dark:bg-[#28323D] rounded-[8px] min-h-[48px] overflow-hidden w-full max-w-full">
              <div className="relative flex items-center flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div
                  ref={subTabsListRef}
                  className="flex p-2 !pb-[6px] relative z-[1] *:text-nowrap w-full items-center"
                >
                  {/* Dynamic Sliding Indicator */}
                  <div
                    className="absolute bg-(--tab-active-bg) rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0"
                    style={{
                      left: `${subIndicatorStyle.left}px`,
                      top: `${subIndicatorStyle.top}px`,
                      transform: "translateY(-50%)",
                      width: `${subIndicatorStyle.width}px`,
                      height: `${subIndicatorStyle.height}px`,
                      opacity: subIndicatorStyle.opacity,
                    }}
                  />

                  {/* Fancy Tab */}
                  <button
                    data-subtab="FANCY"
                    onClick={() => setSubActiveTab("FANCY")}
                    className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                      subActiveTab === "FANCY"
                        ? "text-(--tab-active-text) font-semibold"
                        : "text-(--tab-default-text) font-medium"
                    }`}
                  >
                    Fancy
                  </button>

                  {/* SportsBook Tab */}
                  <button
                    data-subtab="SPORTSBOOK"
                    onClick={() => setSubActiveTab("SPORTSBOOK")}
                    className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                      subActiveTab === "SPORTSBOOK"
                        ? "text-(--tab-active-text) font-semibold"
                        : "text-(--tab-default-text) font-medium"
                    }`}
                  >
                    SportsBook
                  </button>
                </div>
              </div>
            </div>

            {(subActiveTab === "FANCY" || subActiveTab === "SPORTSBOOK") && (
              <>
                {/* Fancy Section */}
                {subActiveTab === "FANCY" && (
                  <div className="mt-1">
                    <RenderFancyTable
                      data={dummyFancyData}
                      eventName={eventName}
                      eventId={eventId}
                      sportId={sportId}
                    />
                  </div>
                )}

                {/* SportsBook Section */}
                {subActiveTab === "SPORTSBOOK" && (
                  <div className="mt-1">
                    <RenderSportsBookTable
                      data={dummySportsBookData}
                      eventName={eventName}
                      eventId={eventId}
                      sportId={sportId}
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const dummyFancyData = [
  {
    name: "AUS W Only 40th Over Runs",
    layPrice: 9,
    laySize: 115,
    backPrice: 9,
    backSize: 85,
    min: 100,
    max: 25000,
    selectionId: 101,
    marketId: "fancy1",
  },
  {
    name: "AUS W 40 Over Runs",
    layPrice: 305,
    laySize: 100,
    backPrice: 306,
    backSize: 100,
    min: 100,
    max: 200000,
    selectionId: 102,
    marketId: "fancy2",
  },
  {
    name: "AUS W 50 Over Runs ADV",
    layPrice: 404,
    laySize: 100,
    backPrice: 406,
    backSize: 100,
    min: 100,
    max: 100000,
    selectionId: 103,
    marketId: "fancy3",
  },
  {
    name: "1st Innings 40 Over Line",
    layPrice: 305,
    laySize: 100,
    backPrice: 306,
    backSize: 100,
    min: 100,
    max: 50000,
    selectionId: 104,
    marketId: "fancy4",
  },
];

const dummySportsBookData = [
  { name: "0", price: 9.6, size: "100K", selectionId: 501, marketId: "sb1" },
  { name: "1", price: 9.6, size: "99.8K", selectionId: 502, marketId: "sb2" },
  { name: "2", price: 9.6, size: "99.1K", selectionId: 503, marketId: "sb3" },
  { name: "3", price: 9.6, size: "99.6K", selectionId: 504, marketId: "sb4" },
  { name: "4", price: 9.6, size: "98.7K", selectionId: 505, marketId: "sb5" },
];

const RenderFancyTable = ({ data, eventName, eventId, sportId }: any) => {
  const { setSelectedBet, selectedBet } = useAppStore();
  const [isOpen, setIsOpen] = React.useState(true);

  const onFancyBetClick = (item: any, type: "yes" | "no") => {
    const price = type === "no" ? item.layPrice : item.backPrice;
    if (
      selectedBet?.selectionId === item.selectionId &&
      selectedBet?.type === type
    ) {
      setSelectedBet(null);
      return;
    }
    setSelectedBet({
      type,
      odds: price + 0.5,
      teamName: item.name,
      eventName,
      marketType: "FANCY",
      selectionId: item.selectionId,
      marketId: item.marketId,
      eventId,
      sportId,
      isLineMarket: true,
    });
  };

  return (
    <div className="w-full">
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-1 min-[900px]:px-2 rounded-t-md bg-(--accordion-bg) flex flex-col justify-center w-full font-bold h-8 relative cursor-pointer"
      >
        <div className="flex flex-row items-center h-8 justify-between w-full">
          <div className="text-[14px] text-(--accordion-text) font-[500] leading-[14px]">
            Fancy
          </div>
          <span
            className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
          >
            <Icon
              name="downArrow"
              width={20}
              className="text-(--accordion-text)"
            />
          </span>
        </div>
      </div>

      {/* Table Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border border-dashed border-(--dotted-line) rounded-b-[4px]"
          >
            <table className="w-full border-collapse text-left bg-(--market-bg)">
              <thead>
                <tr className="h-8 border-b border-(--dotted-line)">
                  {/* 1. Name & Icon Header Combined */}
                  <th className="px-3 text-[12px] font-bold text-(--accordion-text) w-auto"></th>

                  {/* 2. NO/YES Labels Container (Right Aligned) */}
                  <th colSpan={2} className="p-0">
                    <div className="flex flex-row items-center justify-end pr-[4px] gap-1">
                      <div className="w-[62.38px] md:w-[57.5px] flex items-center justify-center font-semibold rounded-[2px] text-black text-[14px] border h-6 border-[var(--lay-border)] bg-(--market-header-lay-bg)">
                        No
                      </div>
                      <div className="w-[62.38px] md:w-[57.5px] flex items-center justify-center font-semibold rounded-[2px] text-black text-[14px] border h-6 border-[var(--back-border)] bg-(--market-header-back-bg)">
                        Yes
                      </div>
                    </div>
                  </th>

                  {/* 3. Min/Max Header */}
                  <th className="px-3 text-center text-[12px] font-bold text-(--accordion-text) hidden sm:table-cell w-[100px]">
                    Min/Max
                  </th>
                </tr>
              </thead>

              <tbody className="px-1 min-[900px]:px-2">
                {data.map((item: any) => {
                  const isNoSelected =
                    selectedBet?.selectionId === item.selectionId &&
                    selectedBet?.type === "no";
                  const isYesSelected =
                    selectedBet?.type === "yes" &&
                    selectedBet?.selectionId === item.selectionId;

                  return (
                    <React.Fragment key={item.selectionId}>
<tr className="border-b border-dashed border-(--dotted-line) h-[53px]">
                        {/* 1. Combined Name & Icon Column - FIXED ALIGNMENT */}
                        <td className="pl-1.5 py-2">
                          <div className="flex items-center justify-between w-full">
                            {/* Name */}
                            <span className="text-[14px] font-[500] leading-[1.2] block break-words pr-2">
                              {item.name}
                            </span>
                            {/* Icon - Same row as name, but pushed to the right of the name area */}
                            <Icon
                              name="book"
                              className="w-5 h-5 text-(--primary-color) cursor-pointer shrink-0"
                            />
                          </div>
                        </td>

                        {/* 2. Price Boxes Container (Right Aligned) */}
                        <td colSpan={2} className="p-0 w-[130px] md:w-[120px]">
                          <div className="flex flex-row items-center justify-end pr-[4px] gap-1">
                            {/* NO Box */}
                            <div
                              className={`flex flex-col items-center justify-center w-[62.38px] md:w-[57.5px] h-[45px] rounded-[8px] border border-[var(--lay-border)] bg-[var(--lay-bg)] hover:bg-[var(--lay-hover)] cursor-pointer transition-colors ${
                                isNoSelected
                                  ? "!bg-(--lay-selected) !border-(--line-no-selected-border)"
                                  : ""
                              }`}
                              onClick={() => onFancyBetClick(item, "no")}
                            >
                              <span
                                className={`text-[13px] font-bold leading-[1.1] truncate ${isNoSelected ? "text-white" : "text-[var(--lay-price-text)]"}`}
                              >
                                {item.layPrice}
                              </span>
                              <span
                                className={`text-[10px] font-normal leading-[1] truncate ${isNoSelected ? "text-white" : "text-[var(--lay-size-text)]"}`}
                              >
                                {item.laySize}
                              </span>
                            </div>

                            {/* YES Box */}
                            <div
                              className={`flex flex-col items-center justify-center w-[62.38px] md:w-[57.5px] h-[45px] rounded-[8px] border border-[var(--back-border)] bg-[var(--back-bg)] hover:bg-[var(--back-hover)] cursor-pointer transition-colors ${
                                isYesSelected
                                  ? "!bg-(--back-selected) !border-(--line-yes-selected-border)"
                                  : ""
                              }`}
                              onClick={() => onFancyBetClick(item, "yes")}
                            >
                              <span
                                className={`text-[13px] font-bold leading-[1.1] truncate ${isYesSelected ? "text-white" : "text-[var(--back-price-text)]"}`}
                              >
                                {item.backPrice}
                              </span>
                              <span
                                className={`text-[10px] font-normal leading-[1] truncate ${isYesSelected ? "text-white" : "text-[var(--back-size-text)]"}`}
                              >
                                {item.backSize}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Limits */}
                        <td className="hidden sm:table-cell text-center text-[11px] text-(--secondary-text-color) w-[100px]">
                          {item.min}-{item.max}
                        </td>
                      </tr>

                      {/* Mobile Betslip Row */}
                      {(isNoSelected || isYesSelected) && (
                        <tr>
                          <td colSpan={5} className="p-0 border-none lg:hidden">
                            <MBetSlip />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RenderSportsBookTable = ({ data, eventName, eventId, sportId }: any) => {
  const { setSelectedBet, selectedBet } = useAppStore();
  const [isOpen, setIsOpen] = React.useState(true);

  const onSportsBookClick = (item: any) => {
    if (selectedBet?.selectionId === item.selectionId) {
      setSelectedBet(null);
      return;
    }
    setSelectedBet({
      type: "back",
      odds: item.price,
      teamName: item.name,
      eventName,
      marketType: "SPORTSBOOK",
      selectionId: item.selectionId,
      marketId: item.marketId,
      eventId,
      sportId,
      isLineMarket: false,
    });
  };

  return (
    <div className="w-full">
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="px-1 min-[900px]:px-2 rounded-t-md bg-(--accordion-bg) flex flex-col justify-center w-full font-bold h-8 relative cursor-pointer"
      >
        <div className="flex flex-row items-center h-8 justify-between w-full">
          <div className="text-[14px] text-(--accordion-text) font-[500] leading-[14px] truncate pr-4">
            IND W 30 Over Total Runs (Odds / Evens)
          </div>
          <span
            className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
          >
            <Icon
              name="downArrow"
              width={20}
              className="text-(--accordion-text)"
            />
          </span>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border border-dashed border-(--dotted-line) rounded-b-[4px]"
          >
            <table className="w-full border-collapse bg-(--market-bg)">
              <tbody>
                {data.map((item: any) => {
                  const isSelected =
                    selectedBet?.selectionId === item.selectionId &&
                    selectedBet?.marketType === "SPORTSBOOK";
                  return (
                    <React.Fragment key={item.selectionId}>
                      <tr className="border-b border-dashed border-(--dotted-line) hover:bg-(--primary-hover) h-[53px] py-1">
                        <td className="pl-4 py-2 text-left">
                          <span className="text-[14px] font-bold text-(--palette-text-primary)">
                            {item.name}
                          </span>
                        </td>
                        <td className="w-[57px] md:w-[57px] p-0 rounded-[8px]!">
                          <div
                            className={`cursor-pointer rounded-[8px]! h-[45px] flex flex-col items-center justify-center border-l bg-[#72dbb3] hover:bg-[#5fc7a0] border-(--dotted-line) ${isSelected ? "!bg-[#50d0ae]" : ""}`}
                            onClick={() => onSportsBookClick(item)}
                          >
                            <span className="text-[14px] font-bold text-black">
                              {item.price}
                            </span>
                            <span className="text-[10px] text-black">
                              {item.size}
                            </span>
                          </div>
                        </td>
                        <td className="w-[20%] hidden md:table-cell"></td>
                      </tr>
                      {isSelected && (
                        <tr>
                          <td colSpan={3} className="p-0 border-none lg:hidden">
                            <MBetSlip />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
