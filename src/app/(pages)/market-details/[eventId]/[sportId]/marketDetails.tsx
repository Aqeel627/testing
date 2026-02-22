"use client";
import Icon from "@/icons/icons";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { CONFIG } from "@/lib/config";
import axios from "axios";
import { useAppStore } from "@/lib/store/store";
import { useAppRateHighlighter } from "@/lib/highlaterMarket";
import { motion, AnimatePresence } from "framer-motion";
import MBetSlip from "@/components/common/MBetSlip";

// WebSocket service (assumed to exist)
import { webSocketService } from "@/lib/websocket.service";
import Icons from "@/icons/icons";
import SingleMarket from "@/components/pages/home/single-market";
import RuleModal from "@/components/modal/role/Role";
import { log } from "console";
import { VideoSimple } from "@/components/video-simple/VideoSimple";
import MarketLoader from "@/components/common/market-loader";

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
  const { setSelectedBet, menuList, selectedBet } = useAppStore();
  const [isPending, setIsPending] = useState(true);
  const params = useParams();
  const router = useRouter();
  const eventId = String(params.eventId ?? "");
  const sportId = String(params.sportId ?? params.marketId ?? "");

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
  const [streamCounter, setStreamCounter] = useState(0);
  const marketData = {
    title: "Tied Match",
    min: 5,
    max: 10000,
    backPrice: "2.36",
    layPrice: "2.42",
  };
  const [selectedEventType, setSelectedEventType] = useState<string>(
    sportName || "",
  );
  const [selectedCompetition, setSelectedCompetition] = useState<string>("");

  const eventTypeRef = useRef<HTMLSpanElement | null>(null);
  const competitionRef = useRef<HTMLSpanElement | null>(null);

  // Current market type for filtering - IMPORTANT: track current tab
  const [currentMarketType, setCurrentMarketType] = useState<string>("POPULAR");
  const [currentMarketId, setCurrentMarketId] = useState<string>("");

  // Tabs + indicator
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("POPULAR");
  const [isMarketSectionOpen, setIsMarketSectionOpen] = useState(true);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
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
        sportId: String(params?.sportId ?? params?.marketId ?? ""),
        key: "10",
      };

      const res = await axios.post(CONFIG.marketList, req);
      const data = res.data?.data;

      if (res?.data?.pl) {
        const freshPl = JSON.parse(JSON.stringify(res.data.pl));
        setAllMarketPl(freshPl);
      }

      if (!data) return;
      setTournamentName(data.matchOddsData[0].competition.name);
      setSportName(data.matchOddsData[0].eventType.name);
      setMarketTime(data.matchOddsData[0].marketStartTime);
      const matchOdds = data.matchOddsData?.[0];
      setTeamOne(matchOdds.runnersName[0].runnerName);
      setTeamTwo(matchOdds.runnersName[1].runnerName);
      const fancy = (data.fancyData || []) as Market[];
      const manual = (data.bookmakersData || []) as Market[];
      const betfair = (data.matchOddsData || []) as Market[];
      const sportsbook = (data.sportsbookData || []) as Market[];

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
      if (all.length === 0) {
        //  this.toastService.showFromResponse(
        //             'error,  No Market Found, We couldn’t locate any active markets for your selection.'
        //           );
        console.log("No Markets are active");

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
        router.push("/");
        return;
      }
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
            router.push("/");
          }
        } catch (e) {
          console.warn("IndexedDB read failed:", e);
          router.push("/");
        }
      }
    } catch (e) {
      console.warn("getMarketList failed:", e);
    } finally{
      setIsPending(false)
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
        console.error("Failed to apply odds update:", e);
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
    // Save current tab state
    setActiveTab(type);
    setCurrentMarketType(type);
    setCurrentMarketId(marketid || "");

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
    setIsPending(true)
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

  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;
    const activeBtn = tabsListRef.current.querySelector(
      `button[data-tab="${activeTab}"]`,
    ) as HTMLElement | null;
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const t = setTimeout(() => updateIndicator(), 80);
    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator, activeTab]);

  // ---------- UI helpers ----------
  const getMarketTitle = (m: any) =>
    m?.marketName || m?.marketType || m?.oddsType || m?.name || "Market";

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
      menuList?.competitions?.filter(
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
  }, [menuList, sportId]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;

      const inEventType = eventTypeRef.current?.contains(t);
      const inCompetition = competitionRef.current?.contains(t);

      if (!inEventType) setIsEventTypeOpen(false);
      if (!inCompetition) setIsCompetitionOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function setOpenRulesModal(rule: any) {
    console.log("rule", rule);
    setOpenRules(true);
    setRuleContent(rule);
  }

  const renderMarketTable = (market: any) => {
    const runners = getRunnersList(market);
    const limits = getLimits(market);
    const data = market;
    const marketIsSusp = isSuspendedLike(market?.status);
    const isBetOnThisMarket =
      selectedBet?.eventName === (market.event?.name || eventName) &&
      selectedBet?.marketType === (market.marketType || market.marketName);

    return (
      <>
        <div className="border w-full border-dashed border-(--dotted-line) rounded-[4px] overflow-hidden">
          {/* HEADER */}
          <div className="px-1 min-[900px]:px-2 bg-[#153045] border-b border-[#28323D] flex flex-col justify-center w-full font-bold h-8 relative">
            <div className="absolute z-10 cursor-pointer right-2 top-1/2 -translate-y-[50%]">
              <Icon
                name="info"
                onClick={() => setOpenRulesModal(data.description.rules)}
              />
              <RuleModal
                open={openRules}
                onOpenChange={setOpenRules}
                text={ruleContent}
              />
            </div>
            <div className="relative flex flex-row items-center h-8 justify-between w-full">
              <div className="text-[14px] text-[#68CDF9] font-[500] leading-[14px] flex-1 flex-[1_1_6rem] min-w-0 whitespace-nowrap truncate relative top-[1px]">
                {getMarketTitle(market)}
              </div>

              <div className="relative flex flex-col items-end max-w-[360px] w-full flex-[5_0_94px]">
                <div className="flex items-center text-[13px] font-normal leading-[18px] text-[#68CDF9] pt-[1px]">
                  {limits ? (
                    <>
                      <p className="invisible">Min: {limits.min}</p>&nbsp;
                      <p className="!font-[400] invisible  text-[10px]">|</p>
                      &nbsp;
                      <p className="invisible">
                        Max: {Intl.NumberFormat("en-US").format(limits.max)}
                      </p>
                    </>
                  ) : (
                    <p className="opacity-70"> </p>
                  )}
                </div>

                <div className="flex gap-1 w-full justify-end h-[20px] relative top-[-1px]">
                  <div className="flex w-1/2 gap-1 justify-end">
                    <div className="flex-1 min-w-0 max-[464px]:hidden" />
                    <div className="flex-1 min-w-0 max-[346px]:hidden" />
                    <div className="flex items-center justify-center pb-[1px] font-semibold rounded-[2px] text-black select-none flex-1 min-w-0 text-[14px] leading-[18px] bg-[#0591cf] h-4">
                      Back
                    </div>
                  </div>

                  <div className="flex w-1/2 gap-1 justify-start">
                    <div className="flex items-center justify-center rounded-[2px] text-black select-none flex-1 min-w-0 text-[14px] font-semibold pb-[1px] leading-[18px] bg-[#d1686d] h-4">
                      Lay
                    </div>
                    <div className="flex-1 min-w-0 max-[346px]:hidden" />
                    <div className="flex-1 min-w-0 max-[464px]:hidden" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BODY */}
          <ul className="relative list-none m-0 p-0 px-1 min-[900px]:px-2 bg-[#191e26]">
            {runners.map((runner: any, index: number) => {
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
                <li
                  key={`${market.marketId}-${runner.selectionId}-${index}`}
                  className="flex flex-col justify-start items-center relative w-full box-border text-left no-underline border-b border-dashed border-(--dotted-line) bg-clip-padding hover:bg-[#1C252E] transition-colors"
                >
                  <div className="flex w-full flex-row flex-1 min-h-[50px] items-center justify-between py-1">
                    {/* Runner Name */}
                    <div className="font-[500] text-[14px] leading-[1] flex-[1_1_6rem] min-w-0 pr-2">
                      <span
                        className={`text-white ${runnerSusp ? "" : "cursor-pointer"}`}
                      >
                        {runnerName}
                      </span>
                    </div>

                    {/* Odds Boxes */}
                    <div className="relative flex gap-1 max-w-[360px] h-[35px] w-full flex-[5_0_94px]">
                      {/* BACK (blue) */}
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
                          : back3.map((item, i) => (
                              <div
                                key={`back-${i}`}
                                data-app-rate-highlighter
                                className={`back-${i + 1} flex flex-col items-center justify-center h-full rounded-[2px] flex-1 min-w-0 cursor-pointer text-black transition-colors ${
                                  i === 0
                                    ? "bg-[#0591cf] hover:bg-[#68CDF9]"
                                    : "bg-[#0a77a8] hover:bg-[#68CDF9]"
                                } ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                                onClick={() => {
                                  if (!item.raw?.price || item.raw.price === 0)
                                    return;

                                  setSelectedBet({
                                    type: "back",
                                    odds: item.raw?.price,
                                    teamName: runnerName,
                                    eventName: market.event?.name || eventName,
                                    marketType:
                                      market.marketType || market.marketName,
                                    selectionId: runner.selectionId,
                                  });
                                }}
                              >
                                <span className="text-[11px] sm:text-[13px] font-bold leading-[1.1] truncate">
                                  {item.odd}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-normal leading-[1] truncate">
                                  {item.vol}
                                </span>
                              </div>
                            ))}
                      </div>

                      {/* LAY (red/pink) */}
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
                          : lay3.map((item, i) => (
                              <div
                                key={`lay-${i}`}
                                data-app-rate-highlighter
                                className={`lay-${i + 1} flex flex-col items-center justify-center h-full rounded-[2px] flex-1 min-w-0 cursor-pointer text-black transition-colors ${
                                  i === 0
                                    ? "bg-[#d1686d] hover:bg-[#FFA4A7]"
                                    : "bg-[#a3555b] hover:bg-[#FFA4A7]"
                                } ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                                onClick={() => {
                                  if (!item.raw?.price || item.raw.price === 0)
                                    return;

                                  setSelectedBet({
                                    type: "lay",
                                    odds: item.raw?.price,
                                    teamName: runnerName,
                                    eventName: market.event?.name || eventName,
                                    marketType:
                                      market.marketType || market.marketName,
                                    selectionId: runner.selectionId,
                                  });
                                }}
                              >
                                <span className="text-[11px] sm:text-[13px] font-bold leading-[1.1] truncate">
                                  {item.odd}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-normal leading-[1] truncate">
                                  {item.vol}
                                </span>
                              </div>
                            ))}
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
                  <div
                    id={`betslip-${runner.selectionId}-${market.marketType || market.marketName}`}
                  >
                    {selectedBet?.selectionId === runner.selectionId &&
                      selectedBet?.marketType ===
                        (market.marketType || market.marketName) && (
                        <div className="block lg:hidden">
                          <MBetSlip />
                        </div>
                      )}
                  </div>
                </li>
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
                className="h-6 min-w-6 inline-flex justify-center items-center overflow-visible text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5 relative"
              >
                {/* ICON CLICK TOGGLE */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEventTypeOpen((v) => !v);
                    setIsCompetitionOpen(false);
                  }}
                  className="text-market-name inline-flex"
                >
                  <Icon name="play" className="w-5 h-5" />
                </button>

                {/* ORIGINAL TEXT */}
                <a href="" className="inline-flex">
                  {selectedEventType || sportName || ""}
                </a>

                {/* ORIGINAL DROPDOWN DESIGN */}
                {isEventTypeOpen && (
                  <ul className="absolute left-2 p-1 top-full mt-0 -ml-1 max-h-[200px] glass rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)] backdrop-blur-[2px]! text-(--palette-text-primary) z-40 overflow-y-auto no-scrollbar">
                    {menuList?.eventTypes?.map((item: any) => (
                      <li key={item.eventType.id}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedEventType(item.eventType.name);
                            filterCompetitions(item.eventType.id);
                            setIsEventTypeOpen(false);
                            navigateToMarket(item.eventType.name);
                          }}
                          className={`text-sm w-full text-nowrap text-left relative bg-transparent cursor-pointer gap-2 font-semibold transition px-2 py-1.5 rounded-[6px] ${
                            (selectedEventType &&
                              selectedEventType === item.eventType.name) ||
                            (!selectedEventType &&
                              sportName === item.eventType.name)
                              ? "bg-[rgba(255,255,255,0.25)]! text-(--palette-primary-main)"
                              : "hover:bg-[rgba(255,255,255,0.25)]"
                          }`}
                        >
                          {item.eventType.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </span>

              <span
                ref={competitionRef}
                className="h-6 min-w-6 inline-flex justify-center relative items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5"
              >
                {/* ✅ ICON CLICK TOGGLE (same look) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsCompetitionOpen((v) => !v);
                    setIsEventTypeOpen(false);
                  }}
                  className="text-market-name inline-flex"
                >
                  <Icon name="play" className="w-5 h-5" />
                </button>

                <a href="" className="inline-flex">
                  {selectedCompetition || tournamentName || "Tournament"}
                </a>

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
                                ? "bg-[rgba(255,255,255,0.25)]! text-(--palette-primary-main)"
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
      <div className="text-white bg-[#919eab0a] w-full border-[1px] border-dashed border-(--dotted-line) rounded-[16px] overflow-hidden max-[637px]:mt-[6px]">
        <div className="relative no-underline w-full box-border text-left py-2 px-4 flex-wrap rounded-2">
          <div className="flex justify-between items-center w-full">
            <div className="flex-auto min-w-0 m-0">
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5">
                <span className="text-market-name">
                  <Icon name="play" className="w-5 h-5" />
                </span>
                <a href="" className="inline-flex text-(--primary-text-color)">
                  {eventName || "Event"}
                </a>
              </span>
              <span className="text-[0.875rem] leading-[1.57143]">
                <div className="flex gap-2 items-center">
                  <time className="text-[0.785rem] font-semibold leading-[1.57143] text-[#919EAB]">
                    {formatDate(marketTime)}
                  </time>
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

      {isPending ? (
        <MarketLoader />
      ) : (
        <>
          {/* Tabs */}
          <div className="mt-1 min-[900px]:mt-2 flex bg-[#28323D] rounded-[8px] min-h-[48px] overflow-hidden w-full max-w-full">
            <div className="relative flex items-center flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div
                ref={tabsListRef}
                className="flex p-2 !pb-[6px] relative z-[1] *:text-nowrap w-full items-center relative"
              >
                <div
                  className="absolute bg-[#141A21] rounded-[8px]  transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 h-[32px]"
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
                      ? "text-[#68CDF9] font-semibold"
                      : "text-[#919EAB] font-[500]"
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
                    className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                      activeTab === market?.marketName
                        ? "text-[#68CDF9] font-semibold"
                        : "text-[#919EAB] font-[500]"
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
                      ? "text-[#68CDF9] font-semibold"
                      : "text-[#919EAB] font-[500]"
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
              className="px-1 mt-2 min-[900px]:px-2 rounded-md bg-[#153045] border-b border-[#28323D] flex flex-col justify-center w-full font-bold h-8 relative cursor-pointer"
            >
              <div className="relative flex flex-row items-center h-8 justify-between w-full">
                <div className="text-[14px] text-[#68CDF9] font-[500] leading-[14px] flex-1 flex-[1_1_6rem] min-w-0 whitespace-nowrap truncate relative top-[1px]">
                  {"Odds"}
                </div>
                <span
                  className={`transition-transform duration-300 ${isMarketSectionOpen ? "rotate-0" : "rotate-90"}`}
                >
                  <Icon
                    name="downArrow"
                    className="text-(--palette-primary-light)"
                  />
                </span>
              </div>
            </div>
          )}

          {/* Display markets based on active tab */}
          {activeTab === "ALL" || activeTab === "POPULAR" ? (
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
          )}

          {/* If empty */}
          {!isPending && !allMarkets.length && (
            <div className="mt-3 text-center text-[#919EAB] text-sm">
              No markets available
            </div>
          )}
        </>
      )}
    </div>
  );
}
