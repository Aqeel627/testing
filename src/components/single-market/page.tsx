"use client";

import Icon from "@/icons/icons";
import Link from "next/link";

export default function SingleaMarket() {
  return (
    <ul className="mt-2">
      <li className="w-full rounded-[2px] border border-dashed border-[rgba(145,158,171,0.16)] bg-[rgba(145,158,171,0.04)] text-white overflow-hidden">

        {/* MAIN ROW */}
        <div className="flex w-full flex-col min-[691px]:flex-row min-[1200px]:flex-col min-[1376px]:flex-row">

          {/* LEFT CONTENT – 60% */}
          <div className="w-full min-[691px]:w-[60%] min-[1200px]:w-full min-[1376px]:w-[60%] p-[5px]">
            <div className="flex flex-row whitespace-nowrap items-center max-w-full min-h-[1.125rem] overflow-hidden -mt-1 mr-5 -mb-1 -ml-1 text-[9px] font-bold tracking-[0.7px] uppercase text-[#098DEE]">
              <a href="" className="m-0 [font:inherit] [letter-spacing:inherit] text-[#078dee] no-underline relative rounded-[8px] py-1 px-0 inline-block">
                <div className="rounded-1 px-1">Cricket</div>
              </a>
              {/* <span></span> */}
              <span className="h-1 w-1 rounded-full bg-[rgb(99,115,129)]"></span>

              <a href="" className="m-0 [font:inherit] [letter-spacing:inherit] text-[#078dee] no-underline relative rounded-[8px] py-1 px-0 inline-block">
                <div className="rounded-1 px-1">IPL</div>
              </a>
              {/* <span>IPL</span> */}
            </div>

            <Link href={`/market-details/35247592/4`} className="flex flex-col w-full min-w-0 flex-auto no-underline">
              <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
                <div className="flex flex-row gap-1.5">
                  <p className="m-0 font-sans truncate text-[14px] font-bold leading-[1.3rem]">India</p>
                </div>
              </div>

              <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
                <div className="flex flex-row gap-1.5">
                  <p className="m-0 font-sans truncate text-[14px] font-bold leading-[1.3rem]">Pakistan</p>
                  <Icon name="bat" className="w-5 h-5 text-[#078dee]" />
                </div>
                <div className="flex flex-row gap-1.5">
                  <span className="text-[#68cdf9] text-[12px] bg-[#078dee29] min-w-12 px-4 h-4.5 inline-flex justify-center items-center rounded-[4px] font-bold">0/0</span>
                </div>
              </div>
            </Link>


            <div className="flex flex-row gap-3 justify-start items-center h-4 leading-4 contain-strict pointer-events-none overflow-hidden mt-0.5">
              <div className="min-w-9.5">
                <div className="flex gap-1.5">
                  <div className="flex justify-center items-center">
                    <div className="w-[7px] h-[7px] bg-[#078dee] rounded-full"></div>
                  </div>
                  <p className="m-0 font-sans truncate whitespace-nowrap text-[10px] text-[#078dee] font-bold leading-[1rem]">2nd Inning</p>
                </div>
              </div>

              <div>
                <p className="m-0 font-sans whitespace-nowrap truncate text-[10px] text-[#919eab] font-bold leading-[1rem]">17 Markets</p>
              </div>
              <div className="w-4 h-4 pb-0.5">
                <Icon name="watch" className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1 text-black">
                <div className="bg-[#FFAB00] h-3.5 w-3.5 inline-flex justify-center items-center rounded-[4px] text-[13px] max-w-full">
                  <span className="text-[12px] font-semibold truncate overflow-hidden whitespace-nowrap">B</span>
                </div>
                <div className="bg-[#FFAB00] h-3.5 w-3.5 inline-flex justify-center items-center rounded-[4px] text-[13px] max-w-full">
                  <span className="text-[12px] font-semibold truncate overflow-hidden whitespace-nowrap">F</span>
                </div>
              </div>
              <div>
                <p className="m-0 font-sans whitespace-nowrap text-[#919eab] text-[10px] font-bold uppercase leading-4 truncate overflow-hidden whitespace-nowrap">
                  Traded: <span className="text-[10px] font-bold text-[#ffab00] leading-[1rem]">36,03,68,443</span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT ODDS – 40% */}
          <div className="flex flex-row gap-2 items-center whitespace-nowrap min-[1376px]:flex-[1_0_20rem] relative w-full min-[691px]:w-[40%] min-[1200px]:w-[100%] min-[1376px]:max-w-[40%] leading-[1.125rem] text-xs p-[5px] overflow-hidden">

            {/* ODDS GRID */}

            <div className="flex flex-col gap0.5 w-[33.3%]">
              <span className=" block h-[1.125rem] text-center truncate overflow-hidden">India</span>
              <div className="flex gap-1">
                <div className="bg-[rgba(0,178,255,0.7)] w-[50%] rounded-[2px] text-center h-[35px] relative pt-0.5 text-black cursor-pointer select-none">
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    1.4
                  </span>
                  <span className="block whitespace-nowrap font-semibold text-[0.7rem] text-center leading-[0.7rem]">
                    2.9
                  </span>
                </div>
                <div className="bg-[rgba(255,122,127,0.7)] w-[50%] rounded-[2px] text-center h-[35px] relative pt-0.5 text-black cursor-pointer select-none">
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    1.4
                  </span>
                  <span className="block whitespace-nowrap font-semibold text-[0.7rem] leading-[0.7rem] text-center">
                    2.9
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 w-[33.3%]">
              <span className=" block h-[1.125rem] text-center truncate overflow-hidden"></span>
              <div className="flex gap-1">
                <div className="bg-[rgba(0,178,255,0.25)] w-[50%] rounded-[2px] text-center h-[35px] relative pt-0.5 text-black cursor-pointer select-none">
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    
                  </span>
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    
                  </span>
                </div>
                <div className="bg-[rgba(255,122,127,0.25)] w-[50%] rounded-[2px] text-center h-[35px] relative pt-0.5 text-black cursor-pointer select-none">
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    
                  </span>
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap0.5 w-[33.3%]">
              <span className=" block h-[1.125rem] text-center truncate overflow-hidden">Pakistan</span>
              <div className="flex gap-1">
                <div className="bg-[rgba(0,178,255,0.7)] w-[50%] rounded-[2px] text-center h-[35px] relative pt-0.5 text-black cursor-pointer select-none">
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    1.4
                  </span>
                  <span className="block whitespace-nowrap font-semibold text-[0.7rem] text-center leading-[0.7rem]">
                    2.9
                  </span>
                </div>
                <div className="bg-[rgba(255,122,127,0.7)] w-[50%] rounded-[2px] text-center h-[35px] relative pt-0.5 text-black cursor-pointer select-none">
                  <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                    1.4
                  </span>
                  <span className="block whitespace-nowrap font-semibold text-[0.7rem] text-center leading-[0.7rem]">
                    2.9
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </li>
    </ul>
  );
}

/* ================== BUTTON COMPONENTS ================== */

function OddsBack({ price, size }: any) {
  return (
    <button className="h-[34px] rounded bg-[rgba(0,178,255,0.7)] text-black hover:bg-[rgb(0,178,255)]">
      <div className="text-sm font-semibold leading-none">{price}</div>
      <div className="text-[10px] leading-none">{size}</div>
    </button>
  );
}

function OddsLay({ price, size }: any) {
  return (
    <button className="h-[34px] rounded bg-[rgba(255,122,127,0.7)] text-black hover:bg-[rgb(255,122,127)]">
      <div className="text-sm font-semibold leading-none">{price}</div>
      <div className="text-[10px] leading-none">{size}</div>
    </button>
  );
}