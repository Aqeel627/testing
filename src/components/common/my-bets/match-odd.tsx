"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./match-odd.module.css";
import http from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import { splitMsg } from "@/lib/functions";
import { useToast } from "@/components/common/toast/toast-context";

export interface Bet {
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
}

export interface MarketGroup {
  marketId: string;
  marketName: string;
  BACK: Bet[];
  LAY: Bet[];
}

type MarketFlow = {
  marketId: string;
  marketName: string;
  unmatched: Bet[];
  matched: { BACK: Bet[]; LAY: Bet[] };
};

interface MatchOddProps {
  unmatchedBets: Bet[];
  matchedBets: MarketGroup[];

  /** old flow: cancel ke baad parent re-fetch kare */
  onCancelUnmatchedRefresh: () => void;

  /** My bets page se market open karna */
  onViewMarket?: () => void;
}

export default function MatchOdd({
  unmatchedBets,
  matchedBets,
  onCancelUnmatchedRefresh,
  onViewMarket,
}: MatchOddProps) {
  const { showToast } = useToast();

  const [isDetailsOpen, setIsDetailsOpen] = useState<Record<string, boolean>>(
    {},
  );

  const [openMarkets, setOpenMarkets] = useState<Record<string, boolean>>({});
  // true => raw mode, false => average mode (old logic)
  const [isRawByMarket, setIsRawByMarket] = useState<Record<string, boolean>>(
    {},
  );

  const formatDateTime = (value?: string | Date) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };

  const marketFlows: MarketFlow[] = useMemo(() => {
    const map = new Map<string, MarketFlow>();

    (matchedBets || []).forEach((m) => {
      if (!m?.marketId) return;
      map.set(m.marketId, {
        marketId: m.marketId,
        marketName: m.marketName || "",
        unmatched: [],
        matched: {
          BACK: m.BACK || [],
          LAY: m.LAY || [],
        },
      });
    });

    (unmatchedBets || []).forEach((b) => {
      const id = b?.marketId;
      if (!id) return;

      if (!map.has(id)) {
        map.set(id, {
          marketId: id,
          marketName: b?.marketName || "",
          unmatched: [],
          matched: { BACK: [], LAY: [] },
        });
      }

      const existing = map.get(id)!;
      if (!existing.marketName && b?.marketName) existing.marketName = b.marketName;
      existing.unmatched.push(b);
    });

    return Array.from(map.values());
  }, [matchedBets, unmatchedBets]);

  // default states init (same behavior)
  useEffect(() => {
    if (!marketFlows.length) return;

    setOpenMarkets((prev) => {
      const next = { ...prev };
      marketFlows.forEach((m) => {
        if (next[m.marketId] === undefined) next[m.marketId] = true;
      });
      return next;
    });

    setIsRawByMarket((prev) => {
      const next = { ...prev };
      marketFlows.forEach((m) => {
        if (next[m.marketId] === undefined) next[m.marketId] = true; // default raw
      });
      return next;
    });
  }, [marketFlows]);

  const hasAnyBets = marketFlows.some(
    (m) =>
      (m.unmatched?.length || 0) > 0 ||
      (m.matched?.BACK?.length || 0) > 0 ||
      (m.matched?.LAY?.length || 0) > 0,
  );

  const toggleDetails = (key: string) => {
    setIsDetailsOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showMetaToast = (resp: any, fallback = "Done") => {
    const raw = resp?.meta?.message || resp?.data?.meta?.message || "";
    const msg = splitMsg(raw);
    if (msg?.status) showToast(msg.status, msg.title, msg.desc);
    else showToast("success", "", fallback);
  };

  const cancelBetsAllUnmatchedBets = async () => {
    try {
      // group unmatched by market like old code
      const marketBetMap = new Map<string, string[]>();
      (unmatchedBets || []).forEach((b) => {
        if (!b.marketId || !b.betId) return;
        if (!marketBetMap.has(b.marketId)) marketBetMap.set(b.marketId, []);
        marketBetMap.get(b.marketId)!.push(b.betId);
      });

      const req = {
        marketBets: Array.from(marketBetMap.entries()).map(([marketId, betIds]) => ({
          marketId,
          betIds,
        })),
      };

      if (!req.marketBets.length) return;

      const res = await http.post(CONFIG.cancelBetsAllUnmatchedBets, req);
      showMetaToast(res?.data, "All unmatched bets cancelled");
      onCancelUnmatchedRefresh();
    } catch (e: any) {
      showToast("error", "Error", e?.message || "Something went wrong");
    }
  };

  const cancelBetsAllUnmatchedBetsByMarket = async (marketId?: string) => {
    try {
      if (!marketId) return;

      const betIds = (unmatchedBets || [])
        .filter((b) => b?.marketId === marketId && b?.betId)
        .map((b) => b.betId as string);

      if (!betIds.length) return;

      const req = { marketBets: [{ marketId, betIds }] };
      const res = await http.post(CONFIG.cancelBetsAllUnmatchedBets, req);
      showMetaToast(res?.data, "All unmatched bets cancelled");
      onCancelUnmatchedRefresh();
    } catch (e: any) {
      showToast("error", "Error", e?.message || "Something went wrong");
    }
  };

  const cancelSingleBet = async (bet: Bet) => {
    try {
      if (!bet?.marketId || !bet?.betId) return;

      const req = { marketBets: [{ marketId: bet.marketId, betIds: [bet.betId] }] };
      const res = await http.post(CONFIG.cancelBetsAllUnmatchedBets, req);
      showMetaToast(res?.data, "Bet cancelled");
      onCancelUnmatchedRefresh();
    } catch (e: any) {
      showToast("error", "Error", e?.message || "Something went wrong");
    }
  };

  const checkAvgOddsGrouped = useCallback((arry: MarketGroup[]): MarketGroup[] => {
    const groupedByMarket: Record<
      string,
      { marketId: string; marketName: string; BACK: any[]; LAY: any[] }
    > = {};

    for (const market of arry || []) {
      const { marketId, marketName, BACK, LAY } = market;

      if (!groupedByMarket[marketId]) {
        groupedByMarket[marketId] = {
          marketId,
          marketName: marketName || "",
          BACK: [],
          LAY: [],
        };
      }

      for (const bet of BACK || []) {
        const selection = bet.selectionName;
        let existing = groupedByMarket[marketId].BACK.find(
          (s: any) => s.selectionName === selection,
        );

        if (!existing) {
          existing = { selectionName: selection, totalOdd: 0, totalSize: 0, count: 0, side: "BACK" };
          groupedByMarket[marketId].BACK.push(existing);
        }
        existing.totalOdd += bet.requestedPrice || 0;
        existing.totalSize += bet.requestedSize || 0;
        existing.count += 1;
      }

      for (const bet of LAY || []) {
        const selection = bet.selectionName;
        let existing = groupedByMarket[marketId].LAY.find(
          (s: any) => s.selectionName === selection,
        );

        if (!existing) {
          existing = { selectionName: selection, totalOdd: 0, totalSize: 0, count: 0, side: "LAY" };
          groupedByMarket[marketId].LAY.push(existing);
        }
        existing.totalOdd += bet.requestedPrice || 0;
        existing.totalSize += bet.requestedSize || 0;
        existing.count += 1;
      }
    }

    return Object.values(groupedByMarket).map((m) => {
      const calcAvg = (arr: any[]): Bet[] =>
        arr.map((s: any) => ({
          selectionName: s.selectionName,
          avgOdd: Number((s.totalOdd / s.count).toFixed(2)),
          totalSize: Number(s.totalSize.toFixed(2)),
          side: s.side,
        }));

      return {
        marketId: m.marketId,
        marketName: m.marketName,
        BACK: calcAvg(m.BACK),
        LAY: calcAvg(m.LAY),
      };
    });
  }, []);

  const getMarketMatchedView = useCallback(
    (market: MarketFlow, isRaw: boolean) => {
      if (isRaw) return market.matched;

      const avg = checkAvgOddsGrouped([
        {
          marketId: market.marketId,
          marketName: market.marketName,
          BACK: market.matched?.BACK || [],
          LAY: market.matched?.LAY || [],
        },
      ]);

      const m = avg?.[0];
      return { BACK: m?.BACK || [], LAY: m?.LAY || [] };
    },
    [checkAvgOddsGrouped],
  );

  if (!hasAnyBets) {
    return (
      <div className="py-6 text-center text-gray-500 text-sm">
        No bets available
      </div>
    );
  }

  return (
    <div className="w-full">
      <nav className=" mb-0 text-[14px]">
        <div className="border-t-[unset] relative overflow-x-hidden overflow-y-auto -mt-px ">
          <div className="pb-[5px]">
            {/* Optional global cancel all (old feature) */}
            {/* {(unmatchedBets?.length || 0) > 0 ? (
              <div className="px-2 py-2">
                <button
                  onClick={cancelBetsAllUnmatchedBets}
                  className="w-full py-2 rounded-lg font-bold"
                  style={{
                    background: "var(--primary-color)",
                    color: "#fff",
                  }}
                >
                  Cancel All Unmatched
                </button>
              </div>
            ) : null} */}

            {marketFlows.map((market, marketIndex) => {
              const isOpen = openMarkets[market.marketId] ?? true;

              const marketUnmatchedLen = market.unmatched?.length || 0;
              const marketMatchedCount =
                (market.matched?.BACK?.length || 0) +
                (market.matched?.LAY?.length || 0);

              const hasUnmatched = marketUnmatchedLen > 0;
              const hasMatched = marketMatchedCount > 0;

              const isRaw = isRawByMarket[market.marketId] ?? true;
              const matchedView = getMarketMatchedView(market, isRaw);

              return (
                <div key={market.marketId || `market-${marketIndex}`}>
                  {/* Market header */}
                  <a
                    className={styles["odds-header"]}
                    onClick={() =>
                      setOpenMarkets((prev) => ({
                        ...prev,
                        [market.marketId]: !prev?.[market.marketId],
                      }))
                    }
                  >
                    <i className={`fa ${isOpen ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
                    <div>{market.marketName}</div>
                  </a>

                  {isOpen && (
                    <>
                      {/* UNMATCHED */}
                      {hasUnmatched && (
                        <>
                          <div className={styles["unmatch-wrapper"]}>
                            <div className={styles["unmatch-heading-wrapper"]}>
                              <div className={styles.count}>
                                {marketUnmatchedLen > 9
                                  ? String(marketUnmatchedLen)
                                  : `0${marketUnmatchedLen}`}
                              </div>
                              <div>Unmatched</div>
                            </div>

                            <a
                              className={styles.Cancel}
                              onClick={() => cancelBetsAllUnmatchedBetsByMarket(market.marketId)}
                            >
                              Cancel All
                            </a>
                          </div>

                          {(market.unmatched || []).map((item, i) => {
                            const detailKey = `${market.marketId}-unmatched-${item?.betId || i}`;

                            return (
                              <div
                                key={item?.betId || detailKey}
                                className={`${styles["unmatch-wrapper"]} ${
                                  item.side === "LAY"
                                    ? styles["market-lay-border"]
                                    : styles["market-back-border"]
                                }`}
                              >
                                <div
                                  onClick={() => toggleDetails(detailKey)}
                                  className="w-full"
                                >
                                  <div className={styles["market-icon-wrapper"]}>
                                    <span
                                      className={`fa fa-chevron-down ${styles["market-icon"]} ${
                                        styles.transition
                                      } ${
                                        isDetailsOpen[detailKey] ? styles["rotate-arrow"] : ""
                                      }`}
                                    ></span>

                                    <div className={styles["unmatch-market"]}>
                                      <div
                                        className={`${styles["market-name"]} ${
                                          item.side === "LAY" ? styles["Lay-clr"] : styles["back-clr"]
                                        }`}
                                      >
                                        {item?.side} {item?.selectionName}
                                      </div>
                                      <div className={styles["market-price"]}>
                                        for <span>${item?.requestedPrice}</span> @{" "}
                                        <span>{item?.requestedSize}</span>
                                      </div>
                                    </div>

                                    <a
                                      className={`${styles.Cancel} ${styles.cancelPosition}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        cancelSingleBet(item);
                                      }}
                                    >
                                      Cancel
                                    </a>
                                  </div>

                                  {isDetailsOpen[detailKey] ? (
                                    <div className={`${styles["market-detail"]} mt-3`}>
                                      <div>
                                        Placed: <span>{formatDateTime(item?.placedDate)}</span>
                                      </div>
                                      <div>
                                        Ref: <span>{item?.betId}</span>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}

                      {hasUnmatched && hasMatched ? <hr className={styles.hr} /> : null}

                      {/* MATCHED */}
                      {hasMatched && (
                        <>
                          <div className={`${styles["unmatch-wrapper"]} ${styles["mt-1"]}`}>
                            <div className={styles["unmatch-heading-wrapper"]}>
                              <div className={`${styles.count} ${styles["matched-count"]}`}>
                                {marketMatchedCount > 9
                                  ? String(marketMatchedCount)
                                  : `0${marketMatchedCount}`}
                              </div>
                              <div>Matched</div>
                            </div>

                            <div className={styles["check-box-wrapper"]}>
                              <div>Average Odds</div>
                              <div className={styles["form-check"]}>
                                <input
                                  className={styles["form-check-input"]}
                                  type="checkbox"
                                  checked={!isRaw}
                                  onChange={() =>
                                    setIsRawByMarket((prev) => ({
                                      ...prev,
                                      [market.marketId]: !(prev?.[market.marketId] ?? true),
                                    }))
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {/* LAY first */}
                          {(matchedView?.LAY || []).map((item: any, i: number) => {
                            const detailKey = `${market.marketId}-${i}-lay`;

                            return (
                              <div
                                key={item?.betId || detailKey}
                                className={`${styles["unmatch-wrapper"]} ${
                                  item.side === "LAY"
                                    ? styles["market-lay-border"]
                                    : styles["market-back-border"]
                                }`}
                              >
                                <div
                                  onClick={() => {
                                    if (!isRaw) return; // ✅ avg mode -> no details/arrow
                                    toggleDetails(detailKey);
                                  }}
                                >
                                  <div className={styles["market-icon-wrapper"]}>
                                    {isRaw ? (
                                      <span
                                        className={`fa fa-chevron-down ${styles["market-icon"]} ${
                                          styles.transition
                                        } ${
                                          isDetailsOpen[detailKey] ? styles["rotate-arrow"] : ""
                                        }`}
                                      ></span>
                                    ) : null}

                                    <div className={styles["unmatch-market"]}>
                                      <div
                                        className={`${styles["market-name"]} ${
                                          item.side === "LAY"
                                            ? styles["Lay-clr"]
                                            : styles["back-clr"]
                                        }`}
                                      >
                                        {item?.side} {item?.selectionName}
                                      </div>

                                      <div className={styles["market-price"]}>
                                        for{" "}
                                        <span>${isRaw ? item?.requestedPrice : item?.avgOdd}</span>{" "}
                                        @{" "}
                                        <span>{isRaw ? item?.requestedSize : item?.totalSize}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {isRaw && isDetailsOpen[detailKey] ? (
                                    <div className={`${styles["market-detail"]} mt-3`}>
                                      <div>
                                        Placed: <span>{formatDateTime(item?.placedDate)}</span>
                                      </div>
                                      <div>
                                        Matched: <span>{formatDateTime(item?.matchedDate)}</span>
                                      </div>
                                      <div>
                                        Ref: <span>{item?.betId}</span>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}

                          {/* BACK */}
                          {(matchedView?.BACK || []).map((item: any, i: number) => {
                            const detailKey = `${market.marketId}-${i}-back`;

                            return (
                              <div
                                key={item?.betId || detailKey}
                                className={`${styles["unmatch-wrapper"]} ${
                                  item.side === "LAY"
                                    ? styles["market-lay-border"]
                                    : styles["market-back-border"]
                                }`}
                              >
                                <div
                                  onClick={() => {
                                    if (!isRaw) return; // ✅ avg mode -> no details/arrow
                                    toggleDetails(detailKey);
                                  }}
                                >
                                  <div className={styles["market-icon-wrapper"]}>
                                    {isRaw ? (
                                      <span
                                        className={`fa fa-chevron-down ${styles["market-icon"]} ${
                                          styles.transition
                                        } ${
                                          isDetailsOpen[detailKey] ? styles["rotate-arrow"] : ""
                                        }`}
                                      ></span>
                                    ) : null}

                                    <div className={styles["unmatch-market"]}>
                                      <div
                                        className={`${styles["market-name"]} ${
                                          item.side === "LAY"
                                            ? styles["Lay-clr"]
                                            : styles["back-clr"]
                                        }`}
                                      >
                                        {item?.side} {item?.selectionName}
                                      </div>

                                      <div className={styles["market-price"]}>
                                        for{" "}
                                        <span>${isRaw ? item?.requestedPrice : item?.avgOdd}</span>{" "}
                                        @{" "}
                                        <span>{isRaw ? item?.requestedSize : item?.totalSize}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {isRaw && isDetailsOpen[detailKey] ? (
                                    <div className={`${styles["market-detail"]} mt-3`}>
                                      <div>
                                        Placed: <span>{formatDateTime(item?.placedDate)}</span>
                                      </div>
                                      <div>
                                        Matched: <span>{formatDateTime(item?.matchedDate)}</span>
                                      </div>
                                      <div>
                                        Ref: <span>{item?.betId}</span>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            {/* View Market button (same) */}
{onViewMarket ? (
<a className={styles.viewMarketRow} onClick={onViewMarket}>
  <span className={styles.viewMarketText}>View Market</span>
</a>
) : null}
          </div>
        </div>
      </nav>
    </div>
  );
}