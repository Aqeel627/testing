"use client";
import { CONFIG } from "@/lib/config";
import { http } from "@/lib/axios-instance";
import { useAppStore } from "@/lib/store/store";
import { Minus, Plus } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { eventBus } from "@/lib/eventBus";
import { useToast } from "@/components/common/toast/toast-context";
import { useAuthStore } from "@/lib/useAuthStore";
import { useCacheStore } from "@/lib/store/cacheStore";
import { usePathname } from "next/navigation";
import { betAudio } from "@/lib/audioFeedback";

function parseMsg(raw: string) {
  const parts = String(raw || "")
    .split(/',\s*'/)
    .map((p) => p.replace(/^'+|'+$/g, "").trim());
  return {
    status: (parts[0] || "success") as "success" | "error" | "info" | "warning",
    title: parts[1] || "Done",
    desc: parts[2] || "",
  };
}

function getSide(type: string): "BACK" | "LAY" {
  if (type === "back") return "BACK";
  if (type === "lay") return "LAY";
  if (type === "yes") return "BACK";
  if (type === "no") return "LAY";
  return "BACK";
}

const MIN_STAKE = 2;

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

function getIncrement(value: number): number {
  if (value >= lowerUpperArray[lowerUpperArray.length - 1].upperBound)
    return lowerUpperArray[lowerUpperArray.length - 1].increment;
  for (const range of lowerUpperArray) {
    if (value >= range.lowerBound && value < range.upperBound)
      return range.increment;
  }
  return 0.01;
}

