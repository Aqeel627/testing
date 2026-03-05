"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CONFIG } from "@/lib/config";
import { useAuthStore } from "@/lib/useAuthStore";
import http from "@/lib/axios-instance";
import BreadCrumb from "@/components/common/bread-crumb";
import "./../profit-loss-page/style.css";

interface MarketProfitItem {
  eventType: { id: string | number; name: string };
  event: { name: string };
  marketId: string;
  marketName: string;
  result: string;
  pl: number;
  commission: number;
  createdAt: string;
}

const ProfitLossMarketPage: React.FC = () => {
  const params = useParams();
  const { token } = useAuthStore();

  const [isLoader, setIsLoader] = useState(false);
  const [profitLossData, setProfitLossData] = useState<MarketProfitItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(10);
  const [jumptoPage, setJumptoPage] = useState("");
  const eventId = params.id || params.eventId;
  const _sportId = params.sportId;

  const profitLossByMarket = async (page?: number) => {
    if (!_sportId || !token) return;

    setIsLoader(true);
    const activePage = page || currentPage;
    const limit = 25;

    const payload = {
      eventId: _sportId,
      page: activePage,
      limit: limit,
    };

    try {
      const resp = await http.post(CONFIG.ProfitLossMarketNew, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("✅ Market P&L Raw Response:", resp.data);

      const responseData = resp.data;
      const actualData = responseData?.data;

      if (actualData && Array.isArray(actualData)) {
        console.log("📊 Array of Items:", actualData); // Sirf table ka data log karein
        setProfitLossData(actualData);
        setTotalRecords(responseData.total || 0);
        setTotalPages(responseData.totalPages || 1);

        const sIdx = (responseData.currentPage - 1) * limit + 1;
        setStartIndex(sIdx);
        setEndIndex(
          Math.min(sIdx + actualData.length - 1, responseData.total || 0),
        );
      }
    } catch (error: any) {
      console.error("❌ API Error Log:", error.response?.data || error.message);
    } finally {
      setIsLoader(false);
    }
  };

  useEffect(() => {
    profitLossByMarket();
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB").replace(",", "");
  };

  // Pagination Handlers
  const JumpPage = () => {
    const p = parseInt(jumptoPage);
    if (p > 0 && p <= totalPages) {
      setCurrentPage(p);
      profitLossByMarket(p);
    }
  };

  const goToFirst = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      profitLossByMarket(1);
    }
  };
  const goToLast = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      profitLossByMarket(totalPages);
    }
  };
  const goToNext = () => {
    if (currentPage < totalPages) {
      const p = currentPage + 1;
      setCurrentPage(p);
      profitLossByMarket(p);
    }
  };
  const goToPrevious = () => {
    if (currentPage > 1) {
      const p = currentPage - 1;
      setCurrentPage(p);
      profitLossByMarket(p);
    }
  };

  return (
    <div id="profitloss-market-page.tsx">
      <div className="container-fluid">
        {/* <div className="flex items-center my-4">
        <div className="flex-grow border-t border-dashed border-(--dotted-line)"></div>
        <span className="px-4 text-[var(--palette-text-primary)] font-bold text-[16px] whitespace-nowrap uppercase">
          Profit Loss Markets
        </span>
        <div className="flex-grow border-t border-dashed border-(--dotted-line)"></div>
      </div> */}
        <div className="my-4">
          <BreadCrumb title="Profit Loss Markets" />
        </div>

        <div className="mt-2 bh-table-wrap">
          <table className="bh-table">
            <thead>
              <tr>
                <th>Sport Name</th>
                <th>Event Name</th>
                {_sportId === "66102" && <th>Market Id</th>}
                <th>Market Name</th>
                <th>Result</th>
                <th>Profit/Loss</th>
                <th>Commission</th>
                <th>Settle Time</th>
              </tr>
            </thead>

            <tbody className="">
              {isLoader ? (
                <tr>
                  <td colSpan={_sportId === "66102"?8:7} className="p-4  text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : profitLossData.length > 0 ? (
                profitLossData.map((profit, index) => (
                  <tr
                    key={index}
                    className="text-center"
                  >
                    <td className="whitespace-nowrap">
                      {profit?.eventType?.name}
                    </td>
                    <td className="whitespace-nowrap">
                      {profit?.event?.name}
                    </td>
                    {_sportId === "66102" && (
                      <td className="whitespace-nowrap">
                        {profit?.marketId}
                      </td>
                    )}
                    <td>
                      <Link
                        href={`/d-profit-history/${profit?.eventType?.id}/${profit.marketId}`}
                        className="text-(--primary-color) hover:underline font-bold whitespace-nowrap cursor-pointer"
                      >
                        {profit.marketName}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap">
                      {profit.result}
                    </td>
                    <td
                      className={`font-bold ${profit.pl <= 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {profit.pl.toLocaleString()}
                    </td>
                    <td className="font-bold">
                      {profit.commission.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap">
                      {formatDate(profit.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={_sportId === "66102"?8:7}
                    className="text-center"
                  >
                    No data!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination View */}
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

export default ProfitLossMarketPage;
