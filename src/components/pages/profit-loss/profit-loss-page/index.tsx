'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // API calls ke liye
import { useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config'; // API endpoints ke liye
import http from '@/lib/axios-instance';
import dynamic from 'next/dynamic';
import "./style.css";
const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

// Interfaces
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

  // --- Logic States ---
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoader, setIsLoader] = useState<boolean>(false);
  const [profitLossData, setProfitLossData] = useState<ProfitLossData[]>([]);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [jumptoPage, setJumptoPage] = useState<string>('');
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(1);
  const [endIndex, setEndIndex] = useState<number>(10);

  // --- 1. Initial Setup (ngOnInit replacement) ---
  useEffect(() => {
    updateDate(); // Dates set karega
  }, []);

  // Jab startDate aur endDate set ho jayein, tab data fetch karein
  useEffect(() => {
    if (startDate && endDate) {
      getProfitLoss();
    }
  }, [startDate, endDate]);

  // --- 2. Date Handling (updateDate replacement) ---
  const updateDate = () => {
    const today = new Date();
    const end = today.toISOString().substring(0, 10);

    const start = new Date();
    start.setDate(today.getDate() - 10);
    const startStr = start.toISOString().substring(0, 10);

    setEndDate(end);
    setStartDate(startStr);
  };

  // --- 3. API Call (getProfitLoss replacement) ---
  const getProfitLoss = async (pageNumber?: number) => {
    setIsLoader(true);

    const page = pageNumber || currentPage;
    const limit = 25;

    const reqBody = {
      startDate: `${startDate} 00:00:00`, // Angular's getStartDate logic simplified
      endDate: `${endDate} 23:59:59`,     // Angular's getEndDate logic simplified
      page: page,
      limit: limit
    };

    try {
      const resp = await http.post(CONFIG.newProfitLoss, reqBody);
      const data = resp.data?.data;

      if (data) {
        setProfitLossData(data);
        setTotalRecords(resp.data.total || 0);
        setTotalPages(Math.ceil((resp.data.total || 0) / limit));
        setCurrentPage(resp.data.currentPage);

        // Index calculation
        const sIndex = ((resp.data.currentPage - 1) * limit) + 1;
        setStartIndex(sIndex);
        setEndIndex(Math.min(sIndex + data.length - 1, resp.data.total || 0));
      }
    } catch (error) {
      console.error("Error fetching P&L data", error);
    } finally {
      setIsLoader(false);
    }
  };

  // --- 4. Navigation & Actions ---
  const goToEventPL = (sportid: any) => {
    // Angular: /profitloss-event/${sportid}/${start}/${end}
    router.push(`/profitloss-events/${sportid}/${startDate}/${endDate}`);
  };

  const JumpPage = () => {
    const pageNum = parseInt(jumptoPage);
    if (pageNum > 0 && pageNum <= totalPages) {
      getProfitLoss(pageNum);
    }
  };

  const rerender = () => getProfitLoss();

  // Pagination Handlers
  const goToFirst = () => { if (currentPage !== 1) getProfitLoss(1); };
  const goToLast = () => { if (currentPage !== totalPages) getProfitLoss(totalPages); };
  const goToNext = () => { if (currentPage < totalPages) getProfitLoss(currentPage + 1); };
  const goToPrevious = () => { if (currentPage > 1) getProfitLoss(currentPage - 1); };

  return (
    <div id="profit-loss-page.tsx">
      <div className="container-fluid">
        {/* HEADER SECTION - Design preserved */}
        {/* <div className="flex items-center my-4">
        <div className="flex-grow border-t border-dashed border-(--dotted-line)"></div>
        <span className="px-4 text-[var(--palette-text-primary)] font-bold text-[16px] whitespace-nowrap uppercase">
          Profit & Loss
        </span>
        <div className="flex-grow border-t border-dashed border-(--dotted-line)"></div>
      </div> */}
        <div className="my-4">
          <BreadCrumb title="Profit & Loss" />
        </div>

        <div id="filter" className="my-[15px]">
          <div className="grid grid-cols-12 gap-3 items-center">
            {/* Start Date */}
            <div className="col-span-6 md:col-span-4 xl:col-span-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                // Yahan 'input' aur 'bh-date-input' classes add ki hain
                className="input bh-date-input w-full h-[32px] iphone-date px-3 py-1 outline-none rounded-[5px] text-[12px]"
              />
            </div>

            {/* End Date */}
            <div className="col-span-6 md:col-span-4 xl:col-span-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                // Same classes yahan bhi
                className="input bh-date-input iphone-date w-full h-[32px] px-3 py-1 outline-none rounded-[5px] text-[12px]"
              />
            </div>

            {/* Submit Button */}
            <div className="col-span-12 md:col-span-4 xl:col-span-2 mt-3 md:mt-0">
              <button
                onClick={rerender}
                disabled={isLoader}
                // Yahan 'bh-submit-btn' class add ki hai
                className="bh-submit-btn h-[32px] px-4 font-[400] rounded-[5px] uppercase text-white text-[12px] cursor-pointer"
                style={{
                  background: "var(--primary-color)",
                  boxShadow: "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* TABLE SECTION - Design preserved */}
        <div className="overflow-x-auto mb-[30px] scrollbar-hide">
          <table className="w-full border-collapse border-none">
            <thead>
              <tr>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--secondary-text-color)! first:rounded-tl-[5px] whitespace-nowrap">Sport Name</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--secondary-text-color)! whitespace-nowrap">Profit / Loss</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--secondary-text-color)! whitespace-nowrap">Commission</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] last:rounded-tr-[5px] whitespace-nowrap">Total P&L</th>
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
                  <tr key={index} className="border-b border-(--secondary-text-color) bg-[var(--palette-background-paper)]">
                    <td className="p-[8px_10px] text-[var(--palette-text-primary)] text-center border-r border-(--secondary-text-color) whitespace-nowrap">
                      <button
                        onClick={() => goToEventPL(profit.eventType.id)}
                        className="text-(--primary-color) font-bold text-[11px] hover:underline cursor-pointer"
                      >
                        {profit.eventType.name}
                      </button>
                    </td>
                    <td className={`p-[8px_10px] whitespace-nowrap text-[var(--palette-text-primary)] text-center border-r border-(--secondary-text-color) font-bold text-[11px] ${profit.pl <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {profit.pl.toFixed(2)}
                    </td>
                    <td className="p-[8px_10px] text-[var(--palette-text-primary)] text-center border-r border-(--secondary-text-color) text-[11px] whitespace-nowrap">
                      {profit.commission.toFixed(2)}
                    </td>
                    <td className={`p-[8px_10px] whitespace-nowrap text-[var(--palette-text-primary)] text-center font-bold text-[11px] ${(profit.pl - profit.commission) <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {(profit.pl - profit.commission).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-[8px_10px] text-center bg-[var(--palette-background-paper)] border border-t-0 border-(--secondary-text-color) text-[12px]">No data!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION SECTION */}
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

export default ProfitLossPage;