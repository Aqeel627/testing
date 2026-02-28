'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { useAuthStore } from '@/lib/useAuthStore';
import http from '@/lib/axios-instance';
import BreadCrumb from '@/components/common/bread-crumb';

// Types define kar di hain
interface BetHistoryItem {
    eventType: { name: string };
    event: { name: string };
    marketId: string;
    selectionName: string;
    bidType: 'BACK' | 'LAY';
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
    const [jumptoPage, setJumptoPage] = useState('');

    // Route Params
    const sportsId = params.sportId;
    const marketId = params.marketId;

    const getHistory = useCallback(async (page?: number) => {
        if (!marketId || !token) return;

        setIsLoader(true);
        const activePage = page || currentPage;
        const limit = 25;

        const payload = {
            marketId: marketId,
            page: activePage,
            limit: limit
        };

        try {
            const resp = await http.post(CONFIG.getUserBetList, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            const responseData = resp.data;
            if (responseData?.data) {
                setHistoryList(responseData.data);
                setTotalRecords(responseData.total || 0);
                setTotalPages(Math.ceil((responseData.total || 0) / limit));
                setCurrentPage(responseData.currentPage || activePage);

                const sIdx = ((responseData.currentPage - 1) * limit) + 1;
                setStartIndex(sIdx);
                setEndIndex(Math.min(sIdx + responseData.data.length - 1, responseData.total || 0));
            }
        } catch (error: any) {
            console.error('❌ Error fetching Bet History:', error.response?.data || error.message);
        } finally {
            setIsLoader(false);
        }
    }, [marketId, token, currentPage]);

    useEffect(() => {
        getHistory();
    }, [getHistory]);

    // Formatting helpers
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).replace(',', '');
    };

    // Pagination Handlers
    const JumpPage = () => {
        const p = parseInt(jumptoPage);
        if (p > 0 && p <= totalPages) {
            setCurrentPage(p);
            getHistory(p);
        }
    };

    const goToFirst = () => { if (currentPage !== 1) getHistory(1); };
    const goToLast = () => { if (currentPage !== totalPages) getHistory(totalPages); };
    const goToNext = () => { if (currentPage < totalPages) getHistory(currentPage + 1); };
    const goToPrevious = () => { if (currentPage > 1) getHistory(currentPage - 1); };

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
                    <div className="bg-[var(--back-bg)] border border-[var(--back-border)] px-2 py-1 text-[11px] font-semibold text-[var(--back-price-text)] hover:bg-[var(--back-hover)]">Back</div>
                    <div className=" border border-(--lay-border)! bg-[var(--lay-bg)] hover:bg-[var(--lay-hover)] px-2 py-1 text-[11px] font-semibold text-[var(--lay-price-text)]">Lay</div>
                    <div className="bg-transparent border border-(--primary-color) px-2 py-1 text-[11px] font-semibold text-(--primary-color)">Void</div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto mt-2 custom-scrollbar">
                    <table className="w-full border-collapse rounded-t-2!">
                        <thead>
                            <tr className="rounded-t-2">
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] rounded-tl-2 font-bold">Sport Name</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold min-w-[200px]">Event Name</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold min-w-[120px]">Market Name</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold min-w-[120px]">Selection Name</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold">Bet Type</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold">User Price</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold">Amount</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold">Profit/Loss</th>
                                <th className="p-2 whitespace-nowrap bg-[var(--market-header-bg)] text-[var(--palette-text-primary)] border-r border-(--dotted-line)! text-[11px] font-bold min-w-[100px]">Place Date</th>
                                <th className="p-2 whitespace-nowrap text-[11px] font-bold min-w-[100px] bg-[var(--market-header-bg)] text-[var(--palette-text-primary)]sin">Match Date</th>
                            </tr>
                        </thead>

                        <tbody>
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
                            ) : historyList.length > 0 ? (
                                historyList.map((history, index) => (
                                    <tr
                                        key={index}
                                        className={`text-center border-b border-(--dotted-line) text-[11px] 
                                        ${history.bidType === 'BACK'
                                                ? 'bg-[var(--back-bg)]'
                                                : 'bg-[var(--lay-bg)]'}
                                        `}
                                    >
                                        <td className="p-2 border-r border-(--dotted-line) text-[var(--palette-text-primary)]">{history.eventType?.name}</td>
                                        <td className="p-2 border-r border-(--dotted-line) text-[var(--palette-text-primary)]">{history.event?.name}</td>
                                        <td className="p-2 border-r border-(--dotted-line) text-(--primary-color)">{history.marketId}</td>
                                        <td className="p-2 border-r border-(--dotted-line) text-[var(--palette-text-primary)]">{history.selectionName}</td>
                                        <td className="p-2 border-r border-(--dotted-line) text-[var(--palette-text-primary)] font-bold">{history.bidType}</td>
                                        <td className="p-2 border-r border-(--dotted-line) text-[var(--palette-text-primary)]">
                                            {Number(history.averagePrice).toFixed(2)}
                                            {history.requestedPrice && ` / ${history.requestedPrice}`}
                                        </td>
                                        <td className="p-2 border-r border-(--dotted-line) text-[var(--palette-text-primary)]">{history.totalSizeMatched}</td>
                                        <td className={`p-2 border-r border-(--dotted-line) font-bold ${history.profitLoss < 0 ? 'text-red-600' : 'text-green-600'
                                            }`}>
                                            {history.profitLoss}
                                        </td>
                                        <td className="p-2 border-r border-(--dotted-line) text-[var(--palette-text-primary)]">{formatDate(history.placeDate)}</td>
                                        <td className="p-2 text-[var(--palette-text-primary)]">{formatDate(history.matchedDate)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={10} className="p-4 text-center bg-[#f1f1f1] text-muted text-[12px]">No Data Found</td>
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
                            className="text-sm text-center h-[32px] border border-(--dotted-line) bg-transparent rounded-[5px] focus:outline-none max-w-[156.78px] text-white"
                        />
                        <button onClick={JumpPage} className="bg-[var(--primary-color)] text-white h-[32px] px-3 rounded-[5px] text-[12px] font-semibold ml-1 uppercase">Go</button>
                    </div>
                </div>

                <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #078dee; border-radius: 10px; border: 2px solid #ffffff; }
        .custom-scrollbar::-webkit-scrollbar-track { background-color: #ffffff; }
      `}</style>
            </div>
        </div>
    );
};

export default ProfitLossBetHostory;