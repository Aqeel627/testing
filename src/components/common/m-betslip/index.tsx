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

  const numbers = [
    ["1", "2", "3", "4", "5", "6"],
    ["7", "8", "9", "0", "00", "."],
  ];

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

  // Odds handlers
  const handleIncrease = () => {
    const increment = getIncrement(odds);
    const newVal = odds + increment;
    setOdds(formatTwoDecimals(newVal));
    setInputValue(newVal.toFixed(2));
  };

  const handleDecrease = () => {
    if (!odds || odds <= 1.01) return;
    const increment = getIncrement(odds);
    let newVal = odds - increment;
    if (newVal < 1.01) newVal = 1.01;
    setOdds(formatTwoDecimals(newVal));
    setInputValue(newVal.toFixed(2));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBlur();
  };

  // Stake handlers
  const handleIncreaseStake = () => setStake((prev) => prev + 1);
  const handleDecreaseStake = () =>
    setStake((prev) => (prev > 0 ? prev - 1 : 0));

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) setStake(value);
    else setStake(0);
  };

  const handleQuickValues = (value: string) => {
    const addValue = Number(value.replace("+", ""));
    setQuickValue((prev) => {
      const newValue = prev + addValue;
      setStake(newValue);
      return newValue;
    });
  };

  const handleNumberClick = (num: any) => {
    setStake((prev: any) => {
      if (prev === 0) return num;
      return prev + num;
    });
  };

  const handleRemove = () => {
    setStake((prev) => {
      const str = prev.toString();
      if (str.length <= 1) return 0;
      return Number(str.slice(0, -1));
    });
  };

  return (
    <div className="h-[245px] min-[576px]:h-auto">
      <div>
        <section className="text-[12px] h-[127px] min-[576px]:h-auto">
          <div>
            <div
              className={`${type === "back" ? "bg-[#dbefff]" : "bg-[#f3dce2]"} text-[#303030] p-[10px]`}
            >
              <div className="p-1">
                {/* Runner label */}
                <div className="place-bet-content">
                  <div className="mb-[10px]">
                    <div className="flex">
                      <div className="shrink-0 mr-[3px]">{type} (BetFor):</div>
                      <div className="font-bold">
                        <span>{runner}</span>
                        <span>-</span>
                        <span>ODDS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Odds + Stake + Buttons row */}
                <div className="w-full min-[576px]:flex min-[576px]:justify-center min-[576px]:items-center">
                  {/* Odds */}
                  <div className="w-[calc(50%_-_5px)] float-left">
                    <div className="flex">
                      <button
                        type="button"
                        onClick={handleDecrease}
                        className="bg-[#dcdcdc] px-[15px] py-[10px] w-10 min-w-10 h-[29px] cursor-pointer font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-full text-center">
                        <input
                          value={inputValue}
                          type="number"
                          step="0.01"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          onKeyDown={handleKeyDown}
                          placeholder="Odds"
                          className="bg-white h-[29px] w-full text-center focus:outline-0 !text-[12px] font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleIncrease}
                        className="bg-[#dcdcdc] px-[15px] py-[10px] w-10 h-[29px] cursor-pointer font-bold"
                      >
                       <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Stake */}
                  <div className="ml-[10px] w-[calc(50%_-_5px)] float-left">
                    <div className="flex">
                      <button
                        type="button"
                        onClick={handleDecreaseStake}
                        className="bg-[#dcdcdc] px-[15px] py-[10px] w-10 h-[29px] cursor-pointer font-bold"
                      >
                       <Minus className="w-3 h-3" />
                      </button>
                      <div className="w-full text-center">
                        <input
                          value={stake !== 0 ? stake : ""}
                          placeholder="Stake"
                          type="number"
                          onChange={handleStakeChange}
                          className="bg-white h-[29px] w-full text-center focus:outline-0 !text-[12px] font-bold"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleIncreaseStake}
                        className="bg-[#dcdcdc] px-[15px] py-[10px] w-10 h-[29px] cursor-pointer"
                      >
                     <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Cancel */}
                  <button
                    type="button"
                    className="px-1 max-[576px]:mt-[15px] w-[calc(50%_-_5px)] h-[29px] bg-[#dcdcdc] font-bold min-[576px]:ml-[10px]"
                    onClick={() => {
                      clearSelectedBet();
                      setStake(0);
                      setQuickValue(0);
                    }}
                  >
                    Cancel
                  </button>

                  {/* Place Bet */}
                  <button
                    type="button"
                    disabled={stake === 0}
                    className={`px-1 max-[576px]:mt-[10px] ml-[10px] w-[calc(50%_-_5px)] h-[29px] font-bold ${
                      stake === 0
                        ? "bg-[var(--primary-color)] opacity-80 text-white cursor-not-allowed"
                        : "bg-[var(--primary-color)] text-white hover:bg-[#105EB4]"
                    }`}
                  >
                    <span>Place bet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Quick values */}
      <div className="text-[14px] bg-[#dcdcdc] text-[#303030] table table-fixed w-full h-[35px] relative top-[1px] min-[576px]:top-0">
        {quickValues.map((value, index) => (
          <div
            key={index}
            onClick={() => handleQuickValues(value)}
            className="table-cell border-l border-b border-white px-2 !h-[34px] align-middle box-border text-center whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer hover:bg-[#c0c0c0] transition"
          >
            {value}
          </div>
        ))}
      </div>

      {/* Number pad */}
      <div className="text-[14px] pb-[5px] pl-[5px] pt-[2px] min-[576px]:pt-0 bg-[#dcdcdc] table w-full">
        <div className="mt-[5px] flex gap-[5px] justify-center items-center w-full">
          {/* Digit grid */}
          <div className="h-[73px] w-[86%] min-[576px]:flex min-[576px]:justify-center min-[576px]:items-center min-[576px]:gap-[5px] min-[576px]:h-auto">
            {numbers.map((num, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex w-full gap-x-[5px] ${rowIndex > 0 ? "max-[576px]:mt-[5px]" : ""}`}
              >
                {num.map((value, i) => (
                  <div
                    key={i}
                    onClick={() => handleNumberClick(value)}
                    className="flex-1 text-center rounded-[3px] bg-white h-[34px] flex items-center justify-center text-[#303030] cursor-pointer"
                  >
                    {value}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Backspace */}
          <div className="h-[73px] w-[14%] pr-[5px] min-[576px]:pr-0 min-[576px]:w-[64.94px] min-[576px]:h-[35px] min-[576px]:flex-[0.9]">
           <div
  onClick={handleRemove}
  className="flex items-center h-full justify-center bg-white rounded-[3px] align-middle cursor-pointer"
>
  <img src="/cross-icon.svg" className="w-[21px] h-4" alt="remove" />
</div>
          </div>
        </div>
      </div>
    </div>
  );
}
