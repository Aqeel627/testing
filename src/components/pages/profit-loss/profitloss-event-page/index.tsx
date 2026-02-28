'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { useAuthStore } from '@/lib/useAuthStore';
import http from '@/lib/axios-instance';
import dynamic from 'next/dynamic';
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
  const [jumptoPage, setJumptoPage] = useState('');

  // ✅ Folder structure [sportId] [fromDate] [toDate] ke mutabiq params
  const sportsId = params.sportId;
  const startDate = params.fromDate;
  const endDate = params.toDate;

  const profitLossByEvent = useCallback(async (page?: number) => {

    if (!sportsId || !token) {
      console.warn("⚠️ Aborting: sportsId or Token is missing", { sportsId, token });
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
      limit: limit
    };

    try {
      const resp = await http.post(CONFIG.newProfitLossEventMarket, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      const data = resp.data?.data;
      if (data) {
        setProfitList(data);
        setTotalRecords(resp.data.total || 0);
        setTotalPages(Math.ceil((resp.data.total || 0) / limit));
        setCurrentPage(resp.data.currentPage);

        const sIdx = ((resp.data.currentPage - 1) * limit) + 1;
        setStartIndex(sIdx);
        setEndIndex(Math.min(sIdx + data.length - 1, resp.data.total || 0));
      }
    } catch (error: any) {
      console.error("❌ API Error:", error.response?.data || error.message);
    } finally {
      setIsLoader(false);
    }
  }, [sportsId, startDate, endDate, token, currentPage]);

  useEffect(() => {
    // Sirf tabhi call karein jab token aur sportsId mil jayein
    if (token && sportsId) {
      profitLossByEvent();
    }
  }, [token, sportsId, profitLossByEvent]);

  // --- Handlers ---
  const JumpPage = () => {
    const p = parseInt(jumptoPage);
    if (p > 0 && p <= totalPages) profitLossByEvent(p);
  };

  const goToFirst = () => { if (currentPage !== 1) profitLossByEvent(1); };
  const goToLast = () => { if (currentPage !== totalPages) profitLossByEvent(totalPages); };
  const goToNext = () => { if (currentPage < totalPages) profitLossByEvent(currentPage + 1); };
  const goToPrevious = () => { if (currentPage > 1) profitLossByEvent(currentPage - 1); };

  const goToEventPL = (eventId: any) => {
    router.push(`/profitloss-market/${eventId}`);
  };

  return (
    <div id="profitloss-event-page.tsx">
      <div className="container-fluid px-4">
        {/* ✅ Image ke mutabiq Header Design */}
        {/* <div className="flex items-center my-4">
        <div className="flex-grow border-t border-t border-dashed border-(--dotted-line)"></div>
        <span className="px-4 text-[var(--palette-text-primary)] font-bold text-[16px] whitespace-nowrap uppercase">
          Profit Loss Event
        </span>
        <div className="flex-grow border-t border-t border-dashed border-(--dotted-line)"></div>
      </div> */}
        <div className="my-4">
          <BreadCrumb title="Profit Loss Event" />
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-2 custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! first:rounded-tl-[5px] whitespace-nowrap">Sport Name</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Event Name</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Profit/Loss</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Commission</th>
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
              ) : profitList.length > 0 ? (
                profitList.map((profit, index) => (
                  <tr key={index} className="border-b border-(--dotted-line) bg-[var(--palette-background-paper)]">
                    <td className="p-[8px_10px] text-center whitespace-nowrap border-r border-(--dotted-line) text-[11px] text-[var(--palette-text-primary)]">{profit.eventType.name}</td>
                    <td className="p-[8px_10px] text-center whitespace-nowrap border-r border-(--dotted-line) text-[11px]">
                      <button onClick={() => goToEventPL(profit.event.id)} className="text-(--primary-color) hover:underline font-bold cursor-pointer">
                        {profit.event.name}
                      </button>
                    </td>
                    <td className={`p-[8px_10px] whitespace-nowrap text-center border-r border-(--dotted-line) font-bold text-[11px] ${profit.pl <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {profit.pl}
                    </td>
                    <td className="p-[8px_10px] text-center border-r border-(--dotted-line) text-[11px] text-[var(--palette-text-primary)] whitespace-nowrap">{profit.commission}</td>
                    <td className={`p-[8px_10px] text-center font-bold text-[11px] ${(profit.pl - profit.commission) <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {(profit.pl - profit.commission).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-[8px_10px] text-center bg-[var(--palette-background-paper)] text-[12px] text-[var(--palette-text-primary)]">No data!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
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
              className="text-sm text-center h-[32px] border border-(--dotted-line) bg-transparent rounded-[5px] focus:outline-none max-w-[60px] text-white"
            />
            <button onClick={JumpPage} className="bg-[var(--primary-color)] text-white h-[32px] px-3 rounded-[5px] text-[12px] font-semibold ml-1 uppercase">Go</button>
          </div>
        </div>

        <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #5700a3; border-radius: 10px; border: 2px solid #ffffff; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #ffffff; }
      `}</style>
      </div>
    </div>
  );
};

export default ProfitLossEventPage;