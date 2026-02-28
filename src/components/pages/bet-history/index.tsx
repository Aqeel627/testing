"use client";

import BreadCrumb from "@/components/common/bread-crumb";
import http from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import "./style.css";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/common/toast/toast-context";
import { splitMsg } from "@/lib/functions";

function getStartDate(dateStr: string): string {
  if (!dateStr) return "";
  return `${dateStr} 00:00:00`;
}

function getEndDate(dateStr: string): string {
  if (!dateStr) return "";
  return `${dateStr} 23:59:59`;
}

function formatDate(dateStr: string | undefined, fmt: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const pad = (n: number) => String(n).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  if (fmt === "dd-MMM-yy HH:mm:ss") {
    return `${pad(d.getDate())}-${months[d.getMonth()]}-${String(d.getFullYear()).slice(-2)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  if (fmt === "dd-MMM-yy") {
    return `${pad(d.getDate())}-${months[d.getMonth()]}-${String(d.getFullYear()).slice(-2)}`;
  }
  return dateStr;
}

function formatNumber(
  val: number | string | undefined,
  minInt = 1,
  minFrac = 0,
  maxFrac = 2,
): string {
  const n = Number(val);
  if (isNaN(n)) return String(val ?? "--");
  return n.toLocaleString("en-US", {
    minimumIntegerDigits: minInt,
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  });
}

function todayISO(): string {
  return new Date().toISOString().substring(0, 10);
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().substring(0, 10);
}

function detectOS(): string {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  return "Other";
}

function PLCell({ betTypeStatus, item }: any) {
  if (betTypeStatus === "UNMATCHED")
    return <span className="muted">Not Settled</span>;

  if (betTypeStatus === "MATCHED") {
    const profit = Number(item.profit);
    const loss = Number(item.loss);
    return (
      <b>
        <span className={profit > 0 ? "pl-pos" : "pl-neg"}>
          {formatNumber(profit, 1, 0, 2)}
        </span>{" "}
        <span className={loss > 0 ? "pl-pos" : "pl-neg"}>
          ({formatNumber(loss, 1, 0, 2)})
        </span>
      </b>
    );
  }

  if (item.profitLoss === "0" || item.profitLoss === 0)
    return <span className="muted">--</span>;

  return (
    <span className={Number(item.profitLoss) > 0 ? "pl-pos" : "pl-neg"}>
      <b>{formatNumber(item.profitLoss, 1, 0, 2)}</b>
    </span>
  );
}

function StakeCell({ betTypeStatus, item }: any) {
  if (betTypeStatus === "UNMATCHED") {
    return item.totalSizeRemaining ? (
      <b className="text-(--primary-text-color)">
        {formatNumber(item.totalSizeRemaining, 1, 2, 2)}
      </b>
    ) : (
      <span className="muted">--</span>
    );
  }
  if (betTypeStatus === "CANCELLED") {
    return item.totalSizeCancelled ? (
      <b className="text-(--primary-text-color)">
        {formatNumber(item.totalSizeCancelled, 1, 2, 2)}
      </b>
    ) : (
      <span className="muted">--</span>
    );
  }
  if (betTypeStatus === "LAPSED") {
    return item.totalSizeLapsed ? (
      <b className="text-(--primary-text-color)">
        {formatNumber(item.totalSizeLapsed, 1, 2, 2)}
      </b>
    ) : (
      <span className="muted">--</span>
    );
  }
  return item.totalSizeMatched ? (
    <b className="text-(--primary-text-color)">
      {formatNumber(item.totalSizeMatched, 1, 2, 2)}
    </b>
  ) : (
    <span className="muted">--</span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BetHistoryComponent() {
  const LIMIT = 25;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(1);
  const [endIndex, setEndIndex] = useState<number>(0);
  const [jumptoPage, setJumptoPage] = useState<string>("");
  const [reportType, setReportType] = useState<string>("EXCHANGE");
  const [betStatus, setBetStatus] = useState<string>("UNMATCHED");
  const [betTypeStatus, setBetTypeStatus] = useState<string>("UNMATCHED");
  const [startDate, setStartDate] = useState<string>(daysAgoISO(10));
  const [endDate, setEndDate] = useState<string>(todayISO());
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [apiCalled, setApiCalled] = useState<boolean>(false);
  const [toast, setToast] = useState<any>(null);
  const { showToast } = useToast();

  const os = detectOS();

  const getBetHistoryUser = useCallback(
    async (page?: number) => {
      setApiCalled(false);
      const payload: any = {
        startDate: getStartDate(startDate),
        endDate: getEndDate(endDate),
        exchangeType: reportType,
        betStatus: betStatus,
        page: page ?? currentPage,
        limit: LIMIT,
      };

      setIsLoader(true);
      try {
        const result: any = await http.post(CONFIG.userBetList, payload);
        const resp = result?.data;
        setIsLoader(false);

        if (resp?.data) {
          const msg = splitMsg(resp?.meta?.message);
          showToast(msg.status, msg.title, msg.desc);
          setApiCalled(true);
          setBetTypeStatus(betStatus);
          if (betStatus === "MATCHED") {
            const data = resp?.data?.map((obj: any) => {
              const profitStr = String(obj?.profitLoss ?? "");
              const profit = profitStr.split("(")[0];
              const lossMatch = profitStr.match(/\((.*?)\)/);
              const loss = lossMatch ? lossMatch[1] : "";
              return { ...obj, profit, loss };
            });
            setHistoryList(data);
          } else {
            setHistoryList(resp?.data);
          }

          setTotalRecords(resp.total || 0);
          setTotalPages(resp.totalPages);
          setCurrentPage(resp.currentPage);

          const si = (resp.currentPage - 1) * LIMIT + 1;
          const ei = Math.min(si + resp?.data?.length - 1, resp?.total || 0);
          setStartIndex(si);
          setEndIndex(ei);
        }
      } catch {
        setIsLoader(false);
      }
    },
    [startDate, endDate, reportType, betStatus, currentPage],
  );

  useEffect(() => {
    getBetHistoryUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Pagination helpers
  const goToFirst = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      getBetHistoryUser(1);
    }
  };
  const goToPrevious = () => {
    if (currentPage > 1) {
      const p = currentPage - 1;
      setCurrentPage(p);
      getBetHistoryUser(p);
    }
  };
  const goToNext = () => {
    if (currentPage < totalPages) {
      const p = currentPage + 1;
      setCurrentPage(p);
      getBetHistoryUser(p);
    }
  };
  const goToLast = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      getBetHistoryUser(totalPages);
    }
  };

  const jumpPage = () => {
    const p = Number(jumptoPage);
    if (jumptoPage !== "" && p >= 1 && p <= totalPages) {
      getBetHistoryUser(p);
    }
  };

  const gotoEvent = (item: any) => {
    if (reportType === "EXCHANGE" && item.event && item.eventType) {
      window.location.href = `/market-details/${item.event.id}/${item.eventType.id}`;
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
        <div className="my-4">
      <BreadCrumb title="My Bets" />
</div>
      <div className="bh-container">
        {/* Toast */}
        {toast && (
          <div className={`bh-toast bh-toast--${toast.type}`}>{toast.msg}</div>
        )}
        {/* Filters */}
        <div className="bh-filter">
          <div className="bh-filter-row">
            <div className="bh-filter-col">
              <select
                className="select bh-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="" disabled hidden>
                  Select
                </option>
                <option value="EXCHANGE">EXCHANGE</option>
                <option value="CASINO">CASINO</option>
              </select>
            </div>

            <div className="bh-filter-col">
              <select
                className="select bh-select"
                value={betStatus}
                onChange={(e) => setBetStatus(e.target.value)}
              >
                <option value="" disabled hidden>
                  Select
                </option>
                <option value="UNMATCHED">UNMATCHED</option>
                <option value="MATCHED">MATCHED</option>
                <option value="SETTLED">SETTLED</option>
                <option value="VOID">VOID</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="VOIDED - OPEN MARKETS">
                  VOIDED - OPEN MARKETS
                </option>
                <option value="VOIDED - CLOSED MARKETS">
                  VOIDED - CLOSED MARKETS
                </option>
                <option value="LAPSED">LAPSED</option>
                <option value="SP PLACED">SP PLACED</option>
              </select>
            </div>

            <div className="bh-filter-col">
              <input
                type="date"
                className={`input bh-date-input${os === "Android" ? " android" : ""}`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="bh-filter-col">
              <input
                type="date"
                className={`input bh-date-input${os === "Android" ? " android" : ""}`}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="bh-filter-col">
              <button
                className="bh-submit-btn"
                onClick={() => getBetHistoryUser()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Loader */}
        {isLoader && (
          <div className="bh-loader">
            <span className="bh-spinner" />
          </div>
        )}

        {/* Results */}
        {historyList.length > 0 && apiCalled && (
          <>
            {/* Desktop Table */}
            <div className="bh-desktop-only bh-table-wrap">
              <table className="bh-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Bid Type</th>
                    <th>Odds Req.</th>
                    <th>Stake</th>
                    {betTypeStatus !== "UNMATCHED" && <th>Liability</th>}
                    <th>Avg. Odds</th>
                    <th>P&amp;L</th>
                    {betTypeStatus === "CANCELLED" && <th>Cancelled</th>}
                    {betTypeStatus === "SETTLED" && <th>Settled</th>}
                    {betTypeStatus === "LAPSED" && <th>Lapsed</th>}
                  </tr>
                </thead>
                <tbody>
                  {historyList.map((item, i) => (
                    <tr key={i}>
                      {/* Description */}
                      <td
                        className={`cell-desc ${item.bidType === "LAY" ? "lay-border" : "back-border"}`}
                      >
                        <div className="desc-title">
                          <a href="#!" onClick={(e) => e.preventDefault()}>
                            {item?.event?.name}
                          </a>
                        </div>
                        <div className="desc-sub">
                          <b>{item?.selectionName}</b>
                          <span className="dot">•</span> {item?.marketId}{" "}
                          <span className="pipe">|</span>
                          <span className="desc-meta">
                            Bet ID: {item?.betId || "—"}
                            <span className="pipe">|</span>
                            Placed:{" "}
                            {formatDate(item?.placeDate, "dd-MMM-yy HH:mm:ss")}
                            {item.matchedDate && (
                              <>
                                <span className="pipe">|</span> Matched:{" "}
                                {formatDate(
                                  item?.matchedDate,
                                  "dd-MMM-yy HH:mm:ss",
                                )}
                              </>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Bid Type */}
                      <td
                        className={
                          item.bidType === "LAY" ? "type-lay" : "type-back"
                        }
                      >
                        {item.bidType}
                      </td>

                      {/* Odds Req */}
                      <td>{formatNumber(item.requestedPrice, 1, 2, 2)}</td>

                      {/* Stake */}
                      <td>
                        <StakeCell betTypeStatus={betTypeStatus} item={item} />
                      </td>

                      {/* Liability */}
                      {betTypeStatus !== "UNMATCHED" && (
                        <td>
                          {item.liability ? (
                            <b className="pl-neg">
                              {formatNumber(item.liability, 1, 2, 2)}
                            </b>
                          ) : (
                            <span className="muted">--</span>
                          )}
                        </td>
                      )}

                      {/* Avg Odds */}
                      <td>
                        {betTypeStatus === "UNMATCHED" ? (
                          <span>UnMatched</span>
                        ) : (
                          formatNumber(item.averagePrice, 1, 0, 2)
                        )}
                      </td>

                      {/* P&L */}
                      <td>
                        <PLCell betTypeStatus={betTypeStatus} item={item} />
                      </td>

                      {/* Date columns */}
                      {betTypeStatus === "CANCELLED" && (
                        <td className="cell-time">
                          {formatDate(item.cancelledDate, "dd-MMM-yy HH:mm:ss")}
                        </td>
                      )}
                      {betTypeStatus === "LAPSED" && (
                        <td className="cell-time">
                          {formatDate(item.lapsedDate, "dd-MMM-yy HH:mm:ss")}
                        </td>
                      )}
                      {betTypeStatus === "SETTLED" && (
                        <td className="cell-time">
                          {formatDate(item.settledDate, "dd-MMM-yy HH:mm:ss")}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                {historyList.length === 0 && (
                  <tfoot>
                    <tr>
                      <td
                        colSpan={7}
                        className="bg-empty"
                        style={{ textAlign: "center" }}
                      >
                        No data!
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="bh-mobile-only">
              {historyList.map((item, i) => (
                <div
                  key={i}
                  className={`bet-card ${item.bidType === "LAY" ? "lay" : "back"}`}
                >
                  <div className="card-body">
                    {/* Description */}
                    <div className="card-row flex-col">
                      <div className="fw-bold">Description</div>
                      {betTypeStatus === "UNMATCHED" ? (
                        <div className="edit-text">
                          <b>
                            <a
                              href="#!"
                              onClick={(e) => {
                                e.preventDefault();
                                gotoEvent(item);
                              }}
                            >
                              {item?.event?.name}&nbsp;- Edit
                            </a>
                          </b>
                        </div>
                      ) : (
                        <div className="edit-text">
                          <b>{item?.event?.name}</b>
                        </div>
                      )}
                      <div className="text-(--primary-text-color)">
                        <b>{item?.selectionName}</b> -{" "}
                        <span>{item?.marketId}</span>
                      </div>
                      <div>Bet ID: {item?.betId || "—"}</div>
                      <div>
                        Placed:{" "}
                        {formatDate(item?.placeDate, "dd-MMM-yy HH:mm:ss")}
                      </div>
                      {betTypeStatus !== "UNMATCHED" && item.matchedDate && (
                        <div>
                          Matched:{" "}
                          {formatDate(item?.matchedDate, "dd-MMM-yy HH:mm:ss")}
                        </div>
                      )}
                    </div>

                    {/* Bid Type */}
                    <div className="card-row">
                      <div className="fw-bold">Bid Type</div>
                      <div
                        className={
                          item.bidType === "LAY" ? "type-lay" : "type-back"
                        }
                      >
                        {item.bidType}
                      </div>
                    </div>

                    {/* Odds */}
                    <div className="card-row">
                      <div className="fw-bold">
                        {betTypeStatus === "UNMATCHED" ? "Odds Req." : "Odds"}
                      </div>
                      <div className="text-(--primary-text-color)">
                        {formatNumber(item.requestedPrice, 1, 2, 2)}
                      </div>
                    </div>

                    {/* Stake */}
                    <div className="card-row">
                      <div className="fw-bold">Stake</div>
                      <StakeCell betTypeStatus={betTypeStatus} item={item} />
                    </div>

                    {/* Liability */}
                    <div className="card-row">
                      <div className="fw-bold">Liability</div>
                      {(betTypeStatus === "UNMATCHED" ||
                        betTypeStatus === "MATCHED") && (
                        <div className="pl-neg fw-bold">
                          {formatNumber(item.liability, 1, 2, 2)}
                        </div>
                      )}
                      {(betTypeStatus === "SETTLED" ||
                        betTypeStatus === "CANCELLED" ||
                        betTypeStatus === "LAPSED") && (
                        <div className="pl-neg fw-bold">
                          {item.liability ? (
                            formatNumber(item.liability, 1, 0, 2)
                          ) : (
                            <span className="muted">--</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Potential Profit */}
                    {betTypeStatus !== "SETTLED" &&
                      betTypeStatus !== "CANCELLED" &&
                      betTypeStatus !== "MATCHED" && (
                        <div className="card-row">
                          <div className="fw-bold">Potential Profit</div>
                          <div className="pl-pos fw-bold">
                            {betTypeStatus === "UNMATCHED" &&
                              (item.bidType === "LAY"
                                ? item.totalSizeRemaining
                                : formatNumber(
                                    ((item.requestedPrice ?? 0) - 1) *
                                      (item.totalSizeRemaining ?? 0),
                                    1,
                                    0,
                                    2,
                                  ))}
                            {betTypeStatus === "LAPSED" &&
                              (item.bidType === "LAY"
                                ? item.totalSizeLapsed
                                : formatNumber(
                                    ((item.requestedPrice ?? 0) - 1) *
                                      (item.totalSizeLapsed ?? 0),
                                    1,
                                    0,
                                    2,
                                  ))}
                          </div>
                        </div>
                      )}

                    {/* P&L */}
                    {betTypeStatus !== "UNMATCHED" && (
                      <div className="card-row">
                        <div className="fw-bold">P&amp;L</div>
                        <PLCell betTypeStatus={betTypeStatus} item={item} />
                      </div>
                    )}

                    {/* Date rows */}
                    {betTypeStatus === "SETTLED" && (
                      <div className="card-row">
                        <div className="fw-bold">Settled</div>
                        <div>
                          {item.settledDate ? (
                            formatDate(item.settledDate, "dd-MMM-yy HH:mm:ss")
                          ) : (
                            <span className="muted">--</span>
                          )}
                        </div>
                      </div>
                    )}
                    {betTypeStatus === "CANCELLED" && (
                      <div className="card-row">
                        <div className="fw-bold">Cancelled</div>
                        <div>
                          {item.cancelledDate ? (
                            formatDate(item.cancelledDate, "dd-MMM-yy HH:mm:ss")
                          ) : (
                            <span className="muted">--</span>
                          )}
                        </div>
                      </div>
                    )}
                    {betTypeStatus === "LAPSED" && (
                      <div className="card-row">
                        <div className="fw-bold">Lapsed</div>
                        <div>
                          {item.lapsedDate ? (
                            formatDate(item.lapsedDate, "dd-MMM-yy HH:mm:ss")
                          ) : (
                            <span className="muted">--</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status */}
                    <div className="card-row">
                      <div className="fw-bold">Status</div>
                      <div>
                        {betTypeStatus === "UNMATCHED" && (
                          <span className="text-(--primary-text-color)">
                            Unmatched
                          </span>
                        )}
                        {betTypeStatus === "MATCHED" && (
                          <span className="text-(--primary-text-color)">
                            Matched
                          </span>
                        )}
                        {betTypeStatus === "SETTLED" &&
                          (item.profitLoss == 0 ? (
                            <span className="muted">--</span>
                          ) : (
                            <span
                              className={
                                Number(item.profitLoss) > 0
                                  ? "pl-pos"
                                  : "pl-neg"
                              }
                            >
                              <b>
                                {Number(item.profitLoss) > 0 ? "Won" : "Lost"}
                              </b>
                            </span>
                          ))}
                        {betTypeStatus === "CANCELLED" && (
                          <span>Cancelled</span>
                        )}
                        {betTypeStatus === "LAPSED" && <span>Lapsed</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="bh-pagination-container">
              {/* Mobile buttons */}
              <div className="bh-mobile-only bh-pg-buttons w-full">
                <button
                  className={`pg-btn${currentPage === 1 ? " disabled" : ""}`}
                  onClick={goToFirst}
                >
                  First
                </button>
                <button
                  className={`pg-btn${currentPage === 1 ? " disabled" : ""}`}
                  onClick={goToPrevious}
                >
                  Previous
                </button>
                <span className="pg-number active">{currentPage}</span>
                <button
                  className={`pg-btn${currentPage === totalPages ? " disabled" : ""}`}
                  onClick={goToNext}
                >
                  Next
                </button>
                <button
                  className={`pg-btn${currentPage === totalPages ? " disabled" : ""}`}
                  onClick={goToLast}
                >
                  Last
                </button>
              </div>

              {/* Desktop jump */}
              <div className="bh-desktop-only bh-jump">
                <span className="jumptext">Jump to page</span>
                <input
                  className="input bh-jump-input"
                  value={jumptoPage}
                  onChange={(e) => setJumptoPage(e.target.value)}
                />
                <button className="bh-jump-go-btn" onClick={jumpPage}>
                  Go
                </button>
              </div>

              {/* Entries + mobile jump */}
              <div className="bh-entries-text">
                <div className="bh-mobile-only bh-jump">
                  <span className="jumptext">Jump to page</span>
                  <input
                    className="input bh-jump-input"
                    value={jumptoPage}
                    onChange={(e) => setJumptoPage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && jumpPage()}
                  />
                  <button
                    className="bh-jump-go-btn"
                    onClick={jumpPage}
                    disabled={!jumptoPage}
                  >
                    Go
                  </button>
                </div>
                <span>
                  Showing {startIndex} to {endIndex} of {totalRecords} entries
                </span>
              </div>

              {/* Desktop buttons */}
              <div className="bh-desktop-only bh-pg-buttons">
                <button
                  className={`pg-btn${currentPage === 1 ? " disabled" : ""}`}
                  onClick={goToFirst}
                >
                  First
                </button>
                <button
                  className={`pg-btn${currentPage === 1 ? " disabled" : ""}`}
                  onClick={goToPrevious}
                >
                  Previous
                </button>
                <span className="pg-number active">{currentPage}</span>
                <button
                  className={`pg-btn${currentPage === totalPages ? " disabled" : ""}`}
                  onClick={goToNext}
                >
                  Next
                </button>
                <button
                  className={`pg-btn${currentPage === totalPages ? " disabled" : ""}`}
                  onClick={goToLast}
                >
                  Last
                </button>
              </div>
            </div>
          </>
        )}

        {/* No data */}
        {historyList.length === 0 && apiCalled && (
          <div className="bh-no-data">
            You have no bets in this time period.
          </div>
        )}
      </div>
    </>
  );
}