export default function BetSlipUI() {
  const {
    selectedBet,
    clearSelectedBet,
    stakeValue,
    setUserBalance,
    setSlipPreview,
  } = useAppStore();
  const { showToast } = useToast();
  const { isLoggedIn } = useAuthStore();
  const { setLoginModal } = useCacheStore();
  const pathname = usePathname();

  const [odds, setOdds] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("0.00");
  const [stake, setStake] = useState<number>(0);
  const [placing, setPlacing] = useState(false);

  // ── Sync preview to store ───────────────────────────────────────
  useEffect(() => {
    setSlipPreview({ stake, price: odds });
  }, [stake, odds]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Reset on selectedBet change ─────────────────────────────────
  useEffect(() => {
    if (selectedBet?.odds) {
      const n = Number(selectedBet.odds);
      setOdds(n);
      setInputValue(n.toFixed(2));
    }
    setStake(0);
  }, [selectedBet]);

  // ── Clear on route change ───────────────────────────────────────
  useEffect(() => {
    clearSelectedBet();
    setStake(0);
    setSlipPreview({ stake: 0, price: 0 });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Dynamic quick stakes from store ────────────────────────────
  const quickValues = useMemo(() => {
    const stakes = stakeValue?.stake ?? stakeValue?.data?.stake ?? [];
    if (Array.isArray(stakes) && stakes.length > 0) {
      return stakes.map((s: any) => String(s.stakeAmount));
    }
    return ["25", "50", "75", "100"];
  }, [stakeValue]);

  if (!selectedBet) return null;

  const type = selectedBet.type;
  const runner = selectedBet.teamName;
  const isBack = type === "back" || type === "yes";

  const isSportsBook = selectedBet?.marketType === "SPORTSBOOK";
  const isLineMarket =
    selectedBet?.isLineMarket === true && selectedBet?.marketType !== "FANCY";

  const accentVar =
    isSportsBook || isLineMarket
      ? isBack
        ? "#50d0ae"
        : "#5baca7"
      : isBack
        ? "var(--bs-back-accent)"
        : "var(--bs-lay-accent)";

  const accentBg15 =
    isSportsBook || isLineMarket
      ? isBack
        ? "#50d0ae26"
        : "#5baca726"
      : isBack
        ? "var(--bs-back-accent-bg15)"
        : "var(--bs-lay-accent-bg15)";

  const profitOrLiability =
    stake > 0 && odds > 1 ? ((odds - 1) * stake).toFixed(2) : "0.00";

  const headerLabel =
    type === "back"
      ? "Back (Bet For)"
      : type === "lay"
        ? "Lay (Bet Against)"
        : type === "yes"
          ? "Yes (Bet For)"
          : "No (Bet Against)";

  const isPlaceDisabled = placing || stake < MIN_STAKE || odds <= 1;

  const handleIncrease = () => {
    const inc = getIncrement(odds);
    const nv = Number((odds + inc).toFixed(2));
    setOdds(nv);
    setInputValue(nv.toFixed(2));
  };

  const handleDecrease = () => {
    if (!odds || odds <= 1.01) return;
    const inc = getIncrement(odds);
    let nv = Number((odds - inc).toFixed(2));
    if (nv < 1.01) nv = 1.01;
    setOdds(nv);
    setInputValue(nv.toFixed(2));
  };

  const handleOddsChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputValue(e.target.value);

  const handleOddsBlur = () => {
    const val = parseFloat(inputValue);
    if (!isNaN(val)) {
      setOdds(Number(val.toFixed(2)));
      setInputValue(val.toFixed(2));
    } else {
      setOdds(1.01);
      setInputValue("1.01");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) =>
    e.key === "Enter" && handleOddsBlur();

  const handleIncreaseStake = () => setStake((p) => p + 1);
  const handleDecreaseStake = () => setStake((p) => (p > 0 ? p - 1 : 0));
  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setStake(!isNaN(v) ? v : 0);
  };

  const handleQuickValues = (amount: string) => {
    const add = Number(amount) || 0;
    setStake((prev) => Number(prev || 0) + add);
  };

  const handlePlaceBet = async () => {
    if (!isLoggedIn) {
      showToast(
        "warning",
        "Login Required",
        "Please login first to place a bet.",
      );
      setLoginModal(true);
      return;
    }

    if (!selectedBet || stake < MIN_STAKE) return;
    const p = Number((odds || 0).toFixed(2));
    if (p <= 1) return;

    const payload = {
      eventId: selectedBet.eventId,
      marketId: selectedBet.marketId,
      sportId: selectedBet.sportId,
      selectionId: selectedBet.selectionId,
      price: p,
      stake: Number((stake || 0).toFixed(2)),
      side: getSide(type),
      type: selectedBet.marketType || "MATCH_ODDS",
      matchMe: false,
    };

    try {
      setPlacing(true);
      const res: any = await http.post(CONFIG.placeBetURL, payload);

      const ok = res?.data?.meta?.status === true || res?.data?.status === true;
      const rawMessage = res?.data?.meta?.message || res?.data?.message || "";
      const msg = parseMsg(rawMessage);

     if (ok) {
  setTimeout(() => betAudio.playSuccess(), 0);

  showToast(
    msg.status,
    msg.title,
    msg.desc || "Bet placed successfully."
  );

  // 👇 Close slip AFTER small delay
  setTimeout(() => {
    clearSelectedBet();
    setStake(0);
    setSlipPreview({ stake: 0, price: 0 });
  }, 500); 

  try {
    const balRes: any = await http.post(CONFIG.getUserBalance, {});
    if (balRes?.data?.data) setUserBalance(balRes.data.data);
  } catch {}

  eventBus.emit("REFRESH_AFTER_PLACE", {
    sportId: selectedBet.sportId,
    eventId: selectedBet.eventId,
  });
} else {
        setTimeout(() => betAudio.playError(), 0);
        showToast(
          "error",
          msg.title || "Failed",
          msg.desc || "Please try again.",
        );
      }
    } catch (err: any) {
      setTimeout(() => betAudio.playError(), 0);
      const raw =
        err?.response?.data?.meta?.message || err?.message || "Network error.";
      const msg = parseMsg(raw);
      showToast("error", msg.title || "Error", msg.desc || raw);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div id="betSlipUI.tsx">
        <style>{`
        .bs-circle-btn:hover { background: var(--bs-circle-btn-hover) !important; }
        .bs-quick-pill:hover { background: var(--bs-quick-pill-hover-bg) !important; border-color: var(--bs-quick-pill-hover-border) !important; }
        .bs-cancel-btn:hover { background: var(--bs-cancel-hover) !important; }
        .bs-stake-input::placeholder { color: var(--bs-stake-placeholder); }
      `}</style>

        <div className="w-full p-2">
          <div
            className="w-full rounded-2xl border"
            style={{ borderColor: accentVar }}
          >
            <div className="p-4 flex flex-col gap-3">
              {/* HEADER */}
              <p
                className="text-[13px] font-semibold leading-tight"
                style={{ color: "var(--bs-event-name)" }}
              >
                {headerLabel}:{" "}
                <strong style={{ color: accentVar }}>{runner}</strong>
              </p>

              {/* ODDS + STAKE */}
              <div className="flex gap-2">
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <label
                    className="text-[11px] ml-2.5"
                    style={{ color: "var(--bs-label)" }}
                  >
                    {selectedBet?.isLineMarket ? "Runs" : "Odds"}
                  </label>
                  <div
                    className="flex items-center rounded-full px-1 py-1 gap-1"
                    style={{
                      background: "var(--bs-input-bg)",
                      border: "1px solid var(--bs-odds-border)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleDecrease}
                      className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                      style={{
                        background: "var(--bs-circle-btn-bg)",
                        color: "var(--bs-text)",
                      }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      value={inputValue}
                      type="text"
                      inputMode="decimal"
                      step="0.01"
                      onChange={handleOddsChange}
                      onBlur={handleOddsBlur}
                      onKeyDown={handleKeyDown}
                      className="flex-1 min-w-0 w-0 bg-transparent border-none text-center text-[14px] font-semibold outline-none"
                      style={{ color: "var(--bs-text)" }}
                    />
                    <button
                      type="button"
                      onClick={handleIncrease}
                      className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                      style={{
                        background: "var(--bs-circle-btn-bg)",
                        color: "var(--bs-text)",
                      }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <label
                    className="text-[11px] ml-2.5"
                    style={{ color: "var(--bs-label)" }}
                  >
                    Stake
                  </label>
                  <div
                    className="flex items-center rounded-full px-1 py-1 gap-1"
                    style={{
                      background: "var(--bs-input-bg)",
                      border: `1px solid ${accentVar}`,
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleDecreaseStake}
                      className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: accentBg15, color: accentVar }}
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <input
                      value={stake !== 0 ? stake : ""}
                      placeholder="0"
                       type="text"
                      inputMode="decimal"
                      onChange={handleStakeChange}
                      className="bs-stake-input flex-1 min-w-0 w-0 bg-transparent border-none text-center text-[14px] font-semibold outline-none"
                      style={
                        {
                          color: accentVar,
                          "--bs-stake-placeholder": accentVar,
                        } as React.CSSProperties
                      }
                    />
                    <button
                      type="button"
                      onClick={handleIncreaseStake}
                      className="bs-circle-btn w-7 h-7 shrink-0 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ background: accentBg15, color: accentVar }}
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* QUICK STAKES */}
              <div className="grid grid-cols-4 gap-2">
                {quickValues.map((value, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickValues(value)}
                    className="bs-quick-pill py-2 rounded-full font-semibold text-[12px] cursor-pointer"
                    style={{
                      background: "var(--bs-quick-pill-bg)",
                      border: "1px solid var(--bs-quick-pill-border)",
                      color: "var(--bs-text)",
                    }}
                  >
                    {value}
                  </button>
                ))}
              </div>

              {/* CANCEL + PLACE BET */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearSelectedBet();
                    setStake(0);
                    setSlipPreview({ stake: 0, price: 0 });
                  }}
                  disabled={placing}
                  className="bs-cancel-btn flex-1 py-2 rounded-full font-bold text-[14px] border-none cursor-pointer"
                  style={{
                    background: "var(--bs-cancel-bg)",
                    color: "var(--bs-text)",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handlePlaceBet}
                  disabled={isPlaceDisabled}
                  className="flex-1 py-2 rounded-full text-white font-bold text-[14px] border-none transition-all"
                  style={{
                    background: accentVar,
                    cursor: isPlaceDisabled ? "not-allowed" : "pointer",
                    opacity: isPlaceDisabled ? 0.45 : 1,
                  }}
                >
                  {placing ? (
                    "Placing…"
                  ) : (
                    <>
                      Place Bet
                      {stake >= MIN_STAKE && (
                        <div className="text-center rounded-full text-[10px]">
                          <span>{isBack ? "Profit: " : "Liability: "}</span>
                          <span className="font-bold">
                            ${profitOrLiability}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
