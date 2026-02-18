"use client";
import Icon from "@/icons/icons";
import { shortNumber } from "@/lib/functions";
import { useAppStore } from "@/lib/store/store";
import Link from "next/link";
import style from "@/components/pages/home/single-market/singleMarket.module.css";
import React from "react";
import { cn } from "@/lib/utils";

const InplayMarket = ({ events }: { events: any }) => {
  const { setSelectedBet } = useAppStore();
  return (
    <ul className="min-[900]:mt-6 mt-4">
      {events.map((event: any) => {
        const runner0 = event.runners?.[0]; // Team 1 → LEFT
        const runner1 = event.runners?.[1]; // Team 2 → RIGHT
        const runner2 = event.runners?.[2]; // Draw   → CENTER
        const hasThreeRunners = event.runners?.length === 3;
        const isCricket = event.eventType?.name?.toLowerCase() === "cricket";

        const rightRunner = runner1;
        const rightRunnerName = event.runnersName?.[1]?.runnerName;

        return (
          <li
            key={event.marketId}
            className="w-full rounded-[2px] border border-dashed border-[rgba(145,158,171,0.16)] bg-[rgba(145,158,171,0.04)] overflow-hidden mb-1.5"
          >
            <div className="flex w-full flex-col min-[691px]:flex-row min-[1200px]:flex-col min-[1376px]:flex-row">
              {/* LEFT CONTENT – 60% */}
              <div className="w-full min-[691px]:w-[60%] min-[1200px]:w-full min-[1376px]:w-[60%] p-1.25">
                {/* Sport + Competition */}
                <div className="flex flex-row whitespace-nowrap items-center max-w-full min-h-4.5 overflow-hidden -mt-1 mr-5 -mb-1 -ml-1 text-[9px] font-bold tracking-[0.7px] uppercase text-[#098DEE]">
                  <a
                    href=""
                    className="m-0 [font:inherit] tracking-[inherit] text-[#078dee] no-underline relative rounded-[8px] py-1 px-0 inline-block"
                  >
                    <div className="rounded-1 px-1">
                      {event.eventType?.name}
                    </div>
                  </a>
                  <span className="h-1 w-1 rounded-full bg-[rgb(99,115,129)]"></span>
                  <a
                    href=""
                    className="m-0 [font:inherit] tracking-[inherit] text-[#078dee] no-underline relative rounded-[8px] py-1 px-0 inline-block"
                  >
                    <div className="rounded-1 px-1">
                      {event.competition?.name}
                    </div>
                  </a>
                </div>

                {/* Runner Names */}
                <Link
                  href={`/market-details/${event.event?.id}/${event?.eventType?.id}`}
                  className="flex flex-col w-full min-w-0 flex-auto no-underline"
                >
                  {/* Team 1 */}
                  <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
                    <div className="flex flex-row gap-1.5 items-center">
                      <p className="m-0 font-sans truncate text-[14px] font-bold leading-[1.3rem]">
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
                      <p className="m-0 font-sans truncate text-[14px] font-bold leading-[1.3rem]">
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
                </Link>

                {/* Meta row */}
                <div className="flex flex-row gap-3 justify-start items-center h-4 leading-4 contain-strict pointer-events-none overflow-hidden mt-0.5">
                  <div className="min-w-9.5">
                    <div className="flex gap-1.5">
                      <div
                        className={cn(
                          style.animateLiveBlink,
                          `flex justify-center items-center`,
                        )}
                      >
                        <div className="w-[7px] h-[7px] bg-[#078dee] rounded-full"></div>
                      </div>
                      <p className="m-0 font-sans truncate whitespace-nowrap text-[10px] text-[#078dee] font-bold leading-4">
                        {event.inplay
                          ? "In-Play"
                          : new Date(event.marketStartTime).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="m-0 font-sans whitespace-nowrap truncate text-[10px] text-[#919eab] font-bold leading-4">
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
                    <p className="m-0 font-sans whitespace-nowrap text-[#919eab] text-[10px] font-bold uppercase leading-4 truncate overflow-hidden">
                      Traded:{" "}
                      <span className="text-[10px] font-bold text-[#ffab00] leading-4">
                        {event.totalMatched?.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT ODDS – 40% */}
              <div className="flex flex-row gap-2 items-center whitespace-nowrap min-[1376px]:flex-[1_0_20rem] relative w-full min-[691px]:w-[40%] min-[1200px]:w-full min-[1376px]:max-w-[40%] leading-4.5 text-xs p-1.25 overflow-hidden">
                {/* LEFT — Team 1 odds */}
                <div className="flex flex-col gap-0.5 w-[33.3%]">
                  <span className="block h-4.5 text-center truncate overflow-hidden">
                    {event.runnersName?.[0]?.runnerName}
                  </span>
                  <div className="flex gap-1">
                    <div
                      className="bg-[rgba(0,178,255,0.7)] w-[50%] rounded-[2px] text-center h-8.75 relative pt-0.5 text-black cursor-pointer select-none"
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
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                        {runner0?.ex?.availableToBack?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-semibold text-[0.7rem] text-center leading-[0.7rem]">
                        {shortNumber(runner0?.ex?.availableToBack?.[0]?.size) ??
                          ""}
                      </span>
                    </div>
                    <div
                      className="bg-[rgba(255,122,127,0.7)] w-[50%] rounded-[2px] text-center h-8.75 relative pt-0.5 text-black cursor-pointer select-none"
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
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                        {runner0?.ex?.availableToLay?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-semibold text-[0.7rem] leading-[0.7rem] text-center">
                        {shortNumber(runner0?.ex?.availableToLay?.[0]?.size) ??
                          ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CENTER — Draw or disabled */}
                <div className="flex flex-col gap-0.5 w-[33.3%]">
                  <span className="block h-4.5 text-center truncate overflow-hidden">
                    {hasThreeRunners ? event.runnersName?.[2]?.runnerName : ""}
                  </span>
                  <div className="flex gap-1">
                    <div
                      className={`${hasThreeRunners ? "bg-[rgba(0,178,255,0.7)]" : "bg-[rgba(0,178,255,0.25)]"} w-[50%] rounded-[2px] text-center h-8.75 relative pt-0.5 text-black cursor-pointer select-none`}
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
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                        {hasThreeRunners
                          ? (runner2?.ex?.availableToBack?.[0]?.price ?? "-")
                          : ""}
                      </span>
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                        {hasThreeRunners
                          ? (shortNumber(
                              runner2?.ex?.availableToBack?.[0]?.size,
                            ) ?? "")
                          : ""}
                      </span>
                    </div>
                    <div
                      className={`${hasThreeRunners ? "bg-[rgba(255,122,127,0.7)]" : "bg-[rgba(255,122,127,0.25)]"} w-[50%] rounded-[2px] text-center h-8.75 relative pt-0.5 text-black cursor-pointer select-none`}
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
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                        {hasThreeRunners
                          ? (runner2?.ex?.availableToLay?.[0]?.price ?? "-")
                          : ""}
                      </span>
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
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
                  <span className="block h-4.5 text-center truncate overflow-hidden">
                    {rightRunnerName}
                  </span>
                  <div className="flex gap-1">
                    <div
                      className="bg-[rgba(0,178,255,0.7)] w-[50%] rounded-[2px] text-center h-8.75 relative pt-0.5 text-black cursor-pointer select-none"
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
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                        {rightRunner?.ex?.availableToBack?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-semibold text-[0.7rem] text-center leading-[0.7rem]">
                        {shortNumber(
                          rightRunner?.ex?.availableToBack?.[0]?.size,
                        ) ?? ""}
                      </span>
                    </div>
                    <div
                      className="bg-[rgba(255,122,127,0.7)] w-[50%] rounded-[2px] text-center h-8.75 relative pt-0.5 text-black cursor-pointer select-none"
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
                      <span className="block whitespace-nowrap font-semibold text-[0.8rem] text-center">
                        {rightRunner?.ex?.availableToLay?.[0]?.price ?? "-"}
                      </span>
                      <span className="block whitespace-nowrap font-semibold text-[0.7rem] text-center leading-[0.7rem]">
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
};

export default InplayMarket;
