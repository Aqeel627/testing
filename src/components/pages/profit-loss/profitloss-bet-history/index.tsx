"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { useAuthStore } from "@/lib/useAuthStore";
import http from "@/lib/axios-instance";
import BreadCrumb from "@/components/common/bread-crumb";
import "./../profit-loss-page/style.css";

// Types define kar di hain
interface BetHistoryItem {
  eventType: { name: string };
  event: { name: string };
  marketId: string;
  selectionName: string;
  bidType: "BACK" | "LAY";
  averagePrice: number;
  requestedPrice?: number;
  totalSizeMatched: number;
  profitLoss: number;
  placeDate: string;
  matchedDate: string;
}

const ProfitLossBetHostory: React.FC = () => {
  const params = useParams();
  const { token } = useAuthStore();

  // States
  const [historyList, setHistoryList] = useState<BetHistoryItem[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(10);
  const [jumptoPage, setJumptoPage] = useState("");

  // Route Params
  const sportsId = params.sportId;
  const marketId = params.marketId;

  const getHistory = useCallback(
    async (page?: number) => {
      if (!marketId || !token) return;

      setIsLoader(true);
      const activePage = page || currentPage;
      const limit = 25;

      const payload = {
        marketId: marketId,
        page: activePage,
        limit: limit,
      };

      try {
        const resp = await http.post(CONFIG.getUserBetList, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const responseData = resp.data;
        if (responseData?.data) {
          setHistoryList(responseData.data);
          setTotalRecords(responseData.total || 0);
          setTotalPages(Math.ceil((responseData.total || 0) / limit));
          setCurrentPage(responseData.currentPage || activePage);

          const sIdx = (responseData.currentPage - 1) * limit + 1;
          setStartIndex(sIdx);
          setEndIndex(
            Math.min(
              sIdx + responseData.data.length - 1,
              responseData.total || 0,
            ),
          );
        }
      } catch (error: any) {
        console.error(
          "❌ Error fetching Bet History:",
          error.response?.data || error.message,
        );
      } finally {
        setIsLoader(false);
      }
    },
    [marketId, token, currentPage],
  );

  useEffect(() => {
    getHistory();
  }, [getHistory]);

  // Formatting helpers
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr)
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(",", "");
  };

  // Pagination Handlers
  const JumpPage = () => {
    const p = parseInt(jumptoPage);
    if (p > 0 && p <= totalPages) {
      setCurrentPage(p);
      getHistory(p);
    }
  };

  const goToFirst = () => {
    if (currentPage !== 1) getHistory(1);
  };
  const goToLast = () => {
    if (currentPage !== totalPages) getHistory(totalPages);
  };
  const goToNext = () => {
    if (currentPage < totalPages) getHistory(currentPage + 1);
  };
  const goToPrevious = () => {
    if (currentPage > 1) getHistory(currentPage - 1);
  };

  return (
    <div id="profitloss-bet-history.tsx">
      <div className="container-fluid">
        {/* Header Section */}
        {/* <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-t border-dashed border-(--dotted-line)"></div>
                    <span className="px-4 text-[var(--palette-text-primary)] font-bold text-[16px] whitespace-nowrap uppercase">
                        Bet History
                    </span>
                    <div className="flex-grow border-t border-t border-dashed border-(--dotted-line)"></div>
                </div> */}

        <div className="my-4">
          <BreadCrumb title="Bet History" />
        </div>

        {/* Indicators (Back/Lay/Void) */}
        <div className="flex justify-end w-full mb-2 gap-1">
          <div className="bg-[var(--back-bg)] border border-[var(--back-border)] px-2 py-[6.9px] text-[11px] rounded-[0.25rem] font-semibold text-[var(--back-price-text)] hover:bg-[var(--back-hover)]">
            Back
          </div>
          <div className=" border border-(--lay-border)! bg-[var(--lay-bg)] hover:bg-[var(--lay-hover)] rounded-[0.25rem] px-2 py-1 text-[11px] font-semibold text-[var(--lay-price-text)] py-[6.9px]">
            Lay
          </div>
          <div className="bg-transparent border border-(--primary-color) px-2 py-1 text-[11px] font-semibold rounded-[0.25rem] text-(--primary-color) py-[6.9px]">
            Void
          </div>
        </div>

        {/* Table Section */}
        <div className="bh-table-wrap mt-2">
          <table className="bh-table">
            <thead>
              <tr>
                <th>Sport Name</th>
                <th>Event Name</th>
                <th>Market Name</th>
                <th>Selection Name</th>
                <th>Bet Type</th>
                <th>User Price</th>
                <th>Amount</th>
                <th>Profit/Loss</th>
                <th>Place Date</th>
                <th>Match Date</th>
              </tr>
            </thead>

            <tbody>
              {isLoader ? (
                <tr>
                  <td colSpan={10} className="p-4  text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : historyList.length > 0 ? (
                historyList.map((history, index) => (
                  <tr
                    key={index}
                    className="text-center"
                  >
                    <td className={`${history.bidType === "LAY" ? "lay-border" : "back-border"}`}>
                      {history.eventType?.name}
                    </td>
                    <td className="whitespace-nowrap">
                      {history.event?.name}
                    </td>
                    <td className="whitespace-nowrap">
                      {history.marketId}
                    </td>
                    <td className="whitespace-nowrap">
                      {history.selectionName}
                    </td>
                    <td className="whitespace-nowrap font-bold">
                      {history.bidType}
                    </td>
                    <td className="whitespace-nowrap">
                      {Number(history.averagePrice).toFixed(2)}
                      {history.requestedPrice && ` / ${history.requestedPrice}`}
                    </td>
                    <td className="whitespace-nowrap">
                      {history.totalSizeMatched}
                    </td>
                    <td
                      className={`font-bold ${
                        history.profitLoss < 0
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {history.profitLoss}
                    </td>
                    <td className="whitespace-nowrap">
                      {formatDate(history.placeDate)}
                    </td>
                    <td className="whitespace-nowrap">
                      {formatDate(history.matchedDate)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="p-4 text-center bg-[#f1f1f1] text-muted text-[12px]"
                  >
                    No Data Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="bh-pagination-container">
          {/* Mobile buttons - Only visible on mobile */}
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

          {/* Desktop jump - Only visible on desktop */}
          <div className="bh-desktop-only bh-jump">
            <span className="jumptext">Jump to page</span>
            <input
              className="input bh-jump-input h-[32px]"
              id="jump_desk"
              value={jumptoPage}
              onChange={(e) => setJumptoPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && JumpPage()}
            />
            <button className="bh-jump-go-btn h-[32px]" onClick={JumpPage}>
              Go
            </button>
          </div>

          {/* Entries text + mobile jump logic */}
          <div className="bh-entries-text">
            <div className="bh-mobile-only bh-jump">
              <span className="jumptext">Jump to page</span>
              <input
                className="input bh-jump-input"
                value={jumptoPage}
                id="jump_mbl"
                onChange={(e) => setJumptoPage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && JumpPage()}
              />
              <button
                className="bh-jump-go-btn"
                onClick={JumpPage}
                disabled={!jumptoPage}
              >
                Go
              </button>
            </div>
            <span>
              Showing {startIndex} to {endIndex} of {totalRecords} entries
            </span>
          </div>

          {/* Desktop buttons - Only visible on desktop */}
          <div className="bh-desktop-only bh-pg-buttons h-[32px]">
            <button
              className={`pg-btn${currentPage === 1 ? " disabled" : ""} h-[32px]`}
              onClick={goToFirst}
            >
              First
            </button>
            <button
              className={`pg-btn${currentPage === 1 ? " disabled" : ""} h-[32px]`}
              onClick={goToPrevious}
            >
              Previous
            </button>
            <span className="pg-number active h-[32px]">{currentPage}</span>
            <button
              className={`pg-btn${currentPage === totalPages ? " disabled" : ""} h-[32px]`}
              onClick={goToNext}
            >
              Next
            </button>
            <button
              className={`pg-btn${currentPage === totalPages ? " disabled" : ""} h-[32px]`}
              onClick={goToLast}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossBetHostory;
