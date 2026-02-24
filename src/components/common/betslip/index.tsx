"use client";
import { useAppStore } from "@/lib/store/store";
import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function BetSlipUI() {
  const [odds, setOdds] = useState<number>(0);
  const [stake, setStake] = useState<number | "">("");
  const [keepChecked, setKeepChecked] = useState(true);
  const [fillOrKill, setFillOrKill] = useState(false);
  const [showStakeForm, setShowStakeForm] = useState(false);
  const [totalStakeAmount, setTotalStakeAmount] = useState("");
  const [showLiabilityForm, setShowLiabilityForm] = useState(false);
  const [totalLiabilityAmount, setTotalLiabilityAmount] = useState("");

  const stakeFormRef = useRef<HTMLDivElement>(null);
  const liabilityFormRef = useRef<HTMLDivElement>(null);

  const { selectedBet, clearSelectedBet } = useAppStore();

  useEffect(() => {
    // Log the selectedBet type
    // console.log("selectedBet.type in betslip:", selectedBet?.type);
    if (selectedBet?.odds) setOdds(Number(selectedBet.odds));
    setStake("");
  }, [selectedBet]);

  // Close forms when clicking outside
  useEffect(() => {

    const handleClickOutside = (event: MouseEvent) => {
      if (
        stakeFormRef.current &&
        !stakeFormRef.current.contains(event.target as Node)
      ) {
        setShowStakeForm(false);
      }
      if (
        liabilityFormRef.current &&
        !liabilityFormRef.current.contains(event.target as Node)
      ) {
        setShowLiabilityForm(false);
      }
    };
    if (showStakeForm || showLiabilityForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showStakeForm, showLiabilityForm]);

  const incOdds = () => setOdds((p) => Number((p + 0.01).toFixed(2)));
  const decOdds = () =>
    setOdds((p) => Number(Math.max(1.01, p - 0.01).toFixed(2)));

  const quick = [100, 200, 500, 5000, 10000, 25000, 50000, 100000];

  const profit = stake && odds ? Number(stake) * (odds - 1) : 0;
  const liability = stake && odds ? Number(stake) * (odds - 1) : 0;

  const handleStakeFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStake(Number(totalStakeAmount) || "");
    setShowStakeForm(false);
  };

  const handleLiabilityFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStake(Number(totalLiabilityAmount) || "");
    setShowLiabilityForm(false);
  };

  const pathname = usePathname();
  useEffect(() => {
    clearSelectedBet();
    setStake("");
  }, [pathname]);

  if (!selectedBet) return null;

  const isBack = selectedBet.type === "back";
  const isLay = selectedBet.type === "lay";
  const isNo = selectedBet.type === "no";
  const isYes = selectedBet.type === "yes";


  return (
    <section className="block relative w-full">
      <div className="max-h-[355px] overflow-auto">
        {/* Header */}
        <header className="bg-[#1A2C38] text-white p-2">
          <h2 className="font-bold text-left text-[12px] m-0 p-0 leading-[1]">
            Current odds bets
          </h2>
        </header>

        {/* ── BACK BET SECTION ── */}
        {isBack && (
          <div className="relative text-black">
            {/* Sub-header */}
            <header className="bg-[#a6d8ff] p-1 flex justify-between items-center text-[11px]">
              <span className="leading-[16px]">Back (Bet For)</span>
              <div className="flex relative">
                <span className="text-center w-16 max-h-[16px]">Odds</span>
                <span className="text-center w-16 max-h-[16px]">
                  <span
                    className="text-[#2789ce] cursor-pointer hover:underline"
                    onClick={() => {
                      setShowLiabilityForm(false);
                      setShowStakeForm(true);
                    }}
                  >
                    Stake
                  </span>
                  <span className="w-[13px] h-[13px] cursor-help pl-[1px] text-[#2789ce]">
                    [ ? ]
                  </span>
                </span>
                <span className="text-center w-16 max-h-[16px]">Profit</span>
              </div>
            </header>

            {/* Back bet row */}
            <section className="bg-[#dbefff]">
              <div className="flex p-1 items-center">
                <section className="flex justify-between w-full items-center max-h-fit">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        clearSelectedBet();
                        setStake("");
                      }}
                      className="rounded-[2px] text-[#303030] inline-flex w-3 h-3 p-0 hover:bg-[#e0e0e0] items-center justify-center mx-1 cursor-pointer"
                    >
                      <svg
                        className="w-[6.5px] h-[6.5px] fill-[#303030]"
                        viewBox="0 0 100 100"
                      >
                        <path d="M100,12.5L87.5,0L50,37.5L12.5,0L0,12.5L37.5,50L0,87.5L12.5,100L50,62.5L87.5,100L100,87.5L62.5,50L100,12.5z" />
                      </svg>
                    </button>
                    <span className="font-bold text-[13px] leading-[16px]">
                      {selectedBet.teamName ?? "Name-Pending"}
                    </span>
                  </div>
                  {/* Event / market info */}
                  <span className="text-[10px] text-[#555] pr-1">
                    {selectedBet.marketType}
                  </span>
                </section>

                <div className="flex items-center min-w-[187px] max-h-fit">
                  {/* Odds control */}
                  <div className="w-[64px]">
                    <div className="relative max-h-[21.5px] flex items-center">
                      <input
                        className="p-[2px_14px_2px_0] border border-[#dcdcdc] text-center w-full text-[11px] outline-none max-h-[21.5px] bg-[rgb(3,178,255)]"
                        value={odds}
                        name="betsOdds"
                        type="number"
                        onChange={(e) => setOdds(Number(e.target.value || 0))}
                      />
                      <div className="absolute top-0 right-[2px] h-full flex flex-col justify-around p-[1px_0]">
                        <button
                          type="button"
                          onClick={incOdds}
                          className="w-2 h-[7px] p-0 border-0 bg-transparent cursor-pointer text-[8px] leading-none"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={decOdds}
                          className="w-2 h-[7px] p-0 border-0 bg-transparent cursor-pointer text-[8px] leading-none"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Stake input */}
                  <div className="w-[64px] ml-2 max-h-[21.5px] flex items-center">
                    <input
                      className="p-[2px_0] border border-[#dcdcdc] text-center w-full text-[11px] outline-none max-h-[21.5px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      name="betsStake"
                      type="number"
                      value={stake}
                      onChange={(e) =>
                        setStake(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  {/* Profit display */}
                  <span className="ml-2 text-[11px]">£{profit.toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Min/Max info */}
            <div className="bg-[#dbefff] px-2 pb-1 text-[10px] text-[#555] flex gap-3">
              <span>Min: 100</span>
              <span>Max: 25T</span>
            </div>

            {/* Quick stake buttons */}
            <div className="bg-[#dbefff] px-1 pb-1">
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(0, 4).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[rgba(145,158,171,0.32)] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(4, 8).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[rgba(145,158,171,0.32)] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── LAY BET SECTION ── */}
        {isLay && (
          <div className="relative text-black">
            {/* Sub-header */}
            <header className="bg-[#fac9d4] p-1 flex justify-between items-center text-[11px] relative">
              <span className="leading-[16px]">Lay (Bet Against)</span>
              <div className="flex relative">
                <span className="text-center w-16 leading-[16px]">
                  Backer's odds
                </span>
                <span className="text-center w-16 leading-[16px]">
                  Backer's stake
                </span>
                <div className="relative left-8">
                  <span className="text-[11px] mr-12  leading-[16px] cursor-help">
                    {"["}
                    <span className="items-end text-[#2889ce]">?</span>
                    {"]"}
                  </span>
                </div>
              </div>
            </header>

            {/* Lay bet row */}
            <section className="bg-[#FFE9EE]">
              <div className="flex p-1 items-center">
                <section className="flex justify-between w-full items-center max-h-fit">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        clearSelectedBet();
                        setStake("");
                      }}
                      className="rounded-[2px] text-[#303030] inline-flex w-3 h-3 p-0 hover:bg-[#e0e0e0] items-center justify-center mx-1 cursor-pointer"
                    >
                      <svg
                        className="w-[6.5px] h-[6.5px] fill-[#303030]"
                        viewBox="0 0 100 100"
                      >
                        <path d="M100,12.5L87.5,0L50,37.5L12.5,0L0,12.5L37.5,50L0,87.5L12.5,100L50,62.5L87.5,100L100,87.5L62.5,50L100,12.5z" />
                      </svg>
                    </button>
                    <span className="font-bold text-[13px] leading-[16px]">
                      {selectedBet.teamName ?? "Name-Pending"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#555] pr-1">
                    {selectedBet.marketType}
                  </span>
                </section>

                <div className="flex items-center min-w-[187px] max-h-fit">
                  {/* Odds control */}

                  {/* Stake input */}
                  <div className="w-[64px] ml-2 max-h-[21.5px] flex items-center">
                    {/* <input
                      className="p-[2px_0] border border-[#dcdcdc] text-center w-full text-[11px] outline-none max-h-[21.5px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      name="betsStake"
                        type="number"
                        onChange={(e) => setOdds(Number(e.target.value || 0))}
                    /> */}

                    <input
                      className="p-[2px_14px_2px_0] border border-[#dcdcdc] text-center w-full text-[11px] outline-none max-h-[21.5px] "
                      value={odds}
                      name="betsOdds"
                      type="number"
                      onChange={(e) => setOdds(Number(e.target.value || 0))}
                    />
                  </div>
                  {/* Liability display */}
                  <span className="ml-2 text-[11px]">
                    £{liability.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Min/Max info */}
            <div className="bg-[#FFE9EE] px-2 pb-1 text-[10px] text-[#555] flex gap-3">
              <span>Min: 100</span>
              <span>Max: 25T</span>
            </div>

            {/* Quick stake buttons */}
            <div className="bg-[#FFE9EE] px-1 pb-1">
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(0, 4).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[rgba(145,158,171,0.32)] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(4, 8).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[rgba(145,158,171,0.32)] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/*  no market*/}
        {isNo && (
          <div className="relative text-black">
            {/* Sub-header */}
            <header className="bg-[#5baca7] p-1 flex justify-between items-center text-[11px] relative">
              <span className="leading-[16px]">Lay (Bet Against)</span>
              <div className="flex relative">
                <span className="text-center w-16 leading-[16px]">
                  Backer's odds
                </span>
                <span className="text-center w-16 leading-[16px]">
                  Backer's stake
                </span>
                <div className="relative left-8">
                  <span className="text-[11px] mr-12  leading-[16px] cursor-help">
                    {"["}
                    <span className="items-end text-[#2889ce]">?</span>
                    {"]"}
                  </span>
                </div>
              </div>
            </header>

            {/* Lay bet row */}
            <section className="bg-[#6FC1BC]">
              <div className="flex p-1 items-center">
                <section className="flex justify-between w-full items-center max-h-fit">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        clearSelectedBet();
                        setStake("");
                      }}
                      className="rounded-[2px] text-[#303030] inline-flex w-3 h-3 p-0 hover:bg-[#e0e0e0] items-center justify-center mx-1 cursor-pointer"
                    >
                      <svg
                        className="w-[6.5px] h-[6.5px] fill-[#303030]"
                        viewBox="0 0 100 100"
                      >
                        <path d="M100,12.5L87.5,0L50,37.5L12.5,0L0,12.5L37.5,50L0,87.5L12.5,100L50,62.5L87.5,100L100,87.5L62.5,50L100,12.5z" />
                      </svg>
                    </button>
                    <span className="font-bold text-[13px] leading-[16px]">
                      {selectedBet.teamName ?? "Name-Pending"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#555] pr-1">
                    {selectedBet.marketType}
                  </span>
                </section>

                <div className="flex items-center min-w-[187px] max-h-fit">
                  {/* Odds control */}

                  {/* Stake input */}
                  <div className="w-[64px] ml-2 max-h-[21.5px] flex items-center">
                    {/* <input
                      className="p-[2px_0] border border-[#87D8D2] text-center w-full text-[11px] outline-none max-h-[21.5px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      name="betsStake"
                      type="number"
                      value={stake}
                      onChange={(e) =>
                        setStake(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    /> */}
                    <input
                      className="p-[2px_14px_2px_0] border border-[#87D8D2] text-center w-full text-[11px] outline-none max-h-[21.5px] "
                      value={odds}
                      name="betsOdds"
                      type="number"
                      onChange={(e) => setOdds(Number(e.target.value || 0))}
                    />


                  </div>
                  {/* Liability display */}
                  <span className="ml-2 text-[11px]">
                    £{liability.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Min/Max info */}
            <div className="bg-[#6FC1BC] px-2 pb-1 text-[10px] text-[#555] flex gap-3">
              <span>Min: 100</span>
              <span>Max: 25T</span>
            </div>

            {/* Quick stake buttons */}
            <div className="bg-[#6FC1BC] px-1 pb-1">
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(0, 4).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[rgba(145,158,171,0.32)] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(4, 8).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[rgba(145,158,171,0.32)] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* yes market */}
        {isYes && (
          <div className="relative text-black">
            {/* Sub-header */}
            <header className="bg-[#50d0ae] p-1 flex justify-between items-center text-[11px] relative">
              <span className="leading-[16px]">Lay (Bet Against)</span>
              <div className="flex relative">
                <span className="text-center w-16 leading-[16px]">
                  Backer's odds
                </span>
                <span className="text-center w-16 leading-[16px]">
                  Backer's stake
                </span>
                <div className="relative left-8">
                  <span className="text-[11px] mr-12  leading-[16px] cursor-help">
                    {"["}
                    <span className="items-end text-[#2889ce]">?</span>
                    {"]"}
                  </span>
                </div>
              </div>
            </header>

            {/* Lay bet row */}
            <section className="bg-[#6EE1BF]">
              <div className="flex p-1 items-center">
                <section className="flex justify-between w-full items-center max-h-fit">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => {
                        clearSelectedBet();
                        setStake("");
                      }}
                      className="rounded-[2px] text-[#303030] inline-flex w-3 h-3 p-0 hover:bg-[#e0e0e0] items-center justify-center mx-1 cursor-pointer"
                    >
                      <svg
                        className="w-[6.5px] h-[6.5px] fill-[#303030]"
                        viewBox="0 0 100 100"
                      >
                        <path d="M100,12.5L87.5,0L50,37.5L12.5,0L0,12.5L37.5,50L0,87.5L12.5,100L50,62.5L87.5,100L100,87.5L62.5,50L100,12.5z" />
                      </svg>
                    </button>
                    <span className="font-bold text-[13px] leading-[16px]">
                      {selectedBet.teamName ?? "Name-Pending"}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#555] pr-1">
                    {selectedBet.marketType}
                  </span>
                </section>

                <div className="flex items-center min-w-[187px] max-h-fit">
                  {/* Odds control */}

                  {/* Stake input */}
                  <div className="w-[64px] ml-2 max-h-[21.5px] flex items-center">
                    {/* <input
                      className="p-[2px_0] border border-[#8DF1D1]  text-center w-full text-[11px] outline-none max-h-[21.5px] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      name="betsStake"
                      type="number"
                      value={stake}
                      onChange={(e) =>
                        setStake(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    /> */}

                    <input
                      className="p-[2px_14px_2px_0] border border-[#8DF1D1] text-center w-full text-[11px] outline-none max-h-[21.5px] "
                      value={odds}
                      name="betsOdds"
                      type="number"
                      onChange={(e) => setOdds(Number(e.target.value || 0))}
                    />
                  </div>
                  {/* Liability display */}
                  <span className="ml-2 text-[11px]">
                    £{liability.toFixed(2)}
                  </span>
                </div>
              </div>
            </section>

            {/* Min/Max info */}
            <div className="bg-[#6EE1BF] px-2 pb-1 text-[10px] text-[#555] flex gap-3">
              <span>Min: 100</span>
              <span>Max: 25T</span>
            </div>

            {/* Quick stake buttons */}
            <div className="bg-[#6FC1BC] px-1 pb-1">
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(0, 4).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[#87D8D2] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-1 pt-1">
                {quick.slice(4, 8).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setStake(v)}
                    className="w-full rounded-[2px] border border-[rgba(145,158,171,0.32)] bg-white py-[4px] text-center text-[11px] font-bold text-[#303030] hover:bg-[#e0e0e0]"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* ── FOOTER ── */}
        <div className="bg-[#122D38] p-1">
          <div className="flex justify-end text-right text-[12px] text-[#fff] p-[7px]">
            <span>
              <span className="font-bold">
                Liability : £{stake ? Number(stake).toFixed(2) : "0.00"}
              </span>
            </span>
          </div>

          {/* Keep / Fill Or Kill checkboxes */}
          <div className="flex gap-4 px-1 pb-1">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={keepChecked}
                onChange={(e) => setKeepChecked(e.target.checked)}
                className="mr-1"
                name="keepChecked"
              />
              <span className="text-[13px] text-white">Keep</span>
            </label>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={fillOrKill}
                onChange={(e) => setFillOrKill(e.target.checked)}
                className="mr-1"
                name="fillOrKill"
              />
              <span className="text-[13px] text-white">Fill Or Kill</span>
            </label>
          </div>

          <div className="flex">
            <button
              type="button"
              onClick={() => {
                clearSelectedBet();
                setStake("");
              }}
              className="bg-[#122D38] rounded-[2px] text-[#fff] inline-block p-[6px_12px] text-[13px] font-bold cursor-pointer hover:bg-[#e0e0e0] hover:text-[#000]"
            >
              Cancel all selections
            </button>
            <div className="flex-1 flex justify-end">
              <button
                type="button"
                className="rounded-[2px] inline-block p-[6px_12px] text-[13px] font-bold text-white bg-[#22c55e] hover:bg-[rgb(17,141,87)] cursor-pointer"
              >
                Place Bet
              </button>
            </div>
          </div>

          <div className="p-[8px_4px_5px] text-left text-[13px]">
            <label className="inline-block text-white">
              <input type="checkbox" className="mr-1" name="confirm" />
              Confirm bets before placing
            </label>
            <label className="inline-block ml-4 text-white">
              <input type="checkbox" className="mr-1" name="show-percent" />
              <span>Show % Book</span>
            </label>
          </div>
        </div>
      </div>

      {/* Stake Form Modal (for back bets) */}
      {showStakeForm && (
        <div className="absolute top-[47px] left-[225px] right-0 z-50">
          <div
            ref={stakeFormRef}
            className="bg-[#fff9d8] border border-[#7d97a8] p-2 h-[52.5px] mx-auto w-max"
          >
            <form
              onSubmit={handleStakeFormSubmit}
              className="h-full flex flex-col justify-between"
            >
              <p className="text-[#273a47] mb-[3px] text-[11px] text-left m-0 p-0 leading-[1]">
                Total Stake
              </p>
              <div className="flex items-center gap-1">
                <label className="inline-flex items-center leading-[19px]">
                  <span className="mr-1 text-[#273a47] text-[13px]">GBP</span>
                  <input
                    name="amount"
                    className="border text-[#273a47] border-[#dcdcdc] p-[2px_4px] text-[11px] w-[80px] max-h-[21.5px] outline-none"
                    type="text"
                    autoFocus
                    value={totalStakeAmount}
                    onChange={(e) => setTotalStakeAmount(e.target.value)}
                  />
                </label>
                <button
                  type="submit"
                  className="text-[11px] text-[#273a47] text-center leading-[16px] h-[18px] px-[10px] bg-[#cbcbcb] border-b border-[#94a8b3] rounded-[2px] cursor-pointer hover:bg-[#b0b0b0]"
                >
                  OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
