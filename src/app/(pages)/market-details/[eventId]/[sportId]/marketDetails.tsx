"use client";
import Icon from "@/icons/icons";
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
  const [betfairData, setBetfairData] = useState<Market[]>([]);
  const [sportsbookData, setSportsbookData] = useState<Market[]>([]);
  const [allMarkets, setAllMarkets] = useState<Market[]>([]);
  const [filteredMarkets, setFilteredMarkets] = useState<Market[]>([]);
  const [popularMarkets, setPopularMarkets] = useState<Market[]>([]);
  const [eventName, setEventName] = useState("");

  // Current market type for filtering
  const [currentMarketType, setCurrentMarketType] = useState<string>("ALL");
  // Tabs + indicator
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const buildRunnerNameMap = (market: any) => {
    const map: Record<number, string> = {};
    (market?.runnersName || []).forEach((r: any) => {
      map[Number(r.selectionId)] = r.runnerName;
    });
    return map;
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

      // Calculate popular markets
      const popular = all
        .filter((market: any) => market.popular && market?.status !== "CLOSED")
        .sort((a: any, b: any) => a.sequence - b.sequence);
      setPopularMarkets(popular);

      // Set default filtered markets to ALL
      setFilteredMarkets(all.sort((a: any, b: any) => a.sequence - b.sequence));

      // event name best-effort
      if ((betfair as any)?.[0]?.event?.name)
        setEventName((betfair as any)[0].event.name);
      else if ((manual as any)?.[0]?.event?.name)
        setEventName((manual as any)[0].event.name);

      // 🎯 No Market Found → fallback IndexedDB (kept same behavior as your earlier logic)
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

            setFilteredMarkets(
              useMarkets.sort((a: any, b: any) => a.sequence - b.sequence),
            );

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
    }
  };

  // Market type filtering function
  const setMarketType = (
    type: any,
    event: any,
    catType: any,
    index: any,
    marketid: any,
  ) => {
    setCurrentMarketType(type);

    if (event) {
      // Remove active class from all list items
      const listItems = document.querySelectorAll("#naviMarketList li");
      listItems.forEach((item) => item.classList.remove("active"));

      // Add active class to clicked item
      if (event.currentTarget) {
        event.currentTarget.classList.add("active");
      }

      // Scroll into view for mobile
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

    if (type == "Popular") {
      filtered = allMarkets
        .filter((market: any) => {
          if (market.popular && market?.status != "CLOSED") {
            return market;
          } else {
            return null;
          }
        })
        .sort((a: any, b: any) => a.sequence - b.sequence);
      setPopularMarkets(filtered);
    } else if (type == "ALL") {
      filtered = allMarkets.sort((a: any, b: any) => a.sequence - b.sequence);
    } else {
      filtered = allMarkets
        .filter((market: any) => {
          if (market.marketId == marketid && market?.status != "CLOSED") {
            return market;
          } else {
            return null;
          }
        })
        .sort((a: any, b: any) => a.sequence - b.sequence);
    }

    setFilteredMarkets(filtered);
  };

  useEffect(() => {
    if (!eventId || !sportId) return;
    getMarketList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.eventId, params.sportId]);

  // Set default active tab to ALL
  useEffect(() => {
    setActiveTab("POPULAR");
    setCurrentMarketType("Popular");

    // Popular markets filter bhi set karo
    const popular = allMarkets
      .filter((market: any) => market.popular && market?.status !== "CLOSED")
      .sort((a: any, b: any) => a.sequence - b.sequence);
    setFilteredMarkets(popular);
  }, [allMarkets]);

  const navTabs: TabKey[] = useMemo(() => {
    const tabs: TabKey[] = ["ALL", "POPULAR"];

    // Sirf popular market names ko additional tabs mein add karo
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
  }, [updateIndicator]);

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
    // prefer real runners for odds boxes
    if (Array.isArray(m?.runners) && m.runners.length) return m.runners;
    // fallback: runnersName as pseudo runners
    if (Array.isArray(m?.runnersName) && m.runnersName.length) {
      return m.runnersName.map((r: any) => ({
        selectionId: r.selectionId,
        status: m?.status,
        ex: { availableToBack: [], availableToLay: [] },
      }));
    }
    return [];
  };

  const renderMarketTable = (market: any) => {
    const runners = getRunnersList(market);
    const limits = getLimits(market);

    const marketIsSusp = isSuspendedLike(market?.status);

    return (
      <div className="border w-full border-dashed border-[#919eab29] rounded-[4px] overflow-hidden">
        {/* HEADER */}
        <div className="px-1 min-[900px]:px-2 bg-[#153045] border-b border-[#28323D] flex flex-col justify-center w-full font-bold h-8">
          <div className="relative flex flex-row items-center h-8 justify-between w-full">
            <div className="text-[14px] text-[#68CDF9] font-[500] leading-[14px] flex-1 flex-[1_1_6rem] min-w-0 whitespace-nowrap truncate relative top-[1px]">
              {getMarketTitle(market)}
            </div>

            <div className="relative flex flex-col items-end max-w-[360px] w-full flex-[5_0_94px]">
              <div className="flex items-center text-[13px] font-normal leading-[18px] text-[#68CDF9] pt-[1px]">
                {limits ? (
                  <>
                    <p>Min: {limits.min}</p>&nbsp;
                    <p className="!font-[400] text-[10px]">|</p>&nbsp;
                    <p>Max: {Intl.NumberFormat("en-US").format(limits.max)}</p>
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

            const runnerSusp = marketIsSusp || isSuspendedLike(runner?.status);

            const backs = Array.isArray(runner?.ex?.availableToBack)
              ? runner.ex.availableToBack
              : [];
            const lays = Array.isArray(runner?.ex?.availableToLay)
              ? runner.ex.availableToLay
              : [];

            // we want 3 levels; if API gives fewer, fill with zeros
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
                className="flex flex-col justify-start items-center relative w-full box-border text-left no-underline border-b border-dashed border-[#919eab29] bg-clip-padding hover:bg-[#1C252E] transition-colors"
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
                              className={`flex flex-col items-center justify-center h-full rounded-[2px] flex-1 min-w-0 cursor-pointer text-black transition-colors ${
                                i === 0
                                  ? "bg-[#0591cf] hover:bg-[#68CDF9]"
                                  : "bg-[#0a77a8] hover:bg-[#68CDF9]"
                              } ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                              onClick={() => {
                                // console.log("BACK click", market.marketId, runner.selectionId, item.raw?.price);
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
                              className={`flex flex-col items-center justify-center h-full rounded-[2px] flex-1 min-w-0 cursor-pointer text-black transition-colors ${
                                i === 0
                                  ? "bg-[#d1686d] hover:bg-[#FFA4A7]"
                                  : "bg-[#a3555b] hover:bg-[#FFA4A7]"
                              } ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                              onClick={() => {
                                // console.log("LAY click", market.marketId, runner.selectionId, item.raw?.price);
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
    );
  };

  return (
    <div className="w-full mx-auto box-border flex flex-auto flex-col pt-2 pb-2">
      {/* Breadcrumbs */}
      <div className="mb-2 min-[900px]:mb-[16px]">
        <div className="flex flex-wrap items-center gap-1.5 min-[900px]:gap-2.5 max-w-full overflow-hidden">
          <div className="grow">
            <div className=" flex flex-wrap gap-2 min-[900px]:gap-4">
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] px-1.5 gap-2.5">
                <a href="" className="inline-flex">
                  Home
                </a>
              </span>
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5">
                <span className="text-[#68CDF9]">
                  <Icon name="play" className="w-5 h-5" />
                </span>
                <a href="" className="inline-flex">
                  Cricket
                </a>
              </span>
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5">
                <span className="text-[#68CDF9]">
                  <Icon name="play" className="w-5 h-5" />
                </span>
                <a href="" className="inline-flex">
                  {eventName || "Event"}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title Block */}
      <div className="text-white bg-[#919eab0a] w-full border-[1px] border-dashed border-[#919eab29] rounded-[16px] overflow-hidden max-[637px]:mt-[6px]">
        <div className="flex justify-start items-center relative no-underline w-full box-border text-left py-2 px-4 flex-wrap rounded-2">
          <div className="flex-auto min-w-0 m-0">
            <h5 className="text-[1rem] font-bold leading-[1.5] mb-[-2px]">
              {eventName || "Market Details"}
            </h5>
            <span className="text-[0.875rem] leading-[1.57143]">
              <div className="flex gap-2 items-center">
                <time className="text-[0.785rem] font-semibold leading-[1.57143] text-[#919EAB]">
                  Event: {eventId} | Sport: {sportId}
                </time>
              </div>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-1 min-[900px]:mt-2 flex bg-[#28323D] rounded-[8px] min-h-[48px] overflow-hidden w-full max-w-full">
        <div className="relative flex items-center flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div
            ref={tabsListRef}
            className="flex p-2 !pb-[6px] relative z-[1] w-full items-center relative"
          >
            <div
              className="absolute bg-[#141A21] rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 h-[32px]"
              style={{
                left: `${indicatorStyle.left}px`,
                top: "24px",
                transform: "translateY(-50%)",
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />

            {/* ALL Tab */}
            <button
              data-tab="ALL"
              onClick={(e) => {
                setActiveTab("ALL");
                setMarketType("ALL", e, "All", 0, "");
              }}
              className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                activeTab === "ALL"
                  ? "text-[#68CDF9] font-semibold"
                  : "text-[#919EAB] font-[500]"
              }`}
            >
              ALL
            </button>

            {/* POPULAR Tab */}
            <button
              data-tab="POPULAR"
              onClick={(e) => {
                setActiveTab("POPULAR");
                setMarketType("Popular", e, "Popular", 1, "");
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
            {popularMarkets.map((betfair, i) => (
              <button
                key={`popular-tab-${i}`}
                data-tab={betfair?.marketName}
                onClick={(e) => {
                  setActiveTab(betfair?.marketName as TabKey);
                  setMarketType(
                    betfair?.marketName,
                    e,
                    "betfair",
                    i,
                    betfair?.marketId,
                  );
                }}
                className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem] px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${
                  activeTab === betfair?.marketName
                    ? "text-[#68CDF9] font-semibold"
                    : "text-[#919EAB] font-[500]"
                }`}
              >
                {betfair?.marketName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Display markets based on active tab */}
      <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-2">
        {activeTab === "ALL" &&
          allMarkets.length > 0 &&
          allMarkets
            .sort(
              (a: any, b: any) =>
                Number(a.sequence || 0) - Number(b.sequence || 0),
            )
            .map((m: any) => (
              <React.Fragment key={String(m.exMarketId ?? m.marketId)}>
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
              <React.Fragment key={String(m.exMarketId ?? m.marketId)}>
                {renderMarketTable(m)}
              </React.Fragment>
            ))}

        {activeTab !== "ALL" &&
          activeTab !== "POPULAR" &&
          filteredMarkets.length > 0 &&
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

      {/* If empty */}
      {!allMarkets.length && (
        <div className="mt-3 text-center text-[#919EAB] text-sm">
          No markets available
        </div>
      )}
    </div>
  );
}
