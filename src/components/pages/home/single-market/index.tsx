"use client";
import { useAppStore } from "@/lib/store/store";
import { useEffect, useRef, useState } from "react";
import Icon from "@/icons/icons";
import Link from "next/link";
import style from "./singleMarket.module.css";
import { shortNumber } from "@/lib/functions";

export default function SingleMarket() {
  const { allEventsList, selectedEventTypeId } = useAppStore();
  const { setSelectedBet } = useAppStore();
  const wrapperRef = useRef<HTMLUListElement | null>(null);
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  useEffect(() => {
    console.log(allEventsList, "events all");
  }, [allEventsList]);

  useEffect(() => {
    const listEl = wrapperRef.current;
    if (!listEl) return;
    const targetEl = (listEl.closest("main") as HTMLElement | null) || listEl;

    const updateLayoutMode = () => {
      const renderedWidth = targetEl.getBoundingClientRect().width;
      setIsCompactLayout(renderedWidth < 767);
    };

    updateLayoutMode();
    const observer = new ResizeObserver(updateLayoutMode);
    observer.observe(targetEl);

    return () => observer.disconnect();
  }, []);

  const events: any[] = selectedEventTypeId
    ? (allEventsList?.[selectedEventTypeId] ?? [])
    : [];

  if (!allEventsList) return <p className="text-white p-4">Loading...</p>;
  if (!events.length) return <p className="text-white p-4">No events found.</p>;

  return (
    <ul ref={wrapperRef} className="mt-2">
      {events.map((event: any) => {
        const runner0 = event.runners?.[0]; // Team 1 → LEFT
        const runner1 = event.runners?.[1]; // Team 2 → RIGHT
        const runner2 = event.runners?.[2]; // Draw   → CENTER
        const hasThreeRunners = event.runners?.length === 3;
        const isCricket = event.eventType?.name?.toLowerCase() === "cricket";
        const oddsBoxWidthClass = isCompactLayout
          ? "w-[75%]"
          : "w-[57.5px]";
        const oddsRowLabelWidthClass = isCompactLayout ? "" : "w-[119px] mx-auto";

        const rightRunner = runner1;
        const rightRunnerName = event.runnersName?.[1]?.runnerName;

        return (
          <li
            key={event.marketId}
            className="w-full rounded-[2px] border border-dashed border-[rgba(145,158,171,0.16)] bg-[rgba(145,158,171,0.04)] text-white overflow-hidden mb-[6px]"
          >
            <div
              className={
                isCompactLayout
                  ? "flex w-full flex-col"
                  : "flex w-full flex-col min-[691px]:flex-row min-[1200px]:flex-col min-[1376px]:flex-row"
              }
            >
              {/* LEFT CONTENT – 60% */}
              <div className="w-full  min-[1200px]:w-full  p-[5px]">
                {/* Sport + Competition */}
                <div className="flex flex-row whitespace-nowrap items-center max-w-full min-h-[1.125rem] overflow-hidden -mt-1 mr-5 -mb-1 -ml-1 text-[9px] font-bold tracking-[0.7px] uppercase text-[#098DEE]">
                  <a
                    href=""
                    className="m-0 [font:inherit] [letter-spacing:inherit] text-[#078dee] no-underline relative rounded-[8px] py-1 px-0 inline-block"
                  >
                    <div className="rounded-1 px-1">
                      {event.eventType?.name}
                    </div>
                  </a>
                  <span className="h-1 w-1 rounded-full bg-[rgb(99,115,129)]"></span>
                  <a
                    href=""
                    className="m-0 [font:inherit] [letter-spacing:inherit] text-[#078dee] no-underline relative rounded-[8px] py-1 px-0 inline-block"
                  >
                    <div className="rounded-1 px-1">
                      {event.competition?.name}
                    </div>
                  </a>
                </div>

                {/* Runner Names */}
                <a
                  href={`/market-details/${event.event?.id}/${event.eventType.id}`}
                  className="flex flex-col w-full min-w-0 flex-auto no-underline"
                >
                  {/* Team 1 */}
                  <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
                    <div className="flex flex-row gap-1.5 items-center">
                      <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
                        {event.runnersName?.[0]?.runnerName}
                      </p>
                      {event.inplay &&
                        isCricket &&
                        runner0?.status === "ACTIVE" && (
                          <Icon name="bat" className="w-5 h-5 text-[#078dee]" />
                        )}
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
                    <div className="flex flex-row gap-1.5 items-center">
                      <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
                        {rightRunnerName}
                      </p>
                      {event.inplay &&
                        isCricket &&
                        rightRunner?.status === "ACTIVE" && (
                          <Icon name="bat" className="w-5 h-5 text-[#078dee]" />
                        )}
                    </div>
                    <div className="flex flex-row gap-1.5">
                      <span className="text-[#68cdf9] text-[12px] bg-[#078dee29] min-w-12 px-4 h-4.5 inline-flex justify-center items-center rounded-[4px] font-bold">
                        {event.score ?? "0/0"}
                      </span>
                    </div>
                  </div>
                </a>

                {/* Meta row */}
                <div className="flex flex-row gap-3 justify-start items-center h-4 leading-4 contain-strict pointer-events-none overflow-hidden mt-0.5">
                  <div className="min-w-9.5">
                    <div className="flex gap-1.5">
                      {event.inplay && (
                        <div
                          className={`flex justify-center items-center ${style.animateLiveBlink}`}
                        >
                          <div className="w-[7px] h-[7px] bg-[#078dee] rounded-full"></div>
                        </div>
                      )}
                      <p
                        className={`m-0 font-sans truncate whitespace-nowrap text-[10px] font-bold leading-[1rem] ${
                          event.inplay
                            ? "text-[#078dee]"
                            : "text-[var(--palette-grey-500)]"
                        }`}
                      >
                        {event.inplay
                          ? "In-Play"
                          : (() => {
                              const date = new Date(event.marketStartTime);
                              const day = String(date.getDate()).padStart(
                                2,
                                "0",
                              );
                              const month = String(
                                date.getMonth() + 1,
                              ).padStart(2, "0");
                              const year = date.getFullYear();
                              return `${day}-${month}-${year}`;
                            })()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="m-0 font-sans whitespace-nowrap truncate text-[10px] text-[#919eab] font-bold leading-[1rem]">
                      {event.marketType}
                    </p>
                  </div>

                  <div className="w-4 h-4 pb-0.5">
                    <Icon name="watch" className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1 text-black">
                    <div className="bg-[#FFAB00] h-3.5 w-3.5 inline-flex justify-center items-center rounded-[4px] text-[13px] max-w-full">
                      <span className="text-[12px] font-semibold truncate overflow-hidden whitespace-nowrap">
                        B
                      </span>
                    </div>
                    <div className="bg-[#FFAB00] h-3.5 w-3.5 inline-flex justify-center items-center rounded-[4px] text-[13px] max-w-full">
                      <span className="text-[12px] font-semibold truncate overflow-hidden whitespace-nowrap">
                        F
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="m-0 font-sans whitespace-nowrap text-[#919eab] text-[10px] font-bold uppercase leading-4 truncate overflow-hidden whitespace-nowrap">
                      Traded:{" "}
                      <span className="text-[10px] font-bold text-[#ffab00] leading-[1rem]">
                        {event.totalMatched?.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT ODDS – 40% */}
              <div
                className={
                  isCompactLayout
                    ? "flex flex-row gap-2 items-center whitespace-nowrap relative w-full min-w-0 leading-[1.125rem] text-xs p-[5px] overflow-hidden"
                    : "flex flex-row gap-2 items-center whitespace-nowrap min-[1376px]:flex-[1_0_20rem] relative min-w-fit leading-[1.125rem] text-xs p-[5px] overflow-hidden"
                }
              >
                {/* LEFT — Team 1 odds */}
                <div className="flex flex-col gap-0.5 w-[33.3%]">
                  <span
                    className={`block h-[1.125rem] text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
                  >
                    {event.runnersName?.[0]?.runnerName}
                  </span>
                  <div className="flex gap-1">
                    {/* BACK BUTTON (LEFT) */}
                    <div
                      className={`${oddsBoxWidthClass} h-[45px] rounded-[8px] border-[1px] border-[#03B2FF] bg-[#0c2137]/60 hover:bg-[#0c2137]/80 flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
                      onClick={() =>
                        setSelectedBet({
                          type: "back",
                          odds: runner0?.ex?.availableToBack?.[0]?.price,
                          teamName: event.runnersName?.[0]?.runnerName,
                          eventName: event.event?.name,
                          marketType: event.marketType,
                        })
                      }
                    >
                      <span className="block whitespace-nowrap font-bold text-[13px] text-[#03B2FF] leading-[1.1]">
                        {runner0?.ex?.availableToBack?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-normal text-[10px] text-[#60a5fa] leading-[1]">
                        {shortNumber(runner0?.ex?.availableToBack?.[0]?.size) ??
                          ""}
                      </span>
                    </div>

                    {/* LAY BUTTON (LEFT) */}
                    <div
                      className={`${oddsBoxWidthClass} h-[45px] rounded-[8px] border-[1px] border-[#FF7A7F] bg-[#2a0c13]/60 hover:bg-[#2a0c13]/80 flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
                      onClick={() =>
                        setSelectedBet({
                          type: "lay",
                          odds: runner0?.ex?.availableToLay?.[0]?.price,
                          teamName: event.runnersName?.[0]?.runnerName,
                          eventName: event.event?.name,
                          marketType: event.marketType,
                        })
                      }
                    >
                      <span className="block whitespace-nowrap font-bold text-[13px] text-[#FF7A7F] leading-[1.1]">
                        {runner0?.ex?.availableToLay?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-normal text-[10px] text-[#FF7A7F] leading-[1]">
                        {shortNumber(runner0?.ex?.availableToLay?.[0]?.size) ??
                          ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CENTER — Draw or disabled */}
                <div className="flex flex-col gap-0.5 w-[33.3%]">
                  <span
                    className={`block h-[1.125rem] text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
                  >
                    {hasThreeRunners ? event.runnersName?.[2]?.runnerName : ""}
                  </span>
                  <div className="flex gap-1">
                    {/* BACK BUTTON (CENTER) */}
                    <div
                      className={`${oddsBoxWidthClass} h-[45px] rounded-[8px] border-[1px] flex flex-col justify-center items-center select-none transition-all ${
                        hasThreeRunners
                          ? "border-blue-50 bg-[#0c2137]/60 hover:bg-[#0c2137]/80 cursor-pointer"
                          : "border-blue-50/50 bg-[#0c2137]/20 cursor-default"
                      }`}
                      onClick={() =>
                        hasThreeRunners &&
                        setSelectedBet({
                          type: "back",
                          odds: runner2?.ex?.availableToBack?.[0]?.price,
                          teamName: event.runnersName?.[2]?.runnerName,
                          eventName: event.event?.name,
                          marketType: event.marketType,
                        })
                      }
                    >
                      <span
                        className={`block whitespace-nowrap font-bold text-[13px] leading-[1.1] ${hasThreeRunners ? "text-blue-50" : "text-blue-50/50"}`}
                      >
                        {hasThreeRunners
                          ? (runner2?.ex?.availableToBack?.[0]?.price ?? "-")
                          : ""}
                      </span>
                      <span
                        className={`block whitespace-nowrap font-normal text-[10px] leading-[1] ${hasThreeRunners ? "text-[#03B2FF]" : "text-[#60a5fa]/50"}`}
                      >
                        {hasThreeRunners
                          ? (shortNumber(
                              runner2?.ex?.availableToBack?.[0]?.size,
                            ) ?? "")
                          : ""}
                      </span>
                    </div>

                    {/* LAY BUTTON (CENTER) */}
                    <div
                      className={`${oddsBoxWidthClass} h-[45px] rounded-[8px] border-[1px] flex flex-col justify-center items-center select-none transition-all ${
                        hasThreeRunners
                          ? "border-[#FF7A7F] bg-[#2a0c13]/60 hover:bg-[#2a0c13]/80 cursor-pointer"
                          : "border-[#FF7A7F]/50 bg-[#2a0c13]/20 cursor-default"
                      }`}
                      onClick={() =>
                        hasThreeRunners &&
                        setSelectedBet({
                          type: "lay",
                          odds: runner2?.ex?.availableToLay?.[0]?.price,
                          teamName: event.runnersName?.[2]?.runnerName,
                          eventName: event.event?.name,
                          marketType: event.marketType,
                        })
                      }
                    >
                      <span
                        className={`block whitespace-nowrap font-bold text-[13px] leading-[1.1] ${hasThreeRunners ? "text-[#FF7A7F]" : "text-[#FF7A7F]/50"}`}
                      >
                        {hasThreeRunners
                          ? (runner2?.ex?.availableToLay?.[0]?.price ?? "-")
                          : ""}
                      </span>
                      <span
                        className={`block whitespace-nowrap font-normal text-[10px] leading-[1] ${hasThreeRunners ? "text-[#FF7A7F]" : "text-[#FF7A7F]/50"}`}
                      >
                        {hasThreeRunners
                          ? (shortNumber(
                              runner2?.ex?.availableToLay?.[0]?.size,
                            ) ?? "")
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT — Team 2 odds */}
                <div className="flex flex-col gap-0.5 w-[33.3%]">
                  <span
                    className={`block h-[1.125rem] text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
                  >
                    {rightRunnerName}
                  </span>
                  <div className="flex gap-1">
                    {/* BACK BUTTON (RIGHT) */}
                    <div
                      className={`${oddsBoxWidthClass} h-[45px] rounded-[8px] border-[1px] border-[#03B2FF] bg-[#0c2137]/60 hover:bg-[#0c2137]/80 flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
                      onClick={() =>
                        setSelectedBet({
                          type: "back",
                          odds: rightRunner?.ex?.availableToBack?.[0]?.price,
                          teamName: rightRunnerName,
                          eventName: event.event?.name,
                          marketType: event.marketType,
                        })
                      }
                    >
                      <span className="block whitespace-nowrap font-bold text-[12px] text-[#03B2FF] leading-[1.1]">
                        {rightRunner?.ex?.availableToBack?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-normal text-[10px] text-[#60a5fa] leading-[1]">
                        {shortNumber(
                          rightRunner?.ex?.availableToBack?.[0]?.size,
                        ) ?? ""}
                      </span>
                    </div>

                    {/* LAY BUTTON (RIGHT) */}
                    <div
                      className={`${oddsBoxWidthClass} h-[45px] rounded-[8px] border-[1px] border-[#FF7A7F] bg-[#2a0c13]/60 hover:bg-[#2a0c13]/80 flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
                      onClick={() =>
                        setSelectedBet({
                          type: "lay",
                          odds: rightRunner?.ex?.availableToLay?.[0]?.price,
                          teamName: rightRunnerName,
                          eventName: event.event?.name,
                          marketType: event.marketType,
                        })
                      }
                    >
                      <span className="block whitespace-nowrap font-bold text-[13px] text-[#FF7A7F] leading-[1.1]">
                        {rightRunner?.ex?.availableToLay?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-normal text-[10px] text-[#FF7A7F] leading-[1]">
                        {shortNumber(
                          rightRunner?.ex?.availableToLay?.[0]?.size,
                        ) ?? ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
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
