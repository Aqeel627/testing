"use client";
import axiosInstance from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import dynamic from "next/dynamic";
import styles from "../statement/account-statement.module.css";
import React, { useState, useEffect, useRef } from "react";


const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

interface StatementRecord {
    createdAt: string;
    deposit: number;
    withdraw: number;
    bankBalance: number;
    remark: string;
    fromTo: string;
}

interface ApiResponse {
    data: StatementRecord[];
    total: number;
    currentPage: number;
    totalPages: number;
}

const StatementPage = () => {
    const today = new Date();
    const formattedDate = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;
    const [startDate, setStartDate] = useState<Date>(() => {
        const today = new Date();
        const tenDaysAgo = new Date(today);
        tenDaysAgo.setDate(today.getDate() - 10);
        return tenDaysAgo;
    });
    const [endDate, setEndDate] = useState<Date>(() => new Date());
    const [pageLength] = useState(25); // Fixed to 25, removed state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [statements, setStatements] = useState<StatementRecord[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [jumpToPage, setJumpToPage] = useState(""); // Empty by default

    // const { showLoading, hideLoading } = useLoading();

    const formatDate = (date: Date, endOfDay: boolean = false) => {
        const local = new Date(date);
        const year = local.getFullYear();
        const month = String(local.getMonth() + 1).padStart(2, "0");
        const day = String(local.getDate()).padStart(2, "0");
        const time = endOfDay ? "23:59:00" : "00:00:00";
        return `${year}-${month}-${day}T${time}+05:00`;
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = String(date.getFullYear()).slice(-2);
        const time = date.toLocaleTimeString("en-GB", { hour12: false });
        return `${day}-${month}-${year} ${time}`;
    };

    const formatTwoDecimals = (val: any) => {
        const num = Number(val);
        return isNaN(num) ? "0.00" : num.toFixed(2);
    };

    const fetchStatements = async (
        page: number = 1,
        limit: number = pageLength
    ) => {
        // showLoading();
        try {
            const payload = {
                startDate: formatDate(startDate),
                endDate: formatDate(endDate, true),
                page: page,
                limit: limit,
            };

            const response = await axiosInstance.post<ApiResponse>(
                CONFIG.userAccountStatement,
                payload
            );

            const data = response.data;
            setStatements(data.data || []);
            setTotalRecords(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setCurrentPage(data.currentPage || 1);
        } catch (err) {
            console.error("❌ API Error:", err);
            setStatements([]);
            setTotalRecords(0);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            // hideLoading();
        }
    };

    // Initial load and when filters change
    useEffect(() => {
        fetchStatements(1, pageLength);
    }, [startDate, endDate]);

    const handleGetStatement = () => {
        setCurrentPage(1);
        setJumpToPage(""); // Reset to empty
        fetchStatements(1, pageLength);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            setJumpToPage(""); // Reset to empty after navigation
            fetchStatements(newPage, pageLength);
        }
    };

    const handleJumpToPage = () => {
        const pageNum = parseInt(jumpToPage);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
            setJumpToPage(""); // Reset to empty after jump
            fetchStatements(pageNum, pageLength);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleJumpToPage();
        }
    };

    // Remove the useEffect that sets jumpToPage when currentPage changes
    // This keeps the input empty by default

    const startEntry =
        totalRecords === 0 ? 0 : (currentPage - 1) * pageLength + 1;
    const endEntry = Math.min(currentPage * pageLength, totalRecords);

    // Pagination button states
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;
    const hasMultiplePages = totalPages > 1;
    const shouldEnableJumpToPage = hasMultiplePages;
    return (
        <>
            <div id="statement.tsx">
                <div className="my-4">
                    <BreadCrumb title="Account Statement" />
                </div>

                <div className="w-full">

                    {/* <div className="flex items-center gap-4 mb-8">
                    <div
                        className="flex-1 h-[1px]"
                        style={{ background: "var(--dotted-line)" }}
                    />
                    <h2
                        className="text-[15px] font-bold uppercase tracking-widest whitespace-nowrap"
                        style={{ color: "var(--palette-text-primary)" }}
                    >
                        Account Statement
                    </h2>
                    <div
                        className="flex-1 h-[1px]"
                        style={{ background: "var(--dotted-line)" }}
                    />
                </div> */}


                    {/* ================= FILTER ================= */}
                    {/* for desktp */}
                    <div className="my-[15px]">
                        <div className="hidden md:flex md:flex-wrap md:gap-3">

                            <input
                                type="date"
                                value={startDate.toISOString().split("T")[0]}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    if (date) setStartDate(date);
                                }}
                                max={endDate ? endDate.toISOString().split("T")[0] : undefined}
                                placeholder="From"
                                className="h-[32px] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272]  rounded-[5px]  focus:outline-none"
                                readOnly={false}
                                autoComplete="off"
                            />

                            <input
                                type="date"
                                value={endDate.toISOString().split("T")[0]}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    if (date) setEndDate(date);
                                }}
                                min={startDate ? startDate.toISOString().split("T")[0] : undefined}
                                placeholder="To"
                                className="h-[32px] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272]  rounded-[5px]  focus:outline-none"
                                readOnly={false}
                                autoComplete="off"
                            />

                            <button className="h-[32px] px-4 font-bold rounded-[5px] hover:bg-(--primary-color-dark) bg-(--primary-color) uppercase text-white  text-[12px] cursor-pointer "
                                style={{
                                    boxShadow:
                                        "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                                }}>
                                Submit
                            </button>
                        </div>
                    </div>
                    {/* for mobile */}
                    <div className="my-[15px] md:hidden">
                        <div className="flex flex-wrap gap-3">

                            {/* Input container to keep both in one line */}
                            <div className="flex justify-between w-full  flex-nowrap">
                                <input
                                    type="date"
                                    value={startDate.toISOString().split("T")[0]}
                                    onChange={(e) => {
                                        const date = e.target.value ? new Date(e.target.value) : null;
                                        if (date) setStartDate(date);
                                    }}
                                    max={endDate ? endDate.toISOString().split("T")[0] : undefined}
                                    placeholder="From"
                                    className="h-[32px] w-[49%] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272] rounded-[5px]   focus:outline-none"
                                    readOnly={false}
                                    autoComplete="off"
                                />
                                <input
                                    type="date"
                                    value={endDate.toISOString().split("T")[0]}
                                    onChange={(e) => {
                                        const date = e.target.value ? new Date(e.target.value) : null;
                                        if (date) setEndDate(date);
                                    }}
                                    min={startDate ? startDate.toISOString().split("T")[0] : undefined}
                                    placeholder="To"
                                    className="h-[32px] w-[49%] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272] rounded-[5px]   focus:outline-none"
                                    readOnly={false}
                                    autoComplete="off"
                                />
                            </div>

                            {/* Submit button on next line */}
                            <button
                                className="w-full mt-2 h-[32px] hover:bg-(--primary-color-dark) bg-(--primary-color) px-4 font-bold rounded-[5px] uppercase text-white text-[12px] cursor-pointer"
                                style={{
                                    boxShadow:
                                        "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                                }}
                            >
                                Submit
                            </button>

                        </div>
                    </div>



                    {/* ================= TABLE ================= */}
                    <div className="overflow-x-auto mb-[30px]">

                        <table className="w-full text-[11px] border-collapse">
                            <thead>
                                <tr>
                                    {["Date/Time", "Deposit", "Withdraw", "Balance", "Remark"].map(
                                        (head, i) => (
                                            <th
                                                key={i}
                                                className={`
  font-bold
  py-[8px] px-[10px]
  bg-transparent  border border-[var(--secondary-text-color)]
  text-center whitespace-nowrap
  ${i === 0 ? "rounded-tl-[5px]" : ""}
  ${i === 4 ? "rounded-tr-[5px]" : ""}
`}

                                            >
                                                {head}
                                            </th>
                                        )
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {statements.length > 0 ? (
                                    statements.map((statement, index) => (
                                        <tr
                                            key={index}
                                            className="  text-black text-center"
                                        >
                                            <td className="py-[8px] px-[10px] bg-transparent  border border-[var(--secondary-text-color)] text-[#757272] whitespace-nowrap">
                                                {formatDisplayDate(statement.createdAt)}
                                            </td>

                                            <td className="py-[8px] px-[10px] bg-transparent  border border-[var(--secondary-text-color)] text-green-600 font-bold">
                                                {formatTwoDecimals(statement.deposit)}
                                            </td>

                                            <td className="py-[8px] px-[10px] bg-transparent  border border-[var(--secondary-text-color)] text-red-600 font-bold">
                                                {formatTwoDecimals(statement.withdraw)}
                                            </td>

                                            <td className="py-[8px] px-[10px] bg-transparent  border border-[var((--secondary-text-color)] text-[#757272] font-bold">
                                                {formatTwoDecimals(statement.bankBalance)}
                                            </td>

                                            <td className="py-[8px] px-[10px] bg-transparent  border border-[var((--secondary-text-color)] text-[#757272] whitespace-nowrap">
                                                {statement.remark || "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="  text-[#555] text-center text-[12px] py-[8px]"
                                        >
                                            No data!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>


                    {/* ================= PAGINATION ================= */}
                    <div className="flex md:hidden justify-between items-center gap-[10px] order-2">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={isFirstPage || !hasMultiplePages}
                            className={`
    font-semibold rounded px-3 py-1 transition-all
    ${isFirstPage || !hasMultiplePages
                                    ? " bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                    : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                }
  `}
                            style={
                                !(isFirstPage || !hasMultiplePages)
                                    ? {
                                        color: "var(--primary-color)",
                                    }
                                    : {}
                            }
                        >
                            First
                        </button>

                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={isFirstPage || !hasMultiplePages}
                            className={`
    text-[#757272] font-semibold rounded px-3 py-1
    ${isFirstPage || !hasMultiplePages
                                    ? "bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                    : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                }
  `}
                        >
                            Previous
                        </button>

                        <span className="w-[23px] h-[21px] flex items-center justify-center rounded-[5px]  text-white font-bold"
                            style={{
                                background: "var(--primary-color)",
                                boxShadow:
                                    "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                            }}>
                            1
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={isLastPage || !hasMultiplePages}
                            className={`
    text-[#757272] font-semibold rounded px-3 py-1
    ${isLastPage || !hasMultiplePages
                                    ? "bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                    : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                }
  `}
                        >
                            Next
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={isLastPage || !hasMultiplePages}
                            className={`
    text-[#757272] font-semibold rounded px-3 py-1
    ${isLastPage || !hasMultiplePages
                                    ? "bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                    : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                }
  `}
                        >
                            Last
                        </button>
                    </div>
                    <div className="mt-[15px] text-[11px]  flex items-center justify-between flex-row gap-[15px]">

                        {/* Entries */}
                        <div className="text-[#757272] order-1 text-[10px]">
                            Showing {startEntry} to {endEntry}  of {totalRecords} entries
                        </div>

                        {/* Pagination Buttons */}
                        <div className=" hidden md:flex items-center justify-center gap-[10px] order-2">

                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={isFirstPage || !hasMultiplePages}
                                className={`
    font-semibold rounded px-3 py-1 transition-all
    ${isFirstPage || !hasMultiplePages
                                        ? " bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                        : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                    }
  `}
                                style={
                                    !(isFirstPage || !hasMultiplePages)
                                        ? {
                                            color: "var(--primary-color)",
                                        }
                                        : {}
                                }
                            >
                                First
                            </button>

                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={isFirstPage || !hasMultiplePages}
                                className={`
    text-[#757272] font-semibold rounded px-3 py-1
    ${isFirstPage || !hasMultiplePages
                                        ? "bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                        : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                    }
  `}
                            >
                                Previous
                            </button>

                            <span className="w-[23px] h-[21px] flex items-center justify-center rounded-[5px]  text-white font-bold"
                                style={{
                                    background: "var(--primary-color)",
                                    boxShadow:
                                        "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                                }}>
                                {currentPage}
                            </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={isLastPage || !hasMultiplePages}
                                className={`
    text-[#757272] font-semibold rounded px-3 py-1
    ${isLastPage || !hasMultiplePages
                                        ? "bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                        : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                    }
  `}
                            >
                                Next
                            </button>

                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={isLastPage || !hasMultiplePages}
                                className={`
    text-[#757272] font-semibold rounded px-3 py-1
    ${isLastPage || !hasMultiplePages
                                        ? "bg-transparent cursor-not-allowed border border-[var(--primary-color)] text-[#757272]"
                                        : "bg-transparent border border-[var(--primary-color)] hover:opacity-80 text-[#757272]"
                                    }
  `}
                            >
                                Last
                            </button>

                        </div>

                        {/* Jump To Page */}
                        <div className="flex items-center gap-2 text-[#757272] order-3">

                            <span className="text-[#757272] text-[10px] whitespace-nowrap">
                                Jump to page
                            </span>

                            <input
                                type="number"
                                min={1}
                                max={totalPages}
                                value={jumpToPage}
                                onChange={(e) => setJumpToPage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                autoComplete="off"
                                disabled={!shouldEnableJumpToPage}
                                className="
      w-[30px] sm:w-[40px] md:w-[60px]
      h-8 text-center text-[14px] 
      bg-transparent border border-[var(--primary-color)] rounded-[5px]
      disabled:opacity-50 disabled:cursor-not-allowed
    "
                            />

                            <button
                                onClick={handleJumpToPage}
                                disabled={!shouldEnableJumpToPage}
                                className="h-[32px] px-3 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{
                                    background: "var(--primary-color)",
                                    boxShadow: "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                                }}
                            >
                                Go
                            </button>


                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatementPage