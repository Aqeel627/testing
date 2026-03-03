"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./betnav.module.css";
import http from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import MatchOdd from "./match-odd";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store/store";

type ExposureItem = {
  event: { id: string; name: string };
  eventType: { id: string; name: string };
  betCounts?: number;
  [k: string]: any;
};

type Bet = {
  marketId?: string;
  marketName?: string;
  betId?: string;
  selectionName?: string;
  requestedPrice?: number;
  requestedSize?: number;
  matchedDate?: string | Date;
  placedDate?: string | Date;
  side?: "BACK" | "LAY" | string;
  avgOdd?: number;
  totalSize?: number;
};

type MarketGroup = {
  marketId: string;
  marketName: string;
  BACK: Bet[];
  LAY: Bet[];
};

export default function MyBets({
  eventId,
  sportId,
}: {
  eventId: string | null;
  sportId: string | null;
}) {
  const router = useRouter();
  const { userExposureList, setMatchedUnmatchedTotal } = useAppStore();

  const isOpenBetsMode = !!eventId && !!sportId;

  const [hasLogin, setHasLogin] = useState(false);
  const [activeSportIndex, setActiveSportIndex] = useState<number | null>(null);

  const [unmatchedBets, setUnmatchedBets] = useState<Bet[]>([]);
  const [matchedBets, setMatchedBets] = useState<MarketGroup[]>([]);
  const [marketTabs, setMarketTabs] = useState("open");

  const [showMatchOdd, setShowMatchOdd] = useState(true);
  const [selectedMarketKey, setSelectedMarketKey] = useState<string>(""); // "sportId,eventId"

  const [isMatchOddLoading, setIsMatchOddLoading] = useState(false);

  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [exposureFetched, setExposureFetched] = useState(false);
  const [betsFetched, setBetsFetched] = useState(false);

  const tabs = [
    { id: "open", name: "Open", icon: <span className="fa fa-folder-open" /> },
    { id: "settled", name: "Settled", icon: <span className="fa fa-check" /> },
    {
      id: "multiples",
      name: "Multiples",
      icon: <span className="fa fa-layer-group" />,
    },
  ];

  useEffect(() => {
    // token-based login same like old
    setHasLogin(!!localStorage.getItem("token"));
  }, []);

  const resetBetsState = useCallback(() => {
    setSelectedMarketKey("");
    setUnmatchedBets([]);
    setMatchedBets([]);
    setActiveSportIndex(null);
    setShowMatchOdd(true);
    setIsMatchOddLoading(false);

    setExposureFetched(false);
    setBetsFetched(false);
  }, []);

  const clearLoop = () => {
    if (loopRef.current) {
      clearTimeout(loopRef.current);
      loopRef.current = null;
    }
  };

  const groupMatchedByMarket = (rawMatched: Bet[]): MarketGroup[] => {
    const grouped: Record<
      string,
      { marketName: string; BACK: Bet[]; LAY: Bet[] }
    > = {};

    (rawMatched || []).forEach((bet) => {
      if (!bet.marketId) return;

      if (!grouped[bet.marketId]) {
        grouped[bet.marketId] = {
          marketName: bet.marketName || "",
          BACK: [],
          LAY: [],
        };
      }

      const sideKey = (bet.side as "BACK" | "LAY") || "BACK";
      grouped[bet.marketId][sideKey].push(bet);
    });

    return Object.entries(grouped).map(([marketId, data]) => ({
      marketId,
      marketName: data.marketName,
      BACK: data.BACK,
      LAY: data.LAY,
    }));
  };

  const scheduleNextCall = (sId: string, eId: string) => {
    clearLoop();

    const isMobile =
      typeof window !== "undefined"
        ? window.matchMedia?.("(max-width: 768px)").matches
        : false;

    if (!isMobile) return;

    loopRef.current = setTimeout(() => {
      getUnMatchedBetList(sId, eId, { schedule: true });
    }, 1000);
  };

  const getUnMatchedBetList = useCallback(
    async (
      sId?: string | null,
      eId?: string | null,
      opts?: { schedule?: boolean },
    ) => {
      if (!sId || !eId) return false;
      if (!localStorage.getItem("token")) return false;
      setBetsFetched(false);
      setIsMatchOddLoading(true);

      try {
        const res = await http.post(CONFIG.unmatchedBets, {
          sportId: sId,
          eventId: eId,
        });

        const data = res?.data?.data ?? res?.data ?? {};
        const unmatched: Bet[] = data?.unmatchedBets || [];
        const matchedRaw: Bet[] = data?.matchedBets || [];

        const totalMatchUnmatched = unmatched?.length + matchedRaw?.length;

        setUnmatchedBets(unmatched);
        setMatchedBets(groupMatchedByMarket(matchedRaw));
        setMatchedUnmatchedTotal(totalMatchUnmatched);

        const hasData = unmatched.length > 0 || matchedRaw.length > 0;

        if (opts?.schedule && isOpenBetsMode && unmatched.length > 0) {
          scheduleNextCall(sId, eId);
        } else {
          clearLoop();
        }

        return hasData;
      } catch (e) {
        clearLoop();
        return false;
      } finally {
        setIsMatchOddLoading(false);
        setBetsFetched(true);
      }
    },
    [isOpenBetsMode],
  );

  // INIT: Open Bets mode OR My Bets mode
  useEffect(() => {
    clearLoop();
    resetBetsState();

    if (!hasLogin) return;

    if (isOpenBetsMode) {
      // Open Bets: direct call
      setSelectedMarketKey(`${sportId},${eventId}`);
      getUnMatchedBetList(sportId, eventId, { schedule: true });
    }

    return () => clearLoop();
  }, [
    hasLogin,
    isOpenBetsMode,
    eventId,
    sportId,
    resetBetsState,
    getUnMatchedBetList,
  ]);

  const onMarketClick = (item: ExposureItem, index: number) => {
    const sId = item?.eventType?.id;
    const eId = item?.event?.id;
    if (!sId || !eId) return;

    localStorage.setItem("sportId", sId);
    localStorage.setItem("eventId", eId);

    if (activeSportIndex === index) {
      setActiveSportIndex(null);
      setSelectedMarketKey("");
      return;
    }

    setShowMatchOdd(true);
    setActiveSportIndex(index);
    setSelectedMarketKey(`${sId},${eId}`);

    getUnMatchedBetList(sId, eId, { schedule: false });
  };

  const handleCancelUnmatchedRefresh = () => {
    if (!selectedMarketKey) return;
    const [sId, eId] = selectedMarketKey.split(",");
    getUnMatchedBetList(sId, eId, { schedule: isOpenBetsMode });
  };

  const viewMarket = () => {
    const sId = isOpenBetsMode ? sportId : localStorage.getItem("sportId");
    const eId = isOpenBetsMode ? eventId : localStorage.getItem("eventId");
    if (sId && eId) router.push(`/market-details/${eId}/${sId}`);
  };

  // ===== RENDER (same structure like old) =====
  return (
    <div className={styles["pageWrap"]}>
      {/* ✅ Tabs outside (same as password history) */}
      {!isOpenBetsMode && userExposureList?.data?.length > 0 && (
        <div className={styles["tabsWrap"]}>
          <div className="flex mx-auto overflow-x-auto scroll-width-none max-w-3xl px-2 pb-[5px] gap-[15px]">
            {tabs.map((item) => (
              <div
                key={item.id}
                onClick={() => setMarketTabs(item.id)}
                className={`${styles["glass-panel"]} ${styles["nav-item"]} ${
                  marketTabs === item.id ? styles["active"] : ""
                }`}
              >
                <span className="flex items-center justify-center gap-1">
                  {item.icon}
                  <p>{item.name}</p>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Open Bets mode => direct matchodd full width */}
      {isOpenBetsMode && showMatchOdd ? (
        <div className={styles["listWrap"]}>
          <MatchOdd
            unmatchedBets={unmatchedBets}
            matchedBets={matchedBets}
            onCancelUnmatchedRefresh={handleCancelUnmatchedRefresh}
            onViewMarket={viewMarket}
          />
        </div>
      ) : (
        /* ✅ My Bets => full width rows (NO card) */
        <div className={styles["listWrap"]}>
          {!userExposureList?.data?.length ? (
            <div className="py-6 text-center text-gray-500 text-sm">
              No bets available
            </div>
          ) : (
            userExposureList?.data?.map((item: any, i: number) => {
              const isActive = activeSportIndex === i;
              const thisMarketKey = `${item.eventType?.id},${item.event?.id}`;
              const showThisMatchOdd =
                hasLogin &&
                showMatchOdd &&
                selectedMarketKey === thisMarketKey &&
                !isMatchOddLoading;

              return (
                <div key={item.event.id || i} className={styles["rowWrap"]}>
                  <a
                    className={`${styles["nav-link"]} ${
                      isActive ? styles["activesport"] : ""
                    }`}
                    onClick={() => onMarketClick(item, i)}
                  >
                    <span className={styles["bet-marketname"]}>
                      {item.event.name}
                      {item.betCounts ? ` (${item.betCounts})` : ""}
                    </span>
                  </a>

                  {showThisMatchOdd && (
                    <div className={styles["rowBody"]}>
                      <MatchOdd
                        unmatchedBets={unmatchedBets}
                        matchedBets={matchedBets}
                        onCancelUnmatchedRefresh={handleCancelUnmatchedRefresh}
                        onViewMarket={viewMarket}
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
