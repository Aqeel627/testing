'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';
import { useAuthStore } from '@/lib/useAuthStore';
import http from '@/lib/axios-instance';
import BreadCrumb from '@/components/common/bread-crumb';

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
  const [jumptoPage, setJumptoPage] = useState('');
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
      limit: limit
    };

    try {
      const resp = await http.post(CONFIG.ProfitLossMarketNew, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log("✅ Market P&L Raw Response:", resp.data);

      const responseData = resp.data;
      const actualData = responseData?.data;

      if (actualData && Array.isArray(actualData)) {
        console.log("📊 Array of Items:", actualData); // Sirf table ka data log karein
        setProfitLossData(actualData);
        setTotalRecords(responseData.total || 0);
        setTotalPages(responseData.totalPages || 1);

        const sIdx = ((responseData.currentPage - 1) * limit) + 1;
        setStartIndex(sIdx);
        setEndIndex(Math.min(sIdx + actualData.length - 1, responseData.total || 0));
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
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('en-GB').replace(',', '');
  };

  // Pagination Handlers
  const JumpPage = () => {
    const p = parseInt(jumptoPage);
    if (p > 0 && p <= totalPages) {
      setCurrentPage(p);
      profitLossByMarket(p);
    }
  };

  const goToFirst = () => { if (currentPage !== 1) { setCurrentPage(1); profitLossByMarket(1); } };
  const goToLast = () => { if (currentPage !== totalPages) { setCurrentPage(totalPages); profitLossByMarket(totalPages); } };
  const goToNext = () => { if (currentPage < totalPages) { const p = currentPage + 1; setCurrentPage(p); profitLossByMarket(p); } };
  const goToPrevious = () => { if (currentPage > 1) { const p = currentPage - 1; setCurrentPage(p); profitLossByMarket(p); } };

  return (
    <div id="profitloss-market-page.tsx">
      <div className="container-fluid px-4">
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

        <div className="overflow-x-auto mt-2 custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-center">
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! first:rounded-tl-[5px] whitespace-nowrap">Sport Name</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap min-w-[230px]">Event Name</th>
                {_sportId === '66102' && (
                  <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Market Id</th>
                )}
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Market Name</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Result</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Profit/Loss</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! whitespace-nowrap">Commission</th>
                <th className="p-[8px_10px] text-center text-[11px] font-bold bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] last:rounded-tr-[5px] whitespace-nowrap">Settle Time</th>
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
                  <tr key={index} className="text-center border-b border-(--dotted-line) bg-[var(--palette-background-paper)]">
                    <td className="p-[8px_10px] border-r border-(--dotted-line) text-[11px] text-[var(--palette-text-primary)] whitespace-nowrap">{profit?.eventType?.name}</td>
                    <td className="p-[8px_10px] border-r border-(--dotted-line) text-[11px] text-[var(--palette-text-primary)] whitespace-nowrap">{profit?.event?.name}</td>
                    {_sportId === '66102' && (
                      <td className="p-[8px_10px] border-r border-(--dotted-line) text-[11px] text-[var(--palette-text-primary)] whitespace-nowrap">{profit?.marketId}</td>
                    )}
                    <td className="p-[8px_10px] border-r border-(--dotted-line) text-[11px]">
                      <Link href={`/d-profit-history/${profit?.eventType?.id}/${profit.marketId}`} className="text-[#4285f4] hover:underline font-bold whitespace-nowrap cursor-pointer">
                        {profit.marketName}
                      </Link>
                    </td>
                    <td className="p-[8px_10px] border-r border-(--dotted-line) text-[11px] text-[var(--palette-text-primary)] whitespace-nowrap">{profit.result}</td>
                    <td className={`p-[8px_10px]  border-r whitespace-nowrap border-(--dotted-line) font-bold text-[11px] ${profit.pl <= 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {profit.pl.toLocaleString()}
                    </td>
                    <td className="p-[8px_10px] border-r  border-(--dotted-line) text-red-600 font-bold text-[11px] whitespace-nowrap">
                      {profit.commission.toLocaleString()}
                    </td>
                    <td className="p-[8px_10px] text-[11px] whitespace-nowrap text-[var(--palette-text-primary)]">
                      {formatDate(profit.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-[8px_10px] text-center bg-[var(--palette-background-paper)] text-[12px] text-[var(--palette-text-primary)]">No data!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination View */}
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
      </div>
    </div>
  );
};

export default ProfitLossMarketPage;