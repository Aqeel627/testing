"use client";

import React, { useState } from "react";

export default function BetSlipUI() {
  const [odds, setOdds] = useState<number>(1.35);
  const [stake, setStake] = useState<number | "">("");
  const [keepChecked, setKeepChecked] = useState(true);
const [fillOrKill, setFillOrKill] = useState(false);

  const incOdds = () => setOdds((p) => Number((p + 0.01).toFixed(2)));
  const decOdds = () =>
    setOdds((p) => Number(Math.max(1.01, p - 0.01).toFixed(2)));

  const quick = [100, 200, 500, 5000, 10000, 25000, 50000, 100000];

  return (
    <section className="z-[999] w-full px-[5px lg:px-0">
      <div className="w-full pl-[11px]! flex flex-col gap-4 text-[#212B36] dark:text-white lg:px-[8px]">
        <div className="w-full leading-[20px]">
          <h6 className="hidden pt-2.5 text-[0.875rem] font-medium text-[#212B36] dark:text-white lg:block">
            Jan-lennard Struff v Carlos Alcaraz
          </h6>

          <div className="flex justify-between ">
            <div className="mt-[1px] leading-[18px] text-[#212B36] dark:text-white">
              <h2 className="text-[14.35px] text-[#212B36] dark:text-white">
                Match Odds
              </h2>
              <h6 className="text-[10.8px] text-[#212B36] dark:text-white">
                LAY
                <span className="pl-1 text-[#919eab] dark:text-[#cbd5e1]">
                  CARLOS ALCARAZ
                </span>
              </h6>
            </div>

            <div className="text-end text-[14px] leading-[18px] text-[#212B36] dark:text-white">
              <h6>Min: 100</h6>
              <h6>Max: 25T</h6>
            </div>
          </div>
        </div>

        <div>
       <div className="flex gap-2 pb-[5px] pt-[6.5px] items-center">
  {/* Odds Input with +/- buttons */}
     <div className="relative w-[150px]">
              <button
                type="button"
                onClick={decOdds}
                className="absolute left-[1px] top-[1px] z-50 h-[30px] cursor-pointer rounded-l-[6px] bg-[#098DEE] pt-[1px]"
                aria-label="Decrease odds"
              >
                <img src="/minus.svg" width={24} alt="" />
              </button>

              <button
                type="button"
                onClick={incOdds}
                className="absolute right-[1px] top-[1px] z-50 h-[30px] cursor-pointer rounded-r-[6px] bg-[#098DEE] pt-[1px]"
                aria-label="Increase odds"
              >
                <img src="/plus.svg" width={24} alt="" />
              </button>

              <input
                type="number"
                name="betsOdds"
                id="betsOdds"
                value={odds}
                onChange={(e) => setOdds(Number(e.target.value || 0))}
                className="block h-[25px] w-[150px] rounded py-[16px] pl-1 text-center text-[14px] font-[600] text-black focus:outline-none"
                style={{ backgroundColor: "rgb(3, 178, 255)" }}
              />
            </div>

  {/* Stake Input */}
  <input
    type="number"
    name="betsStake"
    id="betsStakes"
    value={stake}
    onChange={(e) =>
      setStake(e.target.value === "" ? "" : Number(e.target.value))
    }
    className="block w-[75px] rounded border border-[rgba(145,_158,_171,_0.2)] bg-transparent py-1 pl-[5px] text-[14px] font-[300] text-[#212B36] focus:outline-none dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
  />

  {/* Checkboxes Column */}
  <div className="flex flex-col gap-4 ml-2">
    {/* Keep Checkbox */}
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        defaultChecked
        className="peer sr-only"
      />
      <div className="relative w-[16px] h-[16px] rounded bg-transparent border border-[rgba(145,158,171,0.2)] peer-checked:bg-[#098DEE] peer-checked:border-[#098DEE] transition">
       <svg 
  className="absolute inset-0 w-full h-full opacity-0 peer-checked:opacity-100"
  viewBox="0 0 24 24"
  fill="white"
>

          <path d="M17 2a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm-1.625 7.255-4.13 4.13-1.75-1.75a.881.881 0 0 0-1.24 0c-.34.34-.34.89 0 1.24l2.38 2.37c.17.17.39.25.61.25.23 0 .45-.08.62-.25l4.75-4.75c.34-.34.34-.89 0-1.24a.881.881 0 0 0-1.24 0Z"/>
        </svg>
      </div>
      <span className="ml-1.5 text-[14px] font-normal text-[#212B36] dark:text-white">Keep</span>
    </label>

    {/* Fill Or Kill Checkbox */}
<label className="flex items-center cursor-pointer">
  <input
    type="checkbox"
    className="peer sr-only"
  />

  <div className="relative w-[16px] h-[16px] rounded bg-transparent border border-[rgba(145,158,171,0.2)] 
  transition peer-checked:bg-[#098DEE] peer-checked:border-[#098DEE]">

  <svg 
  className="absolute inset-0 w-full h-full opacity-0 peer-checked:opacity-100"
  viewBox="0 0 24 24"
  fill="white"
>

      <path d="M17 2a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm-1.625 7.255-4.13 4.13-1.75-1.75a.881.881 0 0 0-1.24 0c-.34.34-.34.89 0 1.24l2.38 2.37c.17.17.39.25.61.25.23 0 .45-.08.62-.25l4.75-4.75c.34-.34.34-.89 0-1.24a.881.881 0 0 0-1.24 0Z"/>
    </svg>

  </div>

  <span className="ml-1.5 text-[14px] font-normal text-[#212B36] dark:text-white">
    Fill Or Kill
  </span>
</label>

  </div>
</div>

          <div className="grid grid-cols-4 gap-2 pt-5">
            {quick.slice(0, 4).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setStake(v)}
                className="w-full  rounded-[8px] border border-[rgba(145,_158,_171,_0.32)] bg-transparent py-[6.5px] text-center text-[14px] font-bold text-[#212B36] shadow-none duration-300 hover:border-current hover:bg-[rgba(33,_43,_54,_0.06)] hover:shadow-[currentcolor_0px_0px_0px_0.5px] dark:text-white dark:hover:bg-[rgba(255,_255,_255,_0.08)] "
              >
                {v}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 pt-[8px]">
            {quick.slice(4, 8).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setStake(v)}
                className="w-full rounded-[8px] border border-[rgba(145,_158,_171,_0.32)] bg-transparent py-[6.5px] text-center text-[14px] font-bold text-[#212B36] shadow-none duration-300 hover:border-current hover:bg-[rgba(33,_43,_54,_0.06)] hover:shadow-[currentcolor_0px_0px_0px_0.5px] dark:text-white dark:hover:bg-[rgba(255,_255,_255,_0.08)] "
              >
                {v}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-[40%_60%] w-full gap-2 pb-[5.25px] pt-[10px] lg:w-auto">
            <button
              type="button"
              className=" rounded-[8px] border border-[rgba(255,_86,_48,_0.5)] bg-transparent py-[6.5px] text-[14px] font-[600] text-[#ff5630] shadow-none duration-300 hover:border-current hover:bg-[rgba(255,_86,_48,_0.08)] hover:shadow-[currentcolor_0px_0px_0px_0.5px] "
            >
              Cancel
            </button>

            <button
              type="button"
              className="rounded-[8px] bg-[#22c55e] py-[6.5px] text-[14px] font-[600] text-[#fff] shadow-none duration-300 hover:border-current hover:bg-[rgb(17,_141,_87)] hover:shadow-[rgba(34,_197,_94,_0.24)_0px_8px_16px_0px] "
            >
              PLace Bet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
