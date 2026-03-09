"use client";
import axiosInstance from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import dynamic from "next/dynamic";
import "../profit-loss/profit-loss-page/style.css";
import React, { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/common/toast/toast-context";
import { splitMsg } from "@/lib/functions";

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
  const { showToast } = useToast();

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
    limit: number = pageLength,
  ) => {
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

      const data: any = response.data;

      setStatements(data.data || []);
      setTotalRecords(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setCurrentPage(data.currentPage || 1);

      // ✅ agar table empty ho aur submit click hua ho
      if (data?.data) {
        const msg = splitMsg(data?.meta?.message);
        showToast(msg.status, msg.title, msg.desc);
      }

    } catch (err) {
      console.error("❌ API Error:", err);
      setStatements([]);
      setTotalRecords(0);
      setTotalPages(1);
      setCurrentPage(1);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchStatements(1, pageLength);
  }, []);

  const handleGetStatement = () => {
    setCurrentPage(1);
    setJumpToPage(""); // Reset to empty
    fetchStatements(1, pageLength,);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setJumpToPage(""); // Reset to empty after navigation
      fetchStatements(newPage, pageLength);
    }
  };

  const goToFirst = () => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      fetchStatements(1, pageLength);
    }
  };
  const goToPrevious = () => {
    if (currentPage > 1) {
      const p = currentPage - 1;
      setCurrentPage(p);
      fetchStatements(p, pageLength);
    }
  };
  const goToNext = () => {
    if (currentPage < totalPages) {
      const p = currentPage + 1;
      setCurrentPage(p);
      fetchStatements(p, pageLength);
    }
  };
  const goToLast = () => {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      fetchStatements(totalPages, pageLength);
    }
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage);

    if (jumpToPage === "" || isNaN(pageNum)) return;

    if (pageNum === currentPage) {
      showToast(
        "error",
        "Already on same page",
        `You are already on page ${pageNum}.`,
      );
      setJumpToPage("");
      return;
    }

    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setJumpToPage(""); // Reset to empty after jump
      fetchStatements(pageNum, pageLength);
    } else {
      showToast(
        "error",
        "Invalid Page",
        `Please enter a page number between 1 and ${totalPages}.`,
      );
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
                id="start_date_desk"
                value={startDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  if (date) setStartDate(date);
                }}
                max={endDate ? endDate.toISOString().split("T")[0] : undefined}
                placeholder="From"
                className="input h-[32px] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272]  rounded-[5px]  focus:outline-none"
                readOnly={false}
                autoComplete="off"
              />

              <input
                type="date"
                id="end_date_desk"
                value={endDate.toISOString().split("T")[0]}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  if (date) setEndDate(date);
                }}
                min={
                  startDate ? startDate.toISOString().split("T")[0] : undefined
                }
                placeholder="To"
                className="input h-[32px] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272]  rounded-[5px]  focus:outline-none"
                readOnly={false}
                autoComplete="off"
              />

              <button
                onClick={handleGetStatement}
                className="h-[32px] px-4 font-bold rounded-[5px] hover:bg-(--primary-color-dark) bg-(--primary-color) uppercase text-white  text-[12px] cursor-pointer "
                style={{
                  boxShadow:
                    "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                }}
              >
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
                  id="start_date_mbl"
                  type="date"
                  value={startDate.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    if (date) setStartDate(date);
                  }}
                  max={
                    endDate ? endDate.toISOString().split("T")[0] : undefined
                  }
                  placeholder="From"
                  className="h-[32px] w-[49%] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272] rounded-[5px]   focus:outline-none iphone-only-margin"
                  readOnly={false}
                  autoComplete="off"
                />
                <input
                  type="date"
                  id="end_date_mbl"
                  value={endDate.toISOString().split("T")[0]}
                  onChange={(e) => {
                    const date = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    if (date) setEndDate(date);
                  }}
                  min={
                    startDate
                      ? startDate.toISOString().split("T")[0]
                      : undefined
                  }
                  placeholder="To"
                  className="h-[32px] w-[49%] px-3 text-[12px] bg-transparent border border-[var(--primary-color)] text-[#757272] rounded-[5px]   focus:outline-none "
                  readOnly={false}
                  autoComplete="off"
                />
              </div>

              {/* Submit button on next line */}
              <button
                onClick={handleGetStatement}
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
          <div className="bh-table-wrap mb-[30px]">
            <table className="bh-table">
              <thead>
                <tr>
                  {[
                    "Date/Time",
                    "Deposit",
                    "Withdraw",
                    "Balance",
                    "Remark",
                  ].map((head, i) => (
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
                  ))}
                </tr>
              </thead>

              <tbody>
                {statements.length > 0 ? (
                  statements.map((statement, index) => (
                    <tr key={index} className="text-center">
                      <td className="py-[8px] px-[10px] whitespace-nowrap">
                        {formatDisplayDate(statement.createdAt)}
                      </td>

                      <td className="py-[8px] px-[10px] bg-transparent  border border-[var(--secondary-text-color)] text-green-600 font-bold">
                        {formatTwoDecimals(statement.deposit)}
                      </td>

                      <td className="py-[8px] px-[10px] bg-transparent  border border-[var(--secondary-text-color)] text-red-600 font-bold">
                        {formatTwoDecimals(statement.withdraw)}
                      </td>

                      <td className="py-[8px] px-[10px] font-bold">
                        {formatTwoDecimals(statement.bankBalance)}
                      </td>

                      <td className="py-[8px] px-[10px] whitespace-nowrap">
                        {statement.remark || "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="  text-[#555] text-center text-[12px] py-[8px] border border-[var(--secondary-text-color)]"
                    >
                      No data!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
                className={`input bh-jump-input ${totalPages <= 1 ? "disabled opacity-[.5]" : ""}`}
                min={1}
                id="jump_desk"
                max={totalPages}
                value={jumpToPage}
                onChange={(e) => setJumpToPage(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="off"
                disabled={totalPages <= 1}
              />
              <button
                className={`bh-jump-go-btn ${totalPages <= 1 ? "disabled" : ""}`}
                onClick={handleJumpToPage}
                disabled={totalPages <= 1}
              >
                Go
              </button>
            </div>

            {/* Entries + mobile jump */}
            <div className="bh-entries-text">
              <div className="bh-mobile-only bh-jump">
                <span className="jumptext">Jump to page</span>
                <input
                  id="jump_mbl"
                  className={`input bh-jump-input ${totalPages <= 1 ? "disabled opacity-[.5]" : ""}`}
                  min={1}
                  max={totalPages}
                  value={jumpToPage}
                  onChange={(e) => setJumpToPage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoComplete="off"
                  disabled={totalPages <= 1}
                />
                <button
                  className={`bh-jump-go-btn ${totalPages <= 1 ? "disabled" : ""}`}
                  onClick={handleJumpToPage}
                  disabled={totalPages <= 1}
                >
                  Go
                </button>
              </div>
              <span>
                Showing {startEntry} to {endEntry} of {totalRecords} entries
              </span>
            </div>

            {/* Desktop buttons */}
            <div className="bh-desktop-only bh-pg-buttons">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default StatementPage;
