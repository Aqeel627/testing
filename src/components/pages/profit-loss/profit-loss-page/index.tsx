"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CONFIG } from "@/lib/config";
import http from "@/lib/axios-instance";
import dynamic from "next/dynamic";
import { useToast } from "@/components/common/toast/toast-context"; // Toast import kiya
import "./style.css";

const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

interface EventType {
  id: string | number;
  name: string;
}

interface ProfitLossData {
  eventType: EventType;
  pl: number;
  commission: number;
}

const ProfitLossPage: React.FC = () => {
  const router = useRouter();
  const { showToast } = useToast(); // Toast hook initialize kiya

  // --- Logic States ---
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumptoPage, setJumptoPage] = useState<string>("");
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(1);
  const [endIndex, setEndIndex] = useState<number>(10);

  // --- 1. Initial Setup ---
  useEffect(() => {
    updateDate();
  }, []);

  // Jab startDate aur endDate set ho jayein, tab data fetch karein
  useEffect(() => {
    if (startDate && endDate) {
      getProfitLoss(1); // Reset to page 1 on date change
    }
  }, []);

  // --- 2. Date Handling ---
  const updateDate = () => {
    const today = new Date();
    const end = today.toISOString().substring(0, 10);

    const start = new Date();
    start.setDate(today.getDate() - 10);
    const startStr = start.toISOString().substring(0, 10);

    setEndDate(end);
    setStartDate(startStr);
  };

  // --- 3. API Call ---
  const getProfitLoss = async (pageNumber?: number) => {
    setIsLoader(true);

    const page = pageNumber || currentPage;
    const limit = 25;

    const reqBody = {
      startDate: `${startDate} 00:00:00`,
      endDate: `${endDate} 23:59:59`,
      page: page,
      limit: limit,
    };

    try {
      const resp = await http.post(CONFIG.newProfitLoss, reqBody);
      const data = resp.data?.data;

      if (data) {
        setProfitLossData(data);
        setTotalRecords(resp.data.total || 0);
        setTotalPages(Math.ceil((resp.data.total || 0) / limit) || 1); // Fallback to 1 if 0
        setCurrentPage(resp.data.currentPage || 1);

        // Index calculation
        const sIndex = ((resp.data.currentPage || 1) - 1) * limit + 1;
        setStartIndex(sIndex);
        setEndIndex(Math.min(sIndex + data.length - 1, resp.data.total || 0));
      } else {
        // Clear logic if no data
        setProfitLossData([]);
        setTotalRecords(0);
        setTotalPages(1);
        setCurrentPage(1);
        setStartIndex(0);
        setEndIndex(0);
      }
    } catch (error) {
      console.error("Error fetching P&L data", error);
      setProfitLossData([]);
      setTotalRecords(0);
      setTotalPages(1);
      setCurrentPage(1);
      setStartIndex(0);
      setEndIndex(0);
    } finally {
      setIsLoader(false);
    }
  };

  // --- 4. Navigation & Actions ---
  const goToEventPL = (sportid: any) => {
    router.push(`/profitloss-events/${sportid}/${startDate}/${endDate}`);
  };

  const rerender = () => getProfitLoss(1);

  // --- Pagination Handlers (Same as BetHistory) ---
  const goToFirst = () => {
    if (currentPage !== 1) getProfitLoss(1);
  };
  const goToPrevious = () => {
    if (currentPage > 1) getProfitLoss(currentPage - 1);
  };
  const goToNext = () => {
    if (currentPage < totalPages) getProfitLoss(currentPage + 1);
  };
  const goToLast = () => {
    if (currentPage !== totalPages) getProfitLoss(totalPages);
  };

  const JumpPage = () => {
    const pageNum = parseInt(jumptoPage);

    if (jumptoPage === "" || isNaN(pageNum)) return;

    if (pageNum === currentPage) {
      showToast("error", "Already on same page", `You are already on page ${pageNum}.`);
      setJumptoPage("");
      return;
    }

    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      getProfitLoss(pageNum);
      setJumptoPage(""); // Jump hone ke baad field clear karna
    } else {
      showToast("error", "Invalid Page", `Please enter a page number between 1 and ${totalPages}.`);
    }
  };

  return (
    <div id="profit-loss-page.tsx">
      <div className="container-fluid">
        <div className="my-4">
          <BreadCrumb title="Profit & Loss" />
        </div>

        <div id="filter" className="my-[15px]">
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Start Date */}
            <div className="col-span-6 md:col-span-4 xl:col-span-2">
              <input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input bh-date-input w-full h-[32px] iphone-date px-3 py-1 outline-none rounded-[5px] text-[12px]"
              />
            </div>

            {/* End Date */}
            <div className="col-span-6 md:col-span-4 xl:col-span-2">
              <input
                type="date"
                id="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input bh-date-input iphone-date w-full h-[32px] px-3 py-1 outline-none rounded-[5px] text-[12px]"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-12 md:col-span-4 xl:col-span-2 mt-3 md:mt-0">
              <button
                onClick={rerender}
                disabled={isLoader}
                className="bh-submit-btn h-[32px] px-4 font-[400] bg-(--primary-color) hover:bg-(--primary-color-dark) rounded-[5px] uppercase text-white text-[12px] cursor-pointer"
                style={{
                  boxShadow:
                    "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className=" mb-[30px] bh-table-wrap">
          <table className="bh-table">
            <thead>
              <tr>
                <th>Sport Name</th>
                <th>Profit / Loss</th>
                <th>Commission</th>
                <th>Total P&L</th>
              </tr>
            </thead>

            <tbody className="">
              {isLoader ? (
                <tr className="border-b border-(--secondary-text-color) bg-[var(--palette-background-paper)]">
                  <td colSpan={4} className="p-4  text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-(--primary-color) rounded-full animate-bounce"></div>
                    </div>
                  </td>
                </tr>
              ) : profitLossData.length > 0 ? (
                profitLossData.map((profit, index) => (
                  <tr key={index}>
                    <td className="text-center">
                      <button
                        onClick={() => goToEventPL(profit.eventType.id)}
                        className="text-(--primary-color) font-bold hover:underline cursor-pointer"
                      >
                        {profit.eventType.name}
                      </button>
                    </td>
                    <td
                      className={`text-center font-bold ${profit.pl <= 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {profit.pl.toFixed(2)}
                    </td>
                    <td className="text-center">
                      {profit.commission.toFixed(2)}
                    </td>
                    <td
                      className={`text-center font-bold ${profit.pl - profit.commission <= 0 ? "text-red-600" : "text-green-600"}`}
                    >
                      {(profit.pl - profit.commission).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-[8px_10px] text-center bg-[var(--palette-background-paper)] border border-t-0 border-(--secondary-text-color) text-[12px]"
                  >
                    No data!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}
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
              className="input bh-jump-input h-[32px]"
              id="jump_desk"
              value={jumptoPage}
              onChange={(e) => setJumptoPage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && JumpPage()}
              disabled={totalPages <= 1}
            />
            <button
              className="bh-jump-go-btn h-[32px]"
              onClick={JumpPage}
              disabled={totalPages <= 1 || !jumptoPage}
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
                id="jump_mbl"
                value={jumptoPage}
                onChange={(e) => setJumptoPage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && JumpPage()}
                disabled={totalPages <= 1}
              />
              <button
                className="bh-jump-go-btn"
                onClick={JumpPage}
                disabled={totalPages <= 1 || !jumptoPage}
              >
                Go
              </button>
            </div>
            <span>
              Showing {startIndex} to {endIndex} of {totalRecords} entries
            </span>
          </div>

          {/* Desktop buttons */}
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

export default ProfitLossPage;