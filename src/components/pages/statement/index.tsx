"use client";
import axiosInstance from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import dynamic from "next/dynamic";
import styles from "../statement/account-statement.module.css";
import React, { useState, useEffect, useRef } from "react";


const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));
const DateFilter = dynamic(() => import("@/components/common/date-filter"));

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
            <BreadCrumb title="statement" />
            <div className="w-full px-4">

                {/* Header */}
                <div className="mt-[10px]">
                    <div className="border-b pb-2">
                        <h6 className="text-[14px] font-semibold">
                            Account Statement
                        </h6>
                    </div>
                </div>

                {/* Filter */}
                <div className="my-[15px]">
                    <div className="flex flex-wrap gap-3">
                        <input
                            type="date"
                            className="h-[32px] px-3 text-[12px] bg-[#f1f1f1] border border-[#adadad] rounded-[5px] text-[#6d6d6d]"
                        />

                        <input
                            type="date"
                            className="h-[32px] px-3 text-[12px] bg-[#f1f1f1] border border-[#adadad] rounded-[5px] text-[#6d6d6d]"
                        />

                        <button className="h-[32px] px-4 bg-[#5700a3] text-white text-[12px] font-bold rounded-[5px] uppercase">
                            Submit
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto mb-[30px]">
                    <table className="w-full text-[11px] border-collapse">

                        {/* THEAD */}
                        <thead>
                            <tr>
                                {["Date/Time", "Deposit", "Withdraw", "Balance", "Remark"].map((head, i) => (
                                    <th
                                        key={i}
                                        className={`bg-[#dbcdeb] text-black font-bold text-[11px] py-[8px] px-[10px] border-r border-white 
              ${i === 0 ? "rounded-tl-[5px]" : ""}
              ${i === 4 ? "rounded-tr-[5px] border-r-0" : ""}`}
                                    >
                                        {head}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* TBODY */}
                        <tbody>
                            {statements.length > 0 ? (
                                statements.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="bg-[#f1f1f1] text-[#3a3a3a]"
                                    >
                                        <td className="py-[8px] px-[10px] border-r border-b border-white whitespace-nowrap">
                                            {formatDisplayDate(item.createdAt)}
                                        </td>

                                        <td className="py-[8px] px-[10px] border-r border-b border-white">
                                            {formatTwoDecimals(item.deposit)}
                                        </td>

                                        <td className="py-[8px] px-[10px] border-r border-b border-white text-red-600 font-bold">
                                            {formatTwoDecimals(item.withdraw)}
                                        </td>

                                        <td className="py-[8px] px-[10px] border-r border-b border-white font-bold">
                                            {formatTwoDecimals(item.bankBalance)}
                                        </td>

                                        <td className="py-[8px] px-[10px] border-b border-white whitespace-nowrap">
                                            {item.remark}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="bg-[#f1f1f1] text-center text-[12px] py-[8px]"
                                    >
                                        No data!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-[15px] text-[11px] md:flex md:justify-between md:items-center flex flex-col-reverse gap-[15px]">

                    {/* Entries Text */}
                    <div className="text-[#555]">
                        Showing {startEntry} to {endEntry} of {totalRecords} entries
                    </div>

                    {/* Pagination Buttons */}
                    <div className="flex justify-center md:justify-center gap-[10px] order-2">

                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={isFirstPage}
                            className={`text-[11px] font-semibold text-[#757272] ${isFirstPage ? "opacity-40 cursor-not-allowed" : ""
                                }`}
                        >
                            First
                        </button>

                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={isFirstPage}
                            className={`text-[11px] font-semibold text-[#757272] ${isFirstPage ? "opacity-40 cursor-not-allowed" : ""
                                }`}
                        >
                            Previous
                        </button>

                        <span className="w-[23px] h-[21px] flex items-center justify-center rounded-[5px] bg-[#5f02b9] text-white font-bold">
                            {currentPage}
                        </span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={isLastPage}
                            className={`text-[11px] font-semibold text-[#757272] ${isLastPage ? "opacity-40 cursor-not-allowed" : ""
                                }`}
                        >
                            Next
                        </button>

                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={isLastPage}
                            className={`text-[11px] font-semibold text-[#757272] ${isLastPage ? "opacity-40 cursor-not-allowed" : ""
                                }`}
                        >
                            Last
                        </button>
                    </div>

                    {/* Jump To Page */}
                    {/* {shouldEnableJumpToPage && ( */}
                        <div className="flex items-center text-[#757272] gap-2 order-3">
                            <span className="text-[10px] whitespace-nowrap">
                                Jump to page
                            </span>

                            <input
                                value={jumpToPage}
                                onChange={(e) => setJumpToPage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                className="w-[60px] h-[32px] text-center text-[14px] bg-[#f1f1f1] border border-[#adadad] rounded-[5px]"
                            />

                            <button
                                onClick={handleJumpToPage}
                                className="h-[32px] px-3 bg-[#dbcdeb] font-semibold"
                            >
                                Go
                            </button>
                        </div>
                    {/* )} */}

                </div>
            </div>
        </>
    )
}

export default StatementPage