'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // API calls ke liye
import { useRouter } from 'next/navigation';
import {CONFIG} from '@/lib/config'; // API endpoints ke liye
import http from '@/lib/axios-instance';

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
    <div className="container-fluid">
      {/* HEADER SECTION - Design preserved */}
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-dashed border-(--dotted-line)"></div>
        <span className="px-4 text-[var(--palette-text-primary)] font-bold text-[16px] whitespace-nowrap uppercase">
          Profit & Loss
        </span>
        <div className="flex-grow border-t border-dashed border-(--dotted-line)"></div>
      </div>

      {/* FILTER SECTION - Design preserved */}
      <div id="filter" className="my-[15px]">
        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-6 md:col-span-4 xl:col-span-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full h-[32px] px-3 py-1 bg-transparent text-[var(--palette-text-primary)] border border-(--dotted-line) rounded-[5px] text-[12px] outline-none focus:border-(--primary-color)"
            />
          </div>
          <div className="col-span-6 md:col-span-4 xl:col-span-2">
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full h-[32px] px-3 py-1 bg-transparent text-[var(--palette-text-primary)] border border-(--dotted-line) rounded-[5px] text-[12px] outline-none focus:border-(--primary-color)"
            />
          </div>
          <div className="col-span-12 md:col-span-4 xl:col-span-2 mt-3 md:mt-0">
            <button
              onClick={rerender}
              disabled={isLoader}
              className="w-full h-[32px] bg-[var(--primary-color)] border-[var(--primary-color)] text-[12px] font-bold rounded-[5px] uppercase disabled:opacity-50 transition-all text-white"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* TABLE SECTION - Design preserved */}
      <div className="overflow-x-auto mb-[30px] custom-scrollbar">
        <table className="w-full border-collapse border-none">
          <thead>
            <tr>
              <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! first:rounded-tl-[5px] whitespace-nowrap">Sport Name</th>
              <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Profit / Loss</th>
              <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Commission</th>
              <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] last:rounded-tr-[5px] whitespace-nowrap">Total P&L</th>
            </tr>
          </thead>
          
          <tbody className="bg-[#f1f1f1]">
            {isLoader ? (
              <tr>
                <td colSpan={4} className="p-4 bg-[#f1f1f1] text-center">
                  <div className="flex justify-center items-center gap-1.5">
                    <div className="w-2 h-2 bg-[#428bca] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-[#428bca] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-[#428bca] rounded-full animate-bounce"></div>
                  </div>
                </td>
              </tr>
            ) : profitLossData.length > 0 ? (
              profitLossData.map((profit, index) => (
                <tr key={index} className="border-b border-(--secondary-text-color) bg-[var(--palette-background-paper)]">
                  <td className="p-[8px_10px] text-[var(--palette-text-primary)] text-center border-r border-(--secondary-text-color)">
                    <button 
                      onClick={() => goToEventPL(profit.eventType.id)}
                      className="text-[#4285f4] font-bold text-[11px] hover:underline"
                    >
                      {profit.eventType.name}
                    </button>
                  </td>
                  <td className={`p-[8px_10px] text-[var(--palette-text-primary)] text-center border-r border-(--secondary-text-color) font-bold text-[11px] ${profit.pl <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {profit.pl.toFixed(2)}
                  </td>
                  <td className="p-[8px_10px] text-[var(--palette-text-primary)] text-center border-r border-(--secondary-text-color) text-[11px]">
                    {profit.commission.toFixed(2)}
                  </td>
                  <td className={`p-[8px_10px] text-[var(--palette-text-primary)] text-center font-bold text-[11px] ${(profit.pl - profit.commission) <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {(profit.pl - profit.commission).toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-[8px_10px] text-center bg-[var(--palette-background-paper)] text-[12px]">No data!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION SECTION - Design preserved */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-[15px] text-[#757272]">
        <div className="text-[10px] order-1 w-full md:w-auto text-start text-(--secondary-text-color)">
          <span>Showing {startIndex} to {endIndex} of {totalRecords} entries</span>
        </div>

        <div className="flex justify-center items-center gap-2 order-2 text-(--secondary-text-color)">
          <button onClick={goToFirst} disabled={currentPage === 1} className="text-[11px] font-semibold disabled:opacity-40 px-1">First</button>
          <button onClick={goToPrevious} disabled={currentPage === 1} className="text-[11px] font-semibold disabled:opacity-40 px-1">Previous</button>
          <span className="w-[24px] h-[21px] bg-[var(--primary-color)] text-white rounded-[5px] flex items-center justify-center font-bold text-[11px]">
            {currentPage}
          </span>
          <button onClick={goToNext} disabled={currentPage === totalPages} className="text-[11px] font-semibold disabled:opacity-40 px-1">Next</button>
          <button onClick={goToLast} disabled={currentPage === totalPages} className="text-[11px] font-semibold disabled:opacity-40 px-1">Last</button>
        </div>

        <div className="flex items-center gap-1 order-3 w-full md:w-auto justify-end">
          <span className="text-[10px] whitespace-nowrap text-(--secondary-text-color)">Jump to page</span>
          <input 
            type="text" 
            value={jumptoPage}
            onChange={(e) => setJumptoPage(e.target.value)}
            className="text-sm text-center h-[32px] border border-(--dotted-line) bg-transparent rounded-[5px] focus:outline-none max-w-[156.78px] text-white"
          />
          <button onClick={JumpPage} className="bg-[var(--primary-color)] border-[var(--primary-color)] text-white h-[32px] px-3 rounded-[5px] text-[12px] font-semibold ml-1">Go</button>
        </div>
      </div>

      {/* Scrollbar CSS */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #5700a3; border-radius: 10px; border: 2px solid #ffffff; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #ffffff; }
      `}</style>
    </div>
  );
};

export default ProfitLossPage;