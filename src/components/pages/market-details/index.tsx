"use client";
import Icon from "@/icons/icons";
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function MarketDetails() {
  const navTabs = ["ALL", "BOOKMAKER", "ODDS"];

  // States for Tabs and Indicator
  const [activeTab, setActiveTab] = useState("ALL");
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // States for Accordions (Hide/Show)
  const [isBookmakerOpen, setIsBookmakerOpen] = useState(true);
  const [isOddsOpen, setIsOddsOpen] = useState(true);

  const teams = [
    {
      name: "India",
      suspended: false,
      back: [
        { odd: "2.34", vol: "7323" },
        { odd: "2.36", vol: "617" },
        { odd: "2.38", vol: "24" },
      ],
      lay: [
        { odd: "2.4", vol: "450" },
        { odd: "2.42", vol: "4449" },
        { odd: "2.46", vol: "7115" },
      ],
    },
    {
      name: "Australia",
      suspended: false,
      back: [
        { odd: "38", vol: "283" },
        { odd: "44", vol: "3190" },
        { odd: "46", vol: "798" },
      ],
      lay: [
        { odd: "60", vol: "53" },
        { odd: "65", vol: "27" },
        { odd: "80", vol: "10" },
      ],
    },
    {
      name: "South Africa",
      suspended: false,
      back: [
        { odd: "5.6", vol: "1218" },
        { odd: "5.7", vol: "529" },
        { odd: "5.8", vol: "5788" },
      ],
      lay: [
        { odd: "6", vol: "11084" },
        { odd: "6.2", vol: "22835" },
        { odd: "6.4", vol: "4805" },
      ],
    },
    { name: "Ireland", suspended: true },
    { name: "UAE", suspended: true },
    { name: "Scotland", suspended: true },
  ];

  const updateIndicator = useCallback(() => {
    if (!tabsListRef.current || !activeTab) return;
    const activeBtn = tabsListRef.current.querySelector(
      `button[data-tab="${activeTab}"]`,
    ) as HTMLElement;
    if (activeBtn) {
      setIndicatorStyle({
        left: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        opacity: 1,
      });
    }
  }, [activeTab]);

  useEffect(() => {
    const timeout = setTimeout(() => updateIndicator(), 100);
    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  // 👇 REUSABLE TABLE FUNCTION: Taake code lamba na ho aur Bookmaker/Odds dono jagah use ho sake
  const renderMarketTable = () => (
    <div className="border w-full border-dashed border-(--dotted-line) rounded-[4px] overflow-hidden">
      {/* --- HEADER SIDE --- */}
      <div className="px-1 min-[900px]:px-2 bg-[#153045] border-b border-[#28323D] flex flex-col justify-center w-full font-bold h-8">
        <div className="relative flex flex-row items-center h-8 justify-between w-full">
          <div className="text-[14px] text-[#68CDF9] font-[500] leading-[14px] flex-1 flex-[1_1_6rem] min-w-0 whitespace-nowrap truncate relative top-[1px]">
            ICC Mens T20 World Cup Winner 2026
          </div>
          {/* Right Side Header */}
          <div className="relative flex flex-col items-end max-w-[360px] w-full flex-[5_0_94px]">
            {/* Limits */}
            <div className="flex items-center text-[13px] font-normal leading-[18px] text-[#68CDF9] pt-[1px]">
              <p>Min: 10</p> &nbsp; <p className="!font-[400] text-[10px]">|</p>{" "}
              &nbsp; <p>Max: 25,000</p>
            </div>
            <div className="flex gap-1 w-full justify-end h-[20px] relative top-[-1px]">
              {/* Back Labels */}
              <div className="flex w-1/2 gap-1 justify-end">
                <div className="flex-1 min-w-0 max-[464px]:hidden"></div>
                <div className="flex-1 min-w-0 max-[346px]:hidden"></div>
                <div className="flex items-center justify-center pb-[1px] font-semibold rounded-[2px] text-black select-none flex-1 min-w-0 text-[14px] leading-[18px] bg-[#0591cf] h-4 2222">
                  Back
                </div>
              </div>
              {/* Lay Labels */}
              <div className="flex w-1/2 gap-1 justify-start">
                <div className="flex  items-center  justify-center rounded-[2px] text-black select-none flex-1 min-w-0 text-[14px] font-semibold pb-[1px] leading-[18px] bg-[#d1686d] h-4">
                  Lay
                </div>
                <div className="flex-1 min-w-0 max-[346px]:hidden"></div>
                <div className="flex-1 min-w-0 max-[464px]:hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- BODY (LIST OF TEAMS) --- */}
      <ul className="relative list-none m-0 p-0 px-1 min-[900px]:px-2 bg-[#191e26]">
        {teams.map((team, index) => (
          <li
            key={index}
            className="flex flex-col justify-start items-center relative w-full box-border text-left no-underline border-b border-dashed border-(--dotted-line) bg-clip-padding hover:bg-[#1C252E] transition-colors "
          >
            <div className="flex w-full flex-row flex-1 min-h-[50px] items-center justify-between py-1">
              {/* Team Name */}
              <div className="font-[500] text-[14px] leading-[1] flex-[1_1_6rem] min-w-0 pr-2">
                <span
                  className={
                    team.suspended ? "text-white" : "text-white cursor-pointer"
                  }
                >
                  {team.name}
                </span>
              </div>

              {/* Odds Boxes Container */}
              <div className="relative flex gap-1 max-w-[360px] h-[35px] w-full flex-[5_0_94px]">
                {/* ==== BACK BOXES (BLUE) ==== */}
                <div
                  className={`flex flex-row-reverse w-1/2 gap-1 overflow-hidden ${
                    team.suspended ? "bg-black" : " "
                  }`}
                >
                  {team.suspended
                    ? [1, 2, 3].map((_, i) => (
                        <div
                          key={`back-susp-${i}`}
                          className={`flex flex-col h-full rounded-[2px] flex-1 min-w-0 bg-[#041117] ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                        ></div>
                      ))
                    : team.back?.map((item, i) => (
                        <div
                          key={`back-act-${i}`}
                          className={`flex flex-col items-center justify-center h-full rounded-[2px] flex-1 min-w-0 cursor-pointer text-black transition-colors ${i === 0 ? "bg-[#0591cf] hover:bg-[#68CDF9]" : "bg-[#0a77a8] hover:bg-[#68CDF9]"} ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                        >
                          <span className="text-[11px] sm:text-[13px] font-bold leading-[1.1] truncate">
                            {item.odd}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-normal leading-[1] truncate">
                            {item.vol}
                          </span>
                        </div>
                      ))}
                </div>

                {/* ==== LAY BOXES (RED/PINK) ==== */}
                <div
                  className={`flex w-1/2 gap-1 overflow-hidden ${
                    team.suspended ? "bg-black" : " "
                  }`}
                >
                  {team.suspended
                    ? [1, 2, 3].map((_, i) => (
                        <div
                          key={`lay-susp-${i}`}
                          className={`flex flex-col h-full rounded-[2px] flex-1 min-w-0 bg-[#140d0f] ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                        ></div>
                      ))
                    : team.lay?.map((item, i) => (
                        <div
                          key={`lay-act-${i}`}
                          className={`flex flex-col items-center justify-center h-full rounded-[2px] flex-1 min-w-0 cursor-pointer text-black transition-colors ${i === 0 ? "bg-[#d1686d] hover:bg-[#FFA4A7]" : "bg-[#a3555b] hover:bg-[#FFA4A7]"} ${i === 2 ? "max-[464px]:hidden" : ""} ${i === 1 ? "max-[346px]:hidden" : ""}`}
                        >
                          <span className="text-[11px] sm:text-[13px] font-bold leading-[1.1] truncate">
                            {item.odd}
                          </span>
                          <span
                            className={`text-[9px] sm:text-[10px] font-normal leading-[1] truncate`}
                          >
                            {item.vol}
                          </span>
                        </div>
                      ))}
                </div>

                {/* ==== SUSPENDED OVERLAY ==== */}
                {team.suspended && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                    <p className="m-0 text-[#FF8C4B] text-[16px] font-[500] leading-[1.5] tracking-wide">
                      SUSPENDED
                    </p>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  // ==========================================
  // MAIN COMPONENT RENDER
  // ==========================================
  return (
    <div className="w-full mx-auto box-border flex flex-auto flex-col pt-2 pb-2">
      {/* Breadcrumbs */}
      <div className="mb-2 min-[900px]:mb-[16px]">
        <div className="flex flex-wrap items-center gap-1.5 min-[900px]:gap-2.5 max-w-full overflow-hidden">
          <div className="grow">
            <div className=" flex flex-wrap gap-2 min-[900px]:gap-4">
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] px-1.5 gap-2.5">
                <a href="" className="inline-flex">
                  Home
                </a>
              </span>
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5">
                <span className="text-[#68CDF9]">
                  <Icon name="play" className="w-5 h-5" />
                </span>
                <a href="" className="inline-flex">
                  Cricket
                </a>
              </span>
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5">
                <span className="text-[#68CDF9]">
                  <Icon name="play" className="w-5 h-5" />
                </span>
                <a href="" className="inline-flex">
                  ICC Men's T20 World Cup
                </a>
              </span>
              <span className="h-6 min-w-6 inline-flex justify-center items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5">
                <span className="text-[#68CDF9]">
                  <Icon name="play" className="w-5 h-5" />
                </span>
                <a href="" className="inline-flex">
                  ICC Men's T20 World Cup
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Title Block */}
      <div className="text-white bg-[#919eab0a] w-full border-[1px] border-dashed border-(--dotted-line) rounded-[16px] overflow-hidden max-[637px]:mt-[6px]">
        <div className="flex justify-start items-center relative no-underline w-full box-border text-left py-2 px-4 flex-wrap rounded-2">
          <div className="flex-auto min-w-0 m-0">
            <h5 className="text-[1rem] font-bold leading-[1.5] mb-[-2px]">
              ICC Men's T20 World Cup
            </h5>
            <span className="text-[0.875rem] leading-[1.57143]">
              <div className="flex gap-2 items-center">
                <time className="text-[0.785rem] font-semibold leading-[1.57143] text-[#919EAB]">
                  07-02-2026 10:30
                </time>
              </div>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs List */}
      <div className="mt-1 min-[900px]:mt-2 flex bg-[#28323D] rounded-[8px] min-h-[48px] overflow-hidden w-full max-w-full">
        <div className="relative flex items-center flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div
            ref={tabsListRef}
            className="flex p-2 !pb-[6px] relative z-[1] w-full items-center relative"
          >
            <div
              className="absolute bg-[#141A21] rounded-[8px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-0 h-[32px]"
              style={{
                left: `${indicatorStyle.left}px`,
                top: "24px",
                transform: "translateY(-50%)",
                width: `${indicatorStyle.width}px`,
                opacity: indicatorStyle.opacity,
              }}
            />
            {navTabs.map((tab, idx) => (
              <button
                key={idx}
                data-tab={tab}
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center justify-center bg-transparent border-none cursor-pointer text-[0.875rem]  px-4 py-1.5 transition-colors duration-200 leading-[1.57143] relative z-10 top-[-1px] ${activeTab === tab ? "text-[#68CDF9] font-semibold" : "text-[#919EAB] font-[500]"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. BOOKMAKER SECTION (Shows on 'ALL' and 'BOOKMAKER' tab) */}
      {/* ======================================================== */}
      {(activeTab === "ALL" || activeTab === "BOOKMAKER") && (
        <div className="w-full">
          {/* Accordion Toggle Header */}
          <div
            onClick={() => setIsBookmakerOpen(!isBookmakerOpen)}
            className="mt-1 px-1 min-[900px]:mt-2 min-[900px]:px-2 text-[#68CDF9] flex flex-row flex-nowrap justify-between items-center h-8 w-full cursor-pointer text-xs font-bold bg-[#078dee29] rounded-[6px] whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
          >
            <div className="grow">
              <span className="font-semibold text-[0.875rem] leading-[1.57143]">
                Bookmaker
              </span>
            </div>
            <button className="inline-flex items-center justify-center relative box-border bg-transparent cursor-pointer select-none align-middle appearance-none font-sans text-center text-inherit text-lg outline-none border-0 m-0 no-underline flex-none rounded-full p-[5px]">
              {/* Icon Rotation Animation */}
              <div
                className={`transition-transform duration-300 ${!isBookmakerOpen ? "rotate-180" : "rotate-0"}`}
              >
                <Icon name="arrowDown" className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Accordion Body */}
          {isBookmakerOpen && (
            <div className="h-auto transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-visible">
              <div className="flex w-full">
                <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-0.5 min-[900px]:mt-1">
                  {renderMarketTable()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. ODDS SECTION (Shows on 'ALL' and 'ODDS' tab)          */}
      {/* ======================================================== */}
      {(activeTab === "ALL" || activeTab === "ODDS") && (
        <div className="w-full">
          {/* Accordion Toggle Header */}
          <div
            onClick={() => setIsOddsOpen(!isOddsOpen)}
            className="mt-1 px-1 min-[900px]:mt-2 min-[900px]:px-2 text-[#68CDF9] flex flex-row flex-nowrap justify-between items-center h-8 w-full cursor-pointer text-xs font-bold bg-[#078dee29] rounded-[6px] whitespace-nowrap transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]"
          >
            <div className="grow">
              <span className="font-semibold text-[0.875rem] leading-[1.57143]">
                Odds
              </span>
            </div>
            <button className="inline-flex items-center justify-center relative box-border bg-transparent cursor-pointer select-none align-middle appearance-none font-sans text-center text-inherit text-lg outline-none border-0 m-0 no-underline flex-none rounded-full p-[5px]">
              {/* Icon Rotation Animation */}
              <div
                className={`transition-transform duration-300 ${isOddsOpen ? "rotate-180" : "rotate-0"}`}
              >
                <Icon name="arrowDown" className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Accordion Body */}
          {isOddsOpen && (
            <div className="h-auto transition-[height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-visible">
              <div className="flex w-full">
                <div className="w-full flex flex-wrap gap-x-2 gap-y-2 mt-0.5 min-[900px]:mt-1">
                  {renderMarketTable()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
