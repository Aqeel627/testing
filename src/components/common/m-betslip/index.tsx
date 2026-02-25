"use client";
import { useAppStore } from "@/lib/store/store";
import { Minus, Plus } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function MBetSlip() {
  const { selectedBet, clearSelectedBet } = useAppStore();

  const [odds, setOdds] = useState<number>(0);
  const [inputValue, setInputValue] = useState<any>("0.00");
  const [stake, setStake] = useState<number>(0);
  const [quickValue, setQuickValue] = useState(0);

  const quickValues = ["+25", "+50", "+75", "+100"];

  const lowerUpperArray = [
    { increment: 0.01, lowerBound: 1.01, upperBound: 2 },
    { increment: 0.02, lowerBound: 2, upperBound: 3 },
    { increment: 0.05, lowerBound: 3, upperBound: 4 },
    { increment: 0.1, lowerBound: 4, upperBound: 6 },
    { increment: 0.2, lowerBound: 6, upperBound: 10 },
    { increment: 0.5, lowerBound: 10, upperBound: 20 },
    { increment: 1, lowerBound: 20, upperBound: 30 },
    { increment: 2, lowerBound: 30, upperBound: 50 },
    { increment: 5, lowerBound: 50, upperBound: 100 },
    { increment: 10, lowerBound: 100, upperBound: 1000 },
  ];

  const formatTwoDecimals = (num: number) => Number(num.toFixed(2));

  const getIncrement = (value: number): number => {
    if (value >= lowerUpperArray[lowerUpperArray.length - 1].upperBound)
      return lowerUpperArray[lowerUpperArray.length - 1].increment;
    for (let b = 0; b < lowerUpperArray.length; b++) {
      if (
        value >= lowerUpperArray[b].lowerBound &&
        value < lowerUpperArray[b].upperBound
      )
        return lowerUpperArray[b].increment;
    }
    return 0.01;
  };

  useEffect(() => {
    // console.log(selectedBet)
    if (selectedBet?.odds) {
      const n = Number(selectedBet.odds);
      setOdds(n);
      setInputValue(n.toFixed(2));
    }
    setStake(0);
    setQuickValue(0);
  }, [selectedBet]);

  if (!selectedBet) return null;

  const type = selectedBet.type;
  const runner = selectedBet.teamName;

  // Define all bet types
  const isBack = type === "back" || type === "yes";
  const isLay = type === "lay" || type === "no";

  // Correct border colors for yes/no
  const accentVar =
    type === "yes"
      ? "#50d0ae"
      : type === "no"
      ? "#5baca7"
      : isBack
      ? "var(--bs-back-accent)"
      : "var(--bs-lay-accent)";
  const accentBg10 =
    type === "yes"
      ? "#50d0ae1A"
      : type === "no"
      ? "#5baca71A"
      : isBack
      ? "var(--bs-back-accent-bg10)"
      : "var(--bs-lay-accent-bg10)";
  const accentBg15 =
    type === "yes"
      ? "#50d0ae26"
      : type === "no"
      ? "#5baca726"
      : isBack
      ? "var(--bs-back-accent-bg15)"
      : "var(--bs-lay-accent-bg15)";

  const profitOrLiability =
    stake > 0 && odds > 1 ? ((odds - 1) * stake).toFixed(2) : "0.00";

  // Header label
  const headerLabel =
    type === "back"
      ? "Back (Bet For)"
      : type === "lay"
      ? "Lay (Bet Against)"
      : type === "yes"
      ? "Yes (Bet For)"
      : "No (Bet Against)";

  // ── Odds handlers ──
  const handleIncrease = () => {
    const inc = getIncrement(odds);
    const nv = odds + inc;
    setOdds(formatTwoDecimals(nv));
    setInputValue(nv.toFixed(2));
  };

  const handleDecrease = () => {
    if (!odds || odds <= 1.01) return;
    const inc = getIncrement(odds);
    let nv = odds - inc;
    if (nv < 1.01) nv = 1.01;
    setOdds(formatTwoDecimals(nv));
    setInputValue(nv.toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleBlur = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      setOdds(val);
      setInputValue(formatTwoDecimals(val));
    } else {
      setOdds(1.01);
      setInputValue("1.01");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === "Enter" && handleBlur();

  // ── Stake handlers ──
  const handleIncreaseStake = () => setStake((p) => p + 1);
  const handleDecreaseStake = () => setStake((p) => (p > 0 ? p - 1 : 0));
  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setStake(!isNaN(v) ? v : 0);
  };
  const handleQuickValues = (value: string) => {
    const add = Number(value.replace("+", "")) || 0;

    setQuickValue((prev) => Number(prev || 0) + add);

    setStake((prev) => Number(prev || 0) + add);
  };

  return (
    <>
      <style>{`
        .bs-circle-btn:hover { background: var(--bs-circle-btn-hover) !important; }
        .bs-quick-pill:hover { background: var(--bs-quick-pill-hover-bg) !important; border-color: var(--bs-quick-pill-hover-border) !important; }
        .bs-cancel-btn:hover { background: var(--bs-cancel-hover) !important; }
        .bs-stake-input::placeholder { color: var(--bs-stake-placeholder); }
      `}</style>

      <div className="w-full rounded-2xl border" style={{ borderColor: accentVar }}>
        <div className="p-4 flex flex-col gap-3">
          {/* HEADER */}
          <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--bs-event-name)" }}>
            {headerLabel}: <strong style={{ color: accentVar }}>{runner}</strong>
          </p>

          {/* ODDS + STAKE */}
          <div className="flex gap-2">
            {/* Odds */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <label className="text-[11px] ml-2.5" style={{ color: "var(--bs-label)" }}>{selectedBet?.isLineMarket?"Runs":"Odds"}</label>
              <div className="flex items-center rounded-full px-1 py-1 gap-1" style={{ background: "var(--bs-input-bg)", border: "1px solid var(--bs-odds-border)" }}>
                <button type="button" onClick={handleDecrease} className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "var(--bs-circle-btn-bg)", color: "var(--bs-text)" }}><Minus className="w-3 h-3" /></button>
                <input value={inputValue} inputMode="numeric" type="number" step="0.01" onChange={handleChange} onBlur={handleBlur} onKeyDown={handleKeyDown} className="flex-1 min-w-0 w-0 bg-transparent border-none text-center text-[14px] font-semibold outline-none" style={{ color: "var(--bs-text)" }} />
                <button type="button" onClick={handleIncrease} className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer" style={{ background: "var(--bs-circle-btn-bg)", color: "var(--bs-text)" }}><Plus className="w-3 h-3" /></button>
              </div>
            </div>

            {/* Stake */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <label className="text-[11px] ml-2.5" style={{ color: "var(--bs-label)" }}>Stake</label>
              <div className="flex items-center rounded-full px-1 py-1 gap-1" style={{ background: "var(--bs-input-bg)", border: `1px solid ${accentVar}` }}>
                <button type="button" onClick={handleDecreaseStake} className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer" style={{ background: accentBg15, color: accentVar }}><Minus className="w-3 h-3" /></button>
                <input value={stake !== 0 ? stake : ""} placeholder="0" inputMode="numeric" type="number" onChange={handleStakeChange} className="bs-stake-input flex-1 min-w-0 w-0 bg-transparent border-none text-center text-[14px] font-semibold outline-none" style={{ color: accentVar, "--bs-stake-placeholder": accentVar } as React.CSSProperties} />
                <button type="button" onClick={handleIncreaseStake} className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer" style={{ background: accentBg15, color: accentVar }}><Plus className="w-3 h-3" /></button>
              </div>
            </div>
          </div>

          {/* QUICK STAKE PILLS */}
          <div className="grid grid-cols-4 gap-2">
            {quickValues.map((value, i) => (
              <button key={i} onClick={() => handleQuickValues(value)} className="bs-quick-pill py-2 rounded-full font-semibold text-[12px] cursor-pointer" style={{ background: "var(--bs-quick-pill-bg)", border: "1px solid var(--bs-quick-pill-border)", color: "var(--bs-text)" }}>{value}</button>
            ))}
          </div>

          {/* CANCEL + PLACE BET */}
          <div className="flex gap-3">
            <button type="button" onClick={() => { clearSelectedBet(); setStake(0); setQuickValue(0); }} className="bs-cancel-btn flex-1 py-2 rounded-full font-bold text-[14px] border-none cursor-pointer" style={{ background: "var(--bs-cancel-bg)", color: "var(--bs-text)" }}>Cancel</button>
            <button type="button" disabled={stake === 0} className="flex-1 py-2 rounded-full text-white font-bold text-[14px] border-none transition-all" style={{ background: accentVar, cursor: stake === 0 ? "not-allowed" : "pointer", opacity: stake === 0 ? 0.45 : 1 }}>
              Place Bet
              {stake !== 0 && (
                <div className="text-center rounded-full text-[10px]">
                  <span>{isBack ? "Profit: " : "Liability: "}</span>
                  <span className="font-bold">${profitOrLiability}</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}