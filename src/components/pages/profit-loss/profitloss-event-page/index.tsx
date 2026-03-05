"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { useAuthStore } from "@/lib/useAuthStore";
import http from "@/lib/axios-instance";
import dynamic from "next/dynamic";
import { useToast } from "@/components/common/toast/toast-context"; // ✅ Toast import kiya
import "./../profit-loss-page/style.css";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

// Types define kar di hain
interface ProfitItem {
  eventType: { name: string };
  event: { id: string | number; name: string };
  pl: number;
  commission: number;
}

const ProfitLossEventPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  
  // ✅ Toast hook initialize kiya
  const { showToast } = useToast();

  // ✅ Store se direct 'token' nikalna (userDetail ke andar nahi hai)
  const { token } = useAuthStore();

  // States
  const [profitList, setProfitList] = useState<ProfitItem[]>([]);
  const [isLoader, setIsLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [startIndex, setStartIndex] = useState(1);
  const [endIndex, setEndIndex] = useState(10);
  const [jumptoPage, setJumptoPage] = useState("");

  // ✅ Folder structure [sportId] [fromDate] [toDate] ke mutabiq params
  const sportsId = params.sportId;
  const startDate = params.fromDate;
  const endDate = params.toDate;

  const profitLossByEvent = useCallback(
    async (page?: number) => {
      if (!sportsId || !token) {
        console.warn("⚠️ Aborting: sportsId or Token is missing", {
          sportsId,
          token,
        });
        return;
      }

      setIsLoader(true);
      const activePage = page || currentPage;
      const limit = 25;

      const payload = {
        startDate: startDate,
        endDate: endDate,
        eventTypeId: sportsId,
        page: activePage,
        limit: limit,
      };

      try {
        const resp = await http.post(CONFIG.newProfitLossEventMarket, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        const data = resp.data?.data;
        if (data) {
          setProfitList(data);
          setTotalRecords(resp.data.total || 0);
          setTotalPages(Math.ceil((resp.data.total || 0) / limit) || 1);
          setCurrentPage(resp.data.currentPage || 1);

          const sIdx = ((resp.data.currentPage || 1) - 1) * limit + 1;
          setStartIndex(sIdx);
          setEndIndex(Math.min(sIdx + data.length - 1, resp.data.total || 0));
        }
      } catch (error: any) {
        console.error("❌ API Error:", error.response?.data || error.message);
        setProfitList([]);
        setTotalRecords(0);
        setTotalPages(1);
        setCurrentPage(1);
        setStartIndex(0);
        setEndIndex(0);
      } finally {
        setIsLoader(false);
      }
    },
    [sportsId, startDate, endDate, token, currentPage],
  );

  useEffect(() => {
    // Sirf tabhi call karein jab token aur sportsId mil jayein
    if (token && sportsId) {
      profitLossByEvent(1);
    }
  }, [token, sportsId, profitLossByEvent]);

  // --- Handlers ---
  const JumpPage = () => {
    const p = parseInt(jumptoPage);

    if (jumptoPage === "" || isNaN(p)) return;

    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      profitLossByEvent(p);
      setJumptoPage(""); // ✅ Jump hone ke baad input clear
    } else {
      // ✅ Agar invalid page ho to Toast error
      showToast("error", "Invalid Page", `Please enter a page number between 1 and ${totalPages}.`);
    }
  };

  const goToFirst = () => {
    if (currentPage !== 1) profitLossByEvent(1);
  };
  const goToLast = () => {
    if (currentPage !== totalPages) profitLossByEvent(totalPages);
  };
  const goToNext = () => {
    if (currentPage < totalPages) profitLossByEvent(currentPage + 1);
  };
  const goToPrevious = () => {
    if (currentPage > 1) profitLossByEvent(currentPage - 1);
  };

  const goToEventPL = (eventId: any) => {
    router.push(`/profitloss-market/${eventId}`);
  };

  return (
    <div id="profitloss-event-page.tsx">
      <div className="container-fluid">
        <div className="my-4">
          <BreadCrumb title="Profit Loss Event" />
        </div>

        {/* Table Section */}
        <div className="mt-2 bh-table-wrap">
          <table className="bh-table">
            <thead>
              <tr>
                <th>Sport Name</th>
                <th>Event Name</th>
                <th>Profit/Loss</th>
                <th>Commission</th>
                <th>Total P&L</th>
              </tr>
            </thead>

            <tbody className="">
              {isLoader ? (
                <tr>
                  <td colSpan={5} className="p-4  text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : profitList.length > 0 ? (
                profitList.map((profit, index) => (
                  <tr key={index}>
                    <td className="text-center">{profit.eventType.name}</td>
                    <td className="text-center whitespace-nowrap">
                      <button
                        onClick={() => goToEventPL(profit.event.id)}
                        className="text-(--primary-color) hover:underline font-bold cursor-pointer"
                      >
                        {profit.event.name}
                      </button>
                    </td>
                    <td
                      className={`text-center font-bold ${profit.pl <= 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {profit.pl}
                    </td>
                    <td className="text-center">{profit.commission}</td>
                    <td
                      className={`text-center font-bold ${profit.pl - profit.commission <= 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {(profit.pl - profit.commission).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center">
                    No data!
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
              id="jump_desk"
              className="input bh-jump-input h-[32px]"
              value={jumptoPage}
              onChange={(e) => setJumptoPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && JumpPage()}
              disabled={totalPages <= 1} // ✅ Disable condition
            />
            <button 
              className="bh-jump-go-btn h-[32px]" 
              onClick={JumpPage}
              disabled={totalPages <= 1 || !jumptoPage} // ✅ Disable condition
            >
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
                disabled={totalPages <= 1} // ✅ Disable condition
              />
              <button
                className="bh-jump-go-btn"
                onClick={JumpPage}
                disabled={totalPages <= 1 || !jumptoPage} // ✅ Disable condition
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

export default ProfitLossEventPage;