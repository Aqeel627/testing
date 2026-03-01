// "use client";
// import { shortNumber } from "@/lib/functions";
// import { useAppStore } from "@/lib/store/store";
// import style from "@/components/common/single-market/style.module.css";
// import { AnimatedNumber } from "@/components/common/animatied-number";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { useEffect, useRef, useState, useCallback } from "react";
// // import MarketLoader from "../market-loader";
// import { EventTimer } from "./event-timer";
// import Icon from "@/icons/icons";
// import MBetSlip from "@/components/common/m-betslip";
// import dynamic from "next/dynamic";
// import { http } from "@/lib/axios-instance";
// import { CONFIG } from "@/lib/config";
// import { eventBus } from "@/lib/eventBus";
// import { useParams } from "next/navigation";
// const MarketLoader = dynamic(() => import("@/components/common/market-loader"));

// const SingleMarket = ({
//   events,
//   className,
// }: {
//   events: any;
//   className?: string;
// }) => {
//   const { setSelectedBet, selectedBet } = useAppStore();
//   const betslipRef = useRef<HTMLDivElement | null>(null);

//   const params = useParams();
//   const eventId = (params as any)?.eventId || "";
//   const sportId = (params as any)?.sportId || "";

//   useEffect(() => {
//     const unsub = eventBus.on(
//       "REFRESH_AFTER_PLACE",
//       async ({ eventId: eId, sportId: sId }: any) => {
//         const eIdToUse = eId || eventId;
//         const sIdToUse = sId || sportId;

//         if (!eIdToUse || !sIdToUse) return;

//         try {
//           await http.post(CONFIG.getAllMarketplURL, {
//             eventId: String(eIdToUse),
//             sportId: String(sIdToUse),
//           });
//         } catch {}

//         try {
//           await http.post(CONFIG.unmatchedBets, {
//             eventId: String(eIdToUse),
//             sportId: String(sIdToUse),
//           });
//         } catch {}
//       },
//     );

//     return unsub;
//   }, [eventId, sportId]);
//   const [slipPreview, setSlipPreview] = useState<{
//     stake: number;
//     price: number;
//   }>({ stake: 0, price: 0 });

//   const handleSlipPreview = useCallback(
//     ({ stake, price }: { stake: number; price: number }) => {
//       setSlipPreview({ stake, price });
//     },
//     [],
//   );

//   useEffect(() => {
//     if (selectedBet?.eventName && betslipRef.current) {
//       requestAnimationFrame(() => {
//         const el = betslipRef.current!;
//         const elementPosition = el.getBoundingClientRect().top + window.scrollY;
//         const offset = window.innerHeight / 2 - el.offsetHeight / 2;
//         let position = elementPosition - offset;
//         if (position < 0) position = 0;
//         window.scrollTo({ top: position, behavior: "smooth" });
//       });
//     }
//   }, [selectedBet?.eventName, selectedBet?.teamName]);

//   // useEffect(() => {
//   //   setTimeout(() => setLoading(false), 300);
//   // }, []);

//   useEffect(() => {
//     if (selectedBet?.eventName && betslipRef.current) {
//       requestAnimationFrame(() => {
//         const el = betslipRef.current!;
//         const elementPosition = el.getBoundingClientRect().top + window.scrollY;
//         const offset = window.innerHeight / 2 - el.offsetHeight / 2;
//         let position = elementPosition - offset;
//         if (position < 0) position = 0;
//         window.scrollTo({ top: position, behavior: "smooth" });
//       });
//     }
//   }, [selectedBet?.eventName, selectedBet?.teamName]);

//   if (!events) return <MarketLoader />;

//   return (
//     <div id="single-market.tsx">
//       <ul className={cn("min-[900]:mt-6 mt-4", className)}>
//         {events?.map((event: any) => {
//           const runner0 = event.runners?.[0]; // Team 1 → LEFT
//           const runner1 = event.runners?.[1]; // Team 2 → RIGHT
//           const runner2 = event.runners?.[2]; // Draw  → CENTER
//           const hasThreeRunners = event.runners?.length === 3;
//           const isCricket = event.eventType?.name?.toLowerCase() === "cricket";

//           // JS State ki jagah Tailwind Breakpoints use kiye hain
//           const oddsBoxWidthClass = "w-[75%] @min-[700]:w-[57.5px]";
//           const oddsRowLabelWidthClass = "@md:w-[119px] @md:mx-auto";

//           const hasCenterBackPrice = !!runner2?.ex?.availableToBack?.[0]?.price;
//           const hasCenterLayPrice = !!runner2?.ex?.availableToLay?.[0]?.price;

//           const rightRunner = runner1;
//           const rightRunnerName = event.runnersName?.[1]?.runnerName;
//           const isBetOnThisEvent = selectedBet?.eventName === event.event?.name;

//           const selectedTeam = selectedBet?.teamName;
//           const selectedType = selectedBet?.type;
//           const isThisSelected = (
//             runnerName: string,
//             betType: "back" | "lay",
//           ) =>
//             isBetOnThisEvent &&
//             selectedTeam === runnerName &&
//             selectedType === betType;
//           return (
//             <li
//               key={event.marketId}
//               className="w-full rounded-[2px] border border-dashed border-(--dotted-line) bg-[rgba(145,158,171,0.04)] text-white! overflow-hidden mb-[6px]"
//             >
//               {/* Main Wrapper - Conditionals removed, Tailwind handles responsiveness */}
//               <div className="flex w-full flex-col  @min-[700]:flex-row">
//                 {/* LEFT CONTENT */}
//                 <div className="w-full p-[5px]">
//                   {/* Sport + Competition */}
//                   <div className="flex flex-row whitespace-nowrap items-center max-w-full min-h-[1.125rem] overflow-hidden -mt-1 mr-5 -mb-1 -ml-1 text-[9px] font-bold tracking-[0.7px] uppercase text-[#098DEE]">
//                     <Link
//                       href={`/sport/${event?.eventType?.name}`}
//                       className="m-0 [font:inherit] [letter-spacing:inherit] text-(--primary-color) no-underline relative rounded-[8px] py-1 px-0 inline-block"
//                     >
//                       <div className="rounded-1 px-1">
//                         {event.eventType?.name}
//                       </div>
//                     </Link>
//                     <span className="h-1 w-1 rounded-full bg-[rgb(99,115,129)]"></span>
//                     <Link
//                       href={`/sport/${event?.eventType?.name}/${event?.competition?.id}`}
//                       className="m-0 [font:inherit] [letter-spacing:inherit] text-(--primary-color) no-underline relative rounded-[8px] py-1 px-0 inline-block"
//                     >
//                       <div className="rounded-1 px-1">
//                         {event.competition?.name}
//                       </div>
//                     </Link>
//                   </div>

//                   {/* Runner Names */}
//                   <Link
//                     href={`/market-details/${event.event?.id}/${event.eventType.id}`}
//                     className="flex flex-col w-full min-w-0 flex-auto no-underline"
//                   >
//                     {/* Team 1 */}
//                     <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
//                       <div className="flex flex-row gap-1.5 items-center">
//                         <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
//                           {event.runnersName?.[0]?.runnerName}
//                         </p>
//                         {event.inplay &&
//                           isCricket &&
//                           runner0?.status === "ACTIVE" && (
//                             <Icon
//                               name="bat"
//                               className="w-5 h-5 text-(--primary-color)"
//                             />
//                           )}
//                       </div>
//                     </div>

//                     {/* Team 2 */}
//                     <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
//                       <div className="flex flex-row gap-1.5 items-center">
//                         <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
//                           {rightRunnerName}
//                         </p>
//                         {event.inplay &&
//                           isCricket &&
//                           rightRunner?.status === "ACTIVE" && (
//                             <Icon
//                               name="bat"
//                               className="w-5 h-5 text-(--primary-color)"
//                             />
//                           )}
//                       </div>
//                       <div className="flex flex-row gap-1.5">
//                         <span className="text-[#68cdf9] text-[12px] bg-[#078dee29] min-w-12 px-4 h-4.5 inline-flex justify-center items-center rounded-[4px] font-bold">
//                           {event.score ?? "0/0"}
//                         </span>
//                       </div>
//                     </div>
//                   </Link>

//                   {/* Meta row */}
//                   <div className="flex flex-row gap-3 justify-start items-center h-4 leading-4 contain-strict pointer-events-none overflow-hidden mt-0.5">
//                     <div className="min-w-9.5">
//                       <div className="flex gap-1.5">
//                         {event.inplay && (
//                           <div
//                             className={`flex justify-center items-center ${style.animateLiveBlink}`}
//                           >
//                             <div className="w-[7px] h-[7px] bg-[#508d0e] rounded-full"></div>
//                           </div>
//                         )}
//                         <div
//                           className={`m-0 font-sans truncate whitespace-nowrap text-[10px] font-bold leading-[1rem] ${event.inplay ? "text-(--primary-color)" : "text-[var(--secondary-text-color)]"}`}
//                         >
//                           {event.inplay ? (
//                             "In-Play"
//                           ) : (
//                             <EventTimer startTime={event?.marketStartTime} />
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-1 text-black">
//                       <Icon name={"bookMark"} className="h-[14px] w-[14px]" />
//                       <Icon name={"fancy"} className="h-[14px] w-[14px]" />
//                       <Icon name={"sportsbook"} className="h-[14px] w-[14px]" />
//                     </div>

//                     <div className="w-4 h-4 pb-0.5 text-(--palette-text-primary)">
//                       <Icon name="watch" className="w-4 h-4" />
//                     </div>

//                     <div>
//                       <p className="m-0 font-sans whitespace-nowrap text-[var(--secondary-text-color)] text-[10px] font-bold uppercase leading-4 truncate overflow-hidden">
//                         Matched :{" "}
//                         <span className="text-[10px] font-bold text-[var(--primary-text-color)] leading-[1rem]">
//                           <AnimatedNumber
//                             value={event.totalMatched}
//                             inplay={event.inplay}
//                           />
//                         </span>
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* RIGHT ODDS */}
//                 <div className="flex flex-row gap-2 items-center whitespace-nowrap relative w-full @md:min-w-fit leading-[1.125rem] text-xs p-[5px] overflow-hidden @min-[700px]:flex-[1_0_20rem]">
//                   {/* LEFT — Team 1 odds */}
//                   <div className="flex flex-col gap-0.5 w-[33.3%]">
//                     <span
//                       className={`block h-[1.125rem] text-(--palette-text-primary) font-bold text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
//                     >
//                       {event.runnersName?.[0]?.runnerName}
//                     </span>
//                     <div className="flex gap-1">
//                       {/* BACK BUTTON (LEFT) */}
//                       <div
//                         className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border border-[var(--back-border)] ${isThisSelected(event.runnersName?.[0]?.runnerName, "back") ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)]" : "bg-[var(--back-bg)]"} hover:bg-[var(--back-hover)] flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
//                         onClick={() => {
//                           const price =
//                             runner0?.ex?.availableToBack?.[0]?.price;
//                           const size = runner0?.ex?.availableToBack?.[0]?.size;
//                           if (!price || !size) return;
//                           setSelectedBet({
//                             type: "back",
//                             odds: price,
//                             teamName: event.runnersName?.[0]?.runnerName,
//                             eventName: event.event?.name,
//                             marketType: event.marketType,
//                             // ✅ required for bet placement
//                             marketId: event.marketId,
//                             eventId: event.event?.id,
//                             sportId: event.eventType?.id,
//                             selectionId: runner0?.selectionId,
//                           });
//                         }}
//                       >
//                         <span
//                           className={`block whitespace-nowrap font-bold price leading-[1.1] ${isThisSelected(event.runnersName?.[0]?.runnerName, "back") ? "text-[var(--back-price-text)] dark:text-white" : "text-[var(--back-price-text)]"}`}
//                         >
//                           {runner0?.ex?.availableToBack?.[0]?.price ?? "-"}
//                         </span>
//                         <span
//                           className={`block size whitespace-nowrap font-normal leading-[1] ${isThisSelected(event.runnersName?.[0]?.runnerName, "back") ? "text-[var(--back-size-text)] dark:text-white" : "text-[var(--back-size-text)]"}`}
//                         >
//                           {shortNumber(
//                             runner0?.ex?.availableToBack?.[0]?.size,
//                           ) ?? ""}
//                         </span>
//                       </div>

//                       {/* LAY BUTTON (LEFT) */}
//                       <div
//                         className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border border-[var(--lay-border)] ${isThisSelected(event.runnersName?.[0]?.runnerName, "lay") ? "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)]" : "bg-[var(--lay-bg)]"} hover:bg-[var(--lay-hover)] flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
//                         onClick={() => {
//                           const price = runner0?.ex?.availableToLay?.[0]?.price;
//                           const size = runner0?.ex?.availableToLay?.[0]?.size;
//                           if (!price || !size) return;
//                           setSelectedBet({
//                             type: "lay",
//                             odds: price,
//                             teamName: event.runnersName?.[0]?.runnerName,
//                             eventName: event.event?.name,
//                             marketType: event.marketType,
//                             // ✅ required for bet placement
//                             marketId: event.marketId,
//                             eventId: event.event?.id,
//                             sportId: event.eventType?.id,
//                             selectionId: runner0?.selectionId,
//                           });
//                         }}
//                       >
//                         <span
//                           className={`block whitespace-nowrap font-bold price leading-[1.1] ${isThisSelected(event.runnersName?.[0]?.runnerName, "lay") ? "text-[var(--lay-price-text)] dark:text-white" : "text-[var(--lay-price-text)]"}`}
//                         >
//                           {runner0?.ex?.availableToLay?.[0]?.price ?? "-"}
//                         </span>
//                         <span
//                           className={`block size whitespace-nowrap font-normal text-[10px] leading-[1] ${isThisSelected(event.runnersName?.[0]?.runnerName, "lay") ? "text-[var(--lay-price-text)] dark:text-white" : "text-[var(--lay-price-text)]"}`}
//                         >
//                           {shortNumber(
//                             runner0?.ex?.availableToLay?.[0]?.size,
//                           ) ?? ""}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* CENTER — Draw or disabled */}
//                   <div className="flex flex-col gap-0.5 w-[33.3%]">
//                     <span
//                       className={`block h-[1.125rem] text-(--palette-text-primary) font-bold text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
//                     >
//                       {hasThreeRunners
//                         ? event.runnersName?.[2]?.runnerName
//                         : ""}
//                     </span>
//                     <div className="flex gap-1">
//                       {/* BACK BUTTON (CENTER) */}
//                       <div
//                         className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border-[1px] flex flex-col justify-center items-center select-none transition-all ${
//                           hasThreeRunners
//                             ? hasCenterBackPrice
//                               ? `border-[var(--back-border)] ${isThisSelected(event.runnersName?.[2]?.runnerName, "back") ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)]" : "bg-[var(--back-bg)]"} hover:bg-[var(--back-hover)] cursor-pointer`
//                               : `border-[var(--back-noprice-border)] ${isThisSelected(event.runnersName?.[2]?.runnerName, "back") ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)]" : "bg-[var(--back-noprice-bg)]"} hover:bg-[var(--back-hover)] cursor-pointer`
//                             : "border-[var(--back-disabled-border)] bg-[var(--back-disabled-bg)] cursor-default"
//                         }`}
//                         onClick={() => {
//                           if (!hasThreeRunners) return;
//                           const price =
//                             runner2?.ex?.availableToBack?.[0]?.price;
//                           const size = runner2?.ex?.availableToBack?.[0]?.size;
//                           if (!price || !size) return;
//                           setSelectedBet({
//                             type: "back",
//                             odds: price,
//                             teamName: event.runnersName?.[2]?.runnerName,
//                             eventName: event.event?.name,
//                             marketType: event.marketType,
//                             // ✅ required for bet placement
//                             marketId: event.marketId,
//                             eventId: event.event?.id,
//                             sportId: event.eventType?.id,
//                             selectionId: runner2?.selectionId,
//                           });
//                         }}
//                       >
//                         <span
//                           className={`block whitespace-nowrap font-bold price leading-[1.1] ${
//                             isThisSelected(
//                               event.runnersName?.[2]?.runnerName,
//                               "back",
//                             )
//                               ? "text-[var(--back-price-text)] dark:text-white"
//                               : hasThreeRunners
//                                 ? hasCenterBackPrice
//                                   ? "text-[var(--back-price-text)]"
//                                   : "text-[var(--back-price-text-noprice)]"
//                                 : "text-[var(--back-price-text-disabled)]"
//                           }`}
//                         >
//                           {hasThreeRunners
//                             ? (runner2?.ex?.availableToBack?.[0]?.price ?? "-")
//                             : ""}
//                         </span>
//                         <span
//                           className={`block size whitespace-nowrap font-normal text-[10px] leading-[1] ${
//                             isThisSelected(
//                               event.runnersName?.[2]?.runnerName,
//                               "back",
//                             )
//                               ? "text-[var(--back-size-text)] dark:text-white"
//                               : hasThreeRunners
//                                 ? hasCenterBackPrice
//                                   ? "text-[var(--back-size-text)]"
//                                   : "text-[var(--back-size-text-noprice)]"
//                                 : "text-[var(--back-size-text-disabled)]"
//                           }`}
//                         >
//                           {hasThreeRunners
//                             ? (shortNumber(
//                                 runner2?.ex?.availableToBack?.[0]?.size,
//                               ) ?? "")
//                             : ""}
//                         </span>
//                       </div>

//                       {/* LAY BUTTON (CENTER) */}
//                       <div
//                         className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border-[1px] flex flex-col justify-center items-center select-none transition-all ${
//                           hasThreeRunners
//                             ? hasCenterLayPrice
//                               ? `border-[var(--lay-border)] ${isThisSelected(event.runnersName?.[2]?.runnerName, "lay") ? "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)]" : "bg-[var(--lay-bg)]"} hover:bg-[var(--lay-hover)] cursor-pointer`
//                               : `border-[var(--lay-noprice-border)] ${isThisSelected(event.runnersName?.[2]?.runnerName, "lay") ? "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)]" : "bg-[var(--lay-noprice-bg)]"} hover:bg-[var(--lay-hover)] cursor-pointer`
//                             : "border-[var(--lay-disabled-border)] bg-[var(--lay-disabled-bg)] cursor-default"
//                         }`}
//                         onClick={() => {
//                           if (!hasThreeRunners) return;
//                           const price = runner2?.ex?.availableToLay?.[0]?.price;
//                           const size = runner2?.ex?.availableToLay?.[0]?.size;
//                           if (!price || !size) return;
//                           setSelectedBet({
//                             type: "lay",
//                             odds: price,
//                             teamName: event.runnersName?.[2]?.runnerName,
//                             eventName: event.event?.name,
//                             marketType: event.marketType,
//                             // ✅ required for bet placement
//                             marketId: event.marketId,
//                             eventId: event.event?.id,
//                             sportId: event.eventType?.id,
//                             selectionId: runner2?.selectionId,
//                           });
//                         }}
//                       >
//                         <span
//                           className={`block whitespace-nowrap font-bold price leading-[1.1] ${
//                             isThisSelected(
//                               event.runnersName?.[2]?.runnerName,
//                               "lay",
//                             )
//                               ? "text-[var(--lay-price-text)] dark:text-white"
//                               : hasThreeRunners
//                                 ? "text-[var(--lay-price-text)]"
//                                 : "text-[var(--lay-price-text-disabled)]"
//                           }`}
//                         >
//                           {hasThreeRunners
//                             ? (runner2?.ex?.availableToLay?.[0]?.price ?? "-")
//                             : ""}
//                         </span>
//                         <span
//                           className={`block size whitespace-nowrap font-normal text-[10px] leading-[1] ${
//                             isThisSelected(
//                               event.runnersName?.[2]?.runnerName,
//                               "lay",
//                             )
//                               ? "text-[var(--lay-price-text)] dark:text-white"
//                               : hasThreeRunners
//                                 ? "text-[var(--lay-price-text)]"
//                                 : "text-[var(--lay-price-text-disabled)]"
//                           }`}
//                         >
//                           {hasThreeRunners
//                             ? (shortNumber(
//                                 runner2?.ex?.availableToLay?.[0]?.size,
//                               ) ?? "")
//                             : ""}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* RIGHT — Team 2 odds */}
//                   <div className="flex flex-col gap-0.5 w-[33.3%]">
//                     <span
//                       className={`block h-[1.125rem] font-bold text-(--palette-text-primary) text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
//                     >
//                       {rightRunnerName}
//                     </span>
//                     <div className="flex gap-1">
//                       {/* BACK BUTTON (RIGHT) */}
//                       <div
//                         className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border border-[var(--back-border)] ${isThisSelected(rightRunnerName, "back") ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)]" : "bg-[var(--back-bg)]"} hover:bg-[var(--back-hover)] flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
//                         onClick={() => {
//                           const price =
//                             rightRunner?.ex?.availableToBack?.[0]?.price;
//                           const size =
//                             rightRunner?.ex?.availableToBack?.[0]?.size;
//                           if (!price || !size) return;
//                           setSelectedBet({
//                             type: "back",
//                             odds: price,
//                             teamName: rightRunnerName,
//                             eventName: event.event?.name,
//                             marketType: event.marketType,
//                             // ✅ required for bet placement
//                             marketId: event.marketId,
//                             eventId: event.event?.id,
//                             sportId: event.eventType?.id,
//                             selectionId: rightRunner?.selectionId,
//                           });
//                         }}
//                       >
//                         <span
//                           className={`block whitespace-nowrap font-bold price leading-[1.1] ${isThisSelected(rightRunnerName, "back") ? "text-[var(--back-price-text)] dark:text-white" : "text-[var(--back-price-text)]"}`}
//                         >
//                           {rightRunner?.ex?.availableToBack?.[0]?.price ?? "-"}
//                         </span>
//                         <span
//                           className={`block size whitespace-nowrap font-normal text-[10px] leading-[1] ${isThisSelected(rightRunnerName, "back") ? "text-[var(--back-size-text)] dark:text-white" : "text-[var(--back-size-text)]"}`}
//                         >
//                           {shortNumber(
//                             rightRunner?.ex?.availableToBack?.[0]?.size,
//                           ) ?? ""}
//                         </span>
//                       </div>

//                       {/* LAY BUTTON (RIGHT) */}
//                       <div
//                         className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border border-[var(--lay-border)] ${isThisSelected(rightRunnerName, "lay") ? "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)]" : "bg-[var(--lay-bg)]"} hover:bg-[var(--lay-hover)] flex flex-col justify-center items-center cursor-pointer select-none transition-all`}
//                         onClick={() => {
//                           const price =
//                             rightRunner?.ex?.availableToLay?.[0]?.price;
//                           const size =
//                             rightRunner?.ex?.availableToLay?.[0]?.size;
//                           if (!price || !size) return;
//                           setSelectedBet({
//                             type: "lay",
//                             odds: price,
//                             teamName: rightRunnerName,
//                             eventName: event.event?.name,
//                             marketType: event.marketType,
//                             // ✅ required for bet placement
//                             marketId: event.marketId,
//                             eventId: event.event?.id,
//                             sportId: event.eventType?.id,
//                             selectionId: rightRunner?.selectionId,
//                           });
//                         }}
//                       >
//                         <span
//                           className={`block whitespace-nowrap font-bold price leading-[1.1] ${isThisSelected(rightRunnerName, "lay") ? "text-[var(--lay-price-text)] dark:text-white" : "text-[var(--lay-price-text)]"}`}
//                         >
//                           {rightRunner?.ex?.availableToLay?.[0]?.price ?? "-"}
//                         </span>
//                         <span
//                           className={`block size whitespace-nowrap font-normal text-[10px] leading-[1] ${isThisSelected(rightRunnerName, "lay") ? "text-[var(--lay-price-text)] dark:text-white" : "text-[var(--lay-price-text)]"}`}
//                         >
//                           {shortNumber(
//                             rightRunner?.ex?.availableToLay?.[0]?.size,
//                           ) ?? ""}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {isBetOnThisEvent && (
//                 <div ref={betslipRef} className="block lg:hidden">
//                   <MBetSlip />
//                 </div>
//               )}
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default SingleMarket;

// "use client";
// import { shortNumber } from "@/lib/functions";
// import { useAppStore } from "@/lib/store/store";
// import style from "@/components/common/single-market/style.module.css";
// import { AnimatedNumber } from "@/components/common/animatied-number";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { useEffect, useRef, useState, useCallback, memo } from "react";
// import { EventTimer } from "./event-timer";
// import Icon from "@/icons/icons";
// import MBetSlip from "@/components/common/m-betslip";
// import dynamic from "next/dynamic";
// import { http } from "@/lib/axios-instance";
// import { CONFIG } from "@/lib/config";
// import { eventBus } from "@/lib/eventBus";
// import { useParams } from "next/navigation";
// const MarketLoader = dynamic(() => import("@/components/common/market-loader"));

// const EventRow = memo(
//   ({
//     event,
//     selectedBet,
//     setSelectedBet,
//     betslipRef,
//   }: {
//     event: any;
//     selectedBet: any;
//     setSelectedBet: (bet: any) => void;
//     betslipRef: React.RefObject<HTMLDivElement | null>;
//   }) => {
//     const runner0 = event.runners?.[0];
//     const runner1 = event.runners?.[1];
//     const runner2 = event.runners?.[2];
//     const hasThreeRunners = event.runners?.length === 3;
//     const isCricket = event.eventType?.name?.toLowerCase() === "cricket";

//     const oddsBoxWidthClass = "w-[75%] @min-[700]:w-[57.5px]";
//     const oddsRowLabelWidthClass = "@md:w-[119px] @md:mx-auto";

//     const hasCenterBackPrice = !!runner2?.ex?.availableToBack?.[0]?.price;
//     const hasCenterLayPrice = !!runner2?.ex?.availableToLay?.[0]?.price;

//     const rightRunner = runner1;
//     const rightRunnerName = event.runnersName?.[1]?.runnerName;
//     const isBetOnThisEvent = selectedBet?.eventName === event.event?.name;
//     const selectedTeam = selectedBet?.teamName;
//     const selectedType = selectedBet?.type;

//     const isThisSelected = useCallback(
//       (runnerName: string, betType: "back" | "lay") =>
//         isBetOnThisEvent &&
//         selectedTeam === runnerName &&
//         selectedType === betType,
//       [isBetOnThisEvent, selectedTeam, selectedType],
//     );

//     // ── Bet click handlers (stable references per row) ──
//     const handleBet = useCallback(
//       (
//         runner: any,
//         runnerName: string,
//         betType: "back" | "lay",
//       ) => {
//         const side = betType === "back" ? "availableToBack" : "availableToLay";
//         const price = runner?.ex?.[side]?.[0]?.price;
//         const size = runner?.ex?.[side]?.[0]?.size;
//         if (!price || !size) return;
//         setSelectedBet({
//           type: betType,
//           odds: price,
//           teamName: runnerName,
//           eventName: event.event?.name,
//           marketType: event.marketType,
//           marketId: event.marketId,
//           eventId: event.event?.id,
//           sportId: event.eventType?.id,
//           selectionId: runner?.selectionId,
//         });
//       },
//       [event, setSelectedBet],
//     );

//     // ── Reusable odds box ──
//     const OddsBox = ({
//       runner,
//       runnerName,
//       betType,
//       disabled = false,
//       noPrice = false,
//     }: {
//       runner: any;
//       runnerName: string;
//       betType: "back" | "lay";
//       disabled?: boolean;
//       noPrice?: boolean;
//     }) => {
//       const isBack = betType === "back";
//       const selected = isThisSelected(runnerName, betType);
//       const side = isBack ? "availableToBack" : "availableToLay";
//       const price = runner?.ex?.[side]?.[0]?.price;
//       const size = runner?.ex?.[side]?.[0]?.size;

//       const bgClass = disabled
//         ? isBack
//           ? "bg-[var(--back-disabled-bg)] border-[var(--back-disabled-border)] cursor-default"
//           : "bg-[var(--lay-disabled-bg)] border-[var(--lay-disabled-border)] cursor-default"
//         : selected
//           ? isBack
//             ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)] border-[var(--back-border)] cursor-pointer"
//             : "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)] border-[var(--lay-border)] cursor-pointer"
//           : noPrice
//             ? isBack
//               ? "bg-[var(--back-noprice-bg)] hover:bg-[var(--back-hover)] border-[var(--back-noprice-border)] cursor-pointer"
//               : "bg-[var(--lay-noprice-bg)] hover:bg-[var(--lay-hover)] border-[var(--lay-noprice-border)] cursor-pointer"
//             : isBack
//               ? "bg-[var(--back-bg)] hover:bg-[var(--back-hover)] border-[var(--back-border)] cursor-pointer"
//               : "bg-[var(--lay-bg)] hover:bg-[var(--lay-hover)] border-[var(--lay-border)] cursor-pointer";

//       const priceTextClass = disabled
//         ? isBack
//           ? "text-[var(--back-price-text-disabled)]"
//           : "text-[var(--lay-price-text-disabled)]"
//         : selected
//           ? isBack
//             ? "text-[var(--back-price-text)] dark:text-white"
//             : "text-[var(--lay-price-text)] dark:text-white"
//           : noPrice
//             ? isBack
//               ? "text-[var(--back-price-text-noprice)]"
//               : "text-[var(--lay-price-text)]"
//             : isBack
//               ? "text-[var(--back-price-text)]"
//               : "text-[var(--lay-price-text)]";

//       const sizeTextClass = disabled
//         ? isBack
//           ? "text-[var(--back-size-text-disabled)]"
//           : "text-[var(--lay-price-text-disabled)]"
//         : selected
//           ? isBack
//             ? "text-[var(--back-size-text)] dark:text-white"
//             : "text-[var(--lay-price-text)] dark:text-white"
//           : noPrice
//             ? isBack
//               ? "text-[var(--back-size-text-noprice)]"
//               : "text-[var(--lay-price-text)]"
//             : isBack
//               ? "text-[var(--back-size-text)]"
//               : "text-[var(--lay-price-text)]";

//       return (
//         <div
//           className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border flex flex-col justify-center items-center select-none transition-all ${bgClass}`}
//           onClick={() => !disabled && handleBet(runner, runnerName, betType)}
//         >
//           <span className={`block whitespace-nowrap font-bold price leading-[1.1] ${priceTextClass}`}>
//             {disabled ? "" : (price ?? "-")}
//           </span>
//           <span className={`block size whitespace-nowrap font-normal text-[10px] leading-[1] ${sizeTextClass}`}>
//             {disabled ? "" : (shortNumber(size) ?? "")}
//           </span>
//         </div>
//       );
//     };

//     return (
//       <li
//         key={event.marketId}
//         className="w-full rounded-[2px] border border-dashed border-(--dotted-line) bg-[rgba(145,158,171,0.04)] text-white! overflow-hidden mb-[6px]"
//       >
//         <div className="flex w-full flex-col @min-[700]:flex-row">
//           {/* ── LEFT CONTENT ── */}
//           <div className="w-full p-[5px]">
//             {/* Sport + Competition */}
//             <div className="flex flex-row whitespace-nowrap items-center max-w-full min-h-[1.125rem] overflow-hidden -mt-1 mr-5 -mb-1 -ml-1 text-[9px] font-bold tracking-[0.7px] uppercase text-[#098DEE]">
//               <Link
//                 href={`/sport/${event?.eventType?.name}`}
//                 className="m-0 [font:inherit] [letter-spacing:inherit] text-(--primary-color) no-underline relative rounded-[8px] py-1 px-0 inline-block"
//               >
//                 <div className="rounded-1 px-1">{event.eventType?.name}</div>
//               </Link>
//               <span className="h-1 w-1 rounded-full bg-[rgb(99,115,129)]"></span>
//               <Link
//                 href={`/sport/${event?.eventType?.name}/${event?.competition?.id}`}
//                 className="m-0 [font:inherit] [letter-spacing:inherit] text-(--primary-color) no-underline relative rounded-[8px] py-1 px-0 inline-block"
//               >
//                 <div className="rounded-1 px-1">{event.competition?.name}</div>
//               </Link>
//             </div>

//             {/* Runner Names */}
//             <Link
//               href={`/market-details/${event.event?.id}/${event.eventType.id}`}
//               className="flex flex-col w-full min-w-0 flex-auto no-underline"
//             >
//               <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
//                 <div className="flex flex-row gap-1.5 items-center">
//                   <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
//                     {event.runnersName?.[0]?.runnerName}
//                   </p>
//                   {event.inplay && isCricket && runner0?.status === "ACTIVE" && (
//                     <Icon name="bat" className="w-5 h-5 text-(--primary-color)" />
//                   )}
//                 </div>
//               </div>

//               <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
//                 <div className="flex flex-row gap-1.5 items-center">
//                   <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
//                     {rightRunnerName}
//                   </p>
//                   {event.inplay && isCricket && rightRunner?.status === "ACTIVE" && (
//                     <Icon name="bat" className="w-5 h-5 text-(--primary-color)" />
//                   )}
//                 </div>
//                 <div className="flex flex-row gap-1.5">
//                   <span className="text-[#68cdf9] text-[12px] bg-[#078dee29] min-w-12 px-4 h-4.5 inline-flex justify-center items-center rounded-[4px] font-bold">
//                     {event.score ?? "0/0"}
//                   </span>
//                 </div>
//               </div>
//             </Link>

//             {/* Meta row */}
//             <div className="flex flex-row gap-3 justify-start items-center h-4 leading-4 contain-strict pointer-events-none overflow-hidden mt-0.5">
//               <div className="min-w-9.5">
//                 <div className="flex gap-1.5">
//                   {event.inplay && (
//                     <div className={`flex justify-center items-center ${style.animateLiveBlink}`}>
//                       <div className="w-[7px] h-[7px] bg-[#508d0e] rounded-full"></div>
//                     </div>
//                   )}
//                   <div
//                     className={`m-0 font-sans truncate whitespace-nowrap text-[10px] font-bold leading-[1rem] ${event.inplay ? "text-(--primary-color)" : "text-[var(--secondary-text-color)]"}`}
//                   >
//                     {event.inplay ? (
//                       "In-Play"
//                     ) : (
//                       <EventTimer startTime={event?.marketStartTime} />
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="flex items-center gap-1 text-black">
//                 <Icon name="bookMark" className="h-[14px] w-[14px]" />
//                 <Icon name="fancy" className="h-[14px] w-[14px]" />
//                 <Icon name="sportsbook" className="h-[14px] w-[14px]" />
//               </div>

//               <div className="w-4 h-4 pb-0.5 text-(--palette-text-primary)">
//                 <Icon name="watch" className="w-4 h-4" />
//               </div>

//               <div>
//                 <p className="m-0 font-sans whitespace-nowrap text-[var(--secondary-text-color)] text-[10px] font-bold uppercase leading-4 truncate overflow-hidden">
//                   Matched :{" "}
//                   <span className="text-[10px] font-bold text-[var(--primary-text-color)] leading-[1rem]">
//                     <AnimatedNumber value={event.totalMatched} inplay={event.inplay} />
//                   </span>
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ── RIGHT ODDS ── */}
//           <div className="flex flex-row gap-2 items-center whitespace-nowrap relative w-full @md:min-w-fit leading-[1.125rem] text-xs p-[5px] overflow-hidden @min-[700px]:flex-[1_0_20rem]">
//             {/* LEFT — Team 1 */}
//             <div className="flex flex-col gap-0.5 w-[33.3%]">
//               <span className={`block h-[1.125rem] text-(--palette-text-primary) font-bold text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}>
//                 {event.runnersName?.[0]?.runnerName}
//               </span>
//               <div className="flex gap-1">
//                 <OddsBox runner={runner0} runnerName={event.runnersName?.[0]?.runnerName} betType="back" />
//                 <OddsBox runner={runner0} runnerName={event.runnersName?.[0]?.runnerName} betType="lay" />
//               </div>
//             </div>

//             {/* CENTER — Draw */}
//             <div className="flex flex-col gap-0.5 w-[33.3%]">
//               <span className={`block h-[1.125rem] text-(--palette-text-primary) font-bold text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}>
//                 {hasThreeRunners ? event.runnersName?.[2]?.runnerName : ""}
//               </span>
//               <div className="flex gap-1">
//                 <OddsBox
//                   runner={hasThreeRunners ? runner2 : null}
//                   runnerName={event.runnersName?.[2]?.runnerName}
//                   betType="back"
//                   disabled={!hasThreeRunners}
//                   noPrice={hasThreeRunners && !hasCenterBackPrice}
//                 />
//                 <OddsBox
//                   runner={hasThreeRunners ? runner2 : null}
//                   runnerName={event.runnersName?.[2]?.runnerName}
//                   betType="lay"
//                   disabled={!hasThreeRunners}
//                   noPrice={hasThreeRunners && !hasCenterLayPrice}
//                 />
//               </div>
//             </div>

//             {/* RIGHT — Team 2 */}
//             <div className="flex flex-col gap-0.5 w-[33.3%]">
//               <span className={`block h-[1.125rem] font-bold text-(--palette-text-primary) text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}>
//                 {rightRunnerName}
//               </span>
//               <div className="flex gap-1">
//                 <OddsBox runner={rightRunner} runnerName={rightRunnerName} betType="back" />
//                 <OddsBox runner={rightRunner} runnerName={rightRunnerName} betType="lay" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile betslip — sirf selected event pe */}
//         {isBetOnThisEvent && (
//           <div ref={betslipRef} className="block lg:hidden">
//             <MBetSlip />
//           </div>
//         )}
//       </li>
//     );
//   },
//   // Custom comparator — sirf tab re-render karo jab ye event ya selectedBet change ho
//   (prev, next) => {
//     const sameEvent = prev.event === next.event;
//     const sameBet =
//       prev.selectedBet?.eventName === next.selectedBet?.eventName &&
//       prev.selectedBet?.teamName === next.selectedBet?.teamName &&
//       prev.selectedBet?.type === next.selectedBet?.type;
//     return sameEvent && sameBet;
//   },
// );

// EventRow.displayName = "EventRow";
// const BATCH_SIZE = 30; // pehle itne dikhao, phir baaki

// const SingleMarket = ({
//   events,
//   className,
// }: {
//   events: any;
//   className?: string;
// }) => {
//   const { setSelectedBet, selectedBet } = useAppStore();
//   const betslipRef = useRef<HTMLDivElement | null>(null);

//   const params = useParams();
//   const eventId = (params as any)?.eventId || "";
//   const sportId = (params as any)?.sportId || "";

//   // ── Progressive rendering: pehle 30, phir sab ──
//   const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

//   useEffect(() => {
//     if (!events || events.length <= BATCH_SIZE) return;
//     const id = requestIdleCallback(
//       () => setVisibleCount(events.length),
//       { timeout: 500 },
//     );
//     return () => cancelIdleCallback(id);
//   }, [events]);

//   // ── REFRESH_AFTER_PLACE event bus ──
//   useEffect(() => {
//     const unsub = eventBus.on(
//       "REFRESH_AFTER_PLACE",
//       async ({ eventId: eId, sportId: sId }: any) => {
//         const eIdToUse = eId || eventId;
//         const sIdToUse = sId || sportId;
//         if (!eIdToUse || !sIdToUse) return;
//         try {
//           await http.post(CONFIG.getAllMarketplURL, {
//             eventId: String(eIdToUse),
//             sportId: String(sIdToUse),
//           });
//         } catch {}
//         try {
//           await http.post(CONFIG.unmatchedBets, {
//             eventId: String(eIdToUse),
//             sportId: String(sIdToUse),
//           });
//         } catch {}
//       },
//     );
//     return unsub;
//   }, [eventId, sportId]);

//   // ── Scroll to betslip when bet selected ──
//   useEffect(() => {
//     if (selectedBet?.eventName && betslipRef.current) {
//       requestAnimationFrame(() => {
//         const el = betslipRef.current!;
//         const elementPosition = el.getBoundingClientRect().top + window.scrollY;
//         const offset = window.innerHeight / 2 - el.offsetHeight / 2;
//         let position = elementPosition - offset;
//         if (position < 0) position = 0;
//         window.scrollTo({ top: position, behavior: "smooth" });
//       });
//     }
//   }, [selectedBet?.eventName, selectedBet?.teamName]);

//   if (!events) return <MarketLoader />;

//   const visibleEvents = events.slice(0, visibleCount);

//   return (
//     <div id="single-market.tsx">
//       <ul className={cn("min-[900]:mt-6 mt-4", className)}>
//         {visibleEvents.map((event: any) => (
//           <EventRow
//             key={event.marketId}
//             event={event}
//             selectedBet={selectedBet}
//             setSelectedBet={setSelectedBet}
//             betslipRef={betslipRef}
//           />
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default SingleMarket;

"use client";
import { shortNumber } from "@/lib/functions";
import { useAppStore } from "@/lib/store/store";
import style from "@/components/common/single-market/style.module.css";
import { AnimatedNumber } from "@/components/common/animatied-number";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useRef, useState, useCallback, memo } from "react";
import { EventTimer } from "./event-timer";
import Icon from "@/icons/icons";
import MBetSlip from "@/components/common/m-betslip";
import dynamic from "next/dynamic";
import { http } from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import { eventBus } from "@/lib/eventBus";
import { useParams } from "next/navigation";

const MarketLoader = dynamic(() => import("@/components/common/market-loader"));

// ─────────────────────────────────────────────
// Single Event Row — fully memoized
// ─────────────────────────────────────────────
const EventRow = memo(
  ({
    event,
    selectedBet,
    setSelectedBet,
    betslipRef,
  }: {
    event: any;
    selectedBet: any;
    setSelectedBet: (bet: any) => void;
    betslipRef: React.RefObject<HTMLDivElement | null>;
  }) => {
    const runner0 = event.runners?.[0];
    const runner1 = event.runners?.[1];
    const runner2 = event.runners?.[2];
    const hasThreeRunners = event.runners?.length === 3;
    const isCricket = event.eventType?.name?.toLowerCase() === "cricket";

    const oddsBoxWidthClass = "w-[75%] @min-[700]:w-[57.5px]";
    const oddsRowLabelWidthClass = "@md:w-[119px] @md:mx-auto";

    const hasCenterBackPrice = !!runner2?.ex?.availableToBack?.[0]?.price;
    const hasCenterLayPrice = !!runner2?.ex?.availableToLay?.[0]?.price;

    const rightRunner = runner1;
    const rightRunnerName = event.runnersName?.[1]?.runnerName;
    const isBetOnThisEvent = selectedBet?.eventName === event.event?.name;
    const selectedTeam = selectedBet?.teamName;
    const selectedType = selectedBet?.type;

    const isThisSelected = useCallback(
      (runnerName: string, betType: "back" | "lay") =>
        isBetOnThisEvent &&
        selectedTeam === runnerName &&
        selectedType === betType,
      [isBetOnThisEvent, selectedTeam, selectedType],
    );

    const handleBet = useCallback(
      (runner: any, runnerName: string, betType: "back" | "lay") => {
        const side = betType === "back" ? "availableToBack" : "availableToLay";
        const price = runner?.ex?.[side]?.[0]?.price;
        const size = runner?.ex?.[side]?.[0]?.size;
        if (!price || !size) return;
        setSelectedBet({
          type: betType,
          odds: price,
          teamName: runnerName,
          eventName: event.event?.name,
          marketType: event.marketType,
          marketId: event.marketId,
          eventId: event.event?.id,
          sportId: event.eventType?.id,
          selectionId: runner?.selectionId,
        });
      },
      [event, setSelectedBet],
    );

    const OddsBox = ({
      runner,
      runnerName,
      betType,
      disabled = false,
      noPrice = false,
    }: {
      runner: any;
      runnerName: string;
      betType: "back" | "lay";
      disabled?: boolean;
      noPrice?: boolean;
    }) => {
      const isBack = betType === "back";
      const selected = isThisSelected(runnerName, betType);
      const side = isBack ? "availableToBack" : "availableToLay";
      const price = runner?.ex?.[side]?.[0]?.price;
      const size = runner?.ex?.[side]?.[0]?.size;

      const bgClass = disabled
        ? isBack
          ? "bg-[var(--back-disabled-bg)] border-[var(--back-disabled-border)] cursor-default"
          : "bg-[var(--lay-disabled-bg)] border-[var(--lay-disabled-border)] cursor-default"
        : selected
          ? isBack
            ? "bg-[var(--back-selected)] hover:bg-[var(--back-selected)] border-[var(--back-border)] cursor-pointer"
            : "bg-[var(--lay-selected)] hover:bg-[var(--lay-selected)] border-[var(--lay-border)] cursor-pointer"
          : noPrice
            ? isBack
              ? "bg-[var(--back-noprice-bg)] hover:bg-[var(--back-hover)] border-[var(--back-noprice-border)] cursor-pointer"
              : "bg-[var(--lay-noprice-bg)] hover:bg-[var(--lay-hover)] border-[var(--lay-noprice-border)] cursor-pointer"
            : isBack
              ? "bg-[var(--back-bg)] hover:bg-[var(--back-hover)] border-[var(--back-border)] cursor-pointer"
              : "bg-[var(--lay-bg)] hover:bg-[var(--lay-hover)] border-[var(--lay-border)] cursor-pointer";

      const priceTextClass = disabled
        ? isBack
          ? "text-[var(--back-price-text-disabled)]"
          : "text-[var(--lay-price-text-disabled)]"
        : selected
          ? isBack
            ? "text-[var(--back-price-text)] dark:text-white"
            : "text-[var(--lay-price-text)] dark:text-white"
          : noPrice
            ? isBack
              ? "text-[var(--back-price-text-noprice)]"
              : "text-[var(--lay-price-text)]"
            : isBack
              ? "text-[var(--back-price-text)]"
              : "text-[var(--lay-price-text)]";

      const sizeTextClass = disabled
        ? isBack
          ? "text-[var(--back-size-text-disabled)]"
          : "text-[var(--lay-price-text-disabled)]"
        : selected
          ? isBack
            ? "text-[var(--back-size-text)] dark:text-white"
            : "text-[var(--lay-price-text)] dark:text-white"
          : noPrice
            ? isBack
              ? "text-[var(--back-size-text-noprice)]"
              : "text-[var(--lay-price-text)]"
            : isBack
              ? "text-[var(--back-size-text)]"
              : "text-[var(--lay-price-text)]";

      return (
        <div
          className={`${oddsBoxWidthClass} h-[45px] gap-[2px] rounded-[8px] border flex flex-col justify-center items-center select-none transition-all ${bgClass}`}
          onClick={() => !disabled && handleBet(runner, runnerName, betType)}
        >
          <span
            className={`block whitespace-nowrap font-bold price leading-[1.1] ${priceTextClass}`}
          >
            {disabled ? "" : (price ?? "-")}
          </span>
          <span
            className={`block size whitespace-nowrap font-normal text-[10px] leading-[1] ${sizeTextClass}`}
          >
            {disabled ? "" : (shortNumber(size) ?? "")}
          </span>
        </div>
      );
    };

    return (
      <li className="w-full rounded-[2px] border border-dashed border-(--dotted-line) bg-[rgba(145,158,171,0.04)] text-white! overflow-hidden mb-[6px]">
        <div className="flex w-full flex-col @min-[700]:flex-row">
          {/* LEFT CONTENT */}
          <div className="w-full p-[5px]">
            <div className="flex flex-row whitespace-nowrap items-center max-w-full min-h-[1.125rem] overflow-hidden -mt-1 mr-5 -mb-1 -ml-1 text-[9px] font-bold tracking-[0.7px] uppercase text-[#098DEE]">
              <Link
                href={`/sport/${event?.eventType?.name}`}
                className="m-0 [font:inherit] [letter-spacing:inherit] text-(--primary-color) no-underline relative rounded-[8px] py-1 px-0 inline-block"
              >
                <div className="rounded-1 px-1">{event.eventType?.name}</div>
              </Link>
              <span className="h-1 w-1 rounded-full bg-[rgb(99,115,129)]"></span>
              <Link
                href={`/sport/${event?.eventType?.name}/${event?.competition?.id}`}
                className="m-0 [font:inherit] [letter-spacing:inherit] text-(--primary-color) no-underline relative rounded-[8px] py-1 px-0 inline-block"
              >
                <div className="rounded-1 px-1">{event.competition?.name}</div>
              </Link>
            </div>

            <Link
              href={`/market-details/${event.event?.id}/${event.eventType.id}`}
              className="flex flex-col w-full min-w-0 flex-auto no-underline"
            >
              <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
                <div className="flex flex-row gap-1.5 items-center">
                  <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
                    {event.runnersName?.[0]?.runnerName}
                  </p>
                  {event.inplay &&
                    isCricket &&
                    runner0?.status === "ACTIVE" && (
                      <Icon
                        name="bat"
                        className="w-5 h-5 text-(--primary-color)"
                      />
                    )}
                </div>
              </div>

              <div className="flex flex-row gap-1.5 overflow-hidden justify-between items-center">
                <div className="flex flex-row gap-1.5 items-center">
                  <p className="m-0 font-sans truncate text-[13px] font-bold leading-[1.3rem] text-[var(--palette-text-primary)]">
                    {rightRunnerName}
                  </p>
                  {event.inplay &&
                    isCricket &&
                    rightRunner?.status === "ACTIVE" && (
                      <Icon
                        name="bat"
                        className="w-5 h-5 text-(--primary-color)"
                      />
                    )}
                </div>
                <div className="flex flex-row gap-1.5">
                  <span className="text-[#68cdf9] text-[12px] bg-[#078dee29] min-w-12 px-4 h-4.5 inline-flex justify-center items-center rounded-[4px] font-bold">
                    {event.score ?? "0/0"}
                  </span>
                </div>
              </div>
            </Link>

            <div className="flex flex-row gap-3 justify-start items-center h-4 leading-4 contain-strict pointer-events-none overflow-hidden mt-0.5">
              <div className="min-w-9.5">
                <div className="flex gap-1.5">
                  {event.inplay && (
                    <div
                      className={`flex justify-center items-center ${style.animateLiveBlink}`}
                    >
                      <div className="w-[7px] h-[7px] bg-[#508d0e] rounded-full"></div>
                    </div>
                  )}
                  <div
                    className={`m-0 font-sans truncate whitespace-nowrap text-[10px] font-bold leading-[1rem] ${event.inplay ? "text-(--primary-color)" : "text-[var(--secondary-text-color)]"}`}
                  >
                    {event.inplay ? (
                      "In-Play"
                    ) : (
                      <EventTimer startTime={event?.marketStartTime} />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-black">
                <Icon name="bookMark" className="h-[14px] w-[14px]" />
                <Icon name="fancy" className="h-[14px] w-[14px]" />
                <Icon name="sportsbook" className="h-[14px] w-[14px]" />
              </div>

              <div className="w-4 h-4 pb-0.5 text-(--palette-text-primary)">
                <Icon name="watch" className="w-4 h-4" />
              </div>

              <div>
                <p className="m-0 font-sans whitespace-nowrap text-[var(--secondary-text-color)] text-[10px] font-bold uppercase leading-4 truncate overflow-hidden">
                  Matched :{" "}
                  <span className="text-[10px] font-bold text-[var(--primary-text-color)] leading-[1rem]">
                    <AnimatedNumber
                      value={event.totalMatched}
                      inplay={event.inplay}
                    />
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT ODDS */}
          <div className="flex flex-row gap-2 items-center whitespace-nowrap relative w-full @md:min-w-fit leading-[1.125rem] text-xs p-[5px] overflow-hidden @min-[700px]:flex-[1_0_20rem]">
            {/* Team 1 */}
            <div className="flex flex-col gap-0.5 w-[33.3%]">
              <span
                className={`block h-[1.125rem] text-(--palette-text-primary) font-bold text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
              >
                {event.runnersName?.[0]?.runnerName}
              </span>
              <div className="flex gap-1">
                <OddsBox
                  runner={runner0}
                  runnerName={event.runnersName?.[0]?.runnerName}
                  betType="back"
                />
                <OddsBox
                  runner={runner0}
                  runnerName={event.runnersName?.[0]?.runnerName}
                  betType="lay"
                />
              </div>
            </div>

            {/* Draw */}
            <div className="flex flex-col gap-0.5 w-[33.3%]">
              <span
                className={`block h-[1.125rem] text-(--palette-text-primary) font-bold text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
              >
                {hasThreeRunners ? event.runnersName?.[2]?.runnerName : ""}
              </span>
              <div className="flex gap-1">
                <OddsBox
                  runner={hasThreeRunners ? runner2 : null}
                  runnerName={event.runnersName?.[2]?.runnerName}
                  betType="back"
                  disabled={!hasThreeRunners}
                  noPrice={hasThreeRunners && !hasCenterBackPrice}
                />
                <OddsBox
                  runner={hasThreeRunners ? runner2 : null}
                  runnerName={event.runnersName?.[2]?.runnerName}
                  betType="lay"
                  disabled={!hasThreeRunners}
                  noPrice={hasThreeRunners && !hasCenterLayPrice}
                />
              </div>
            </div>

            {/* Team 2 */}
            <div className="flex flex-col gap-0.5 w-[33.3%]">
              <span
                className={`block h-[1.125rem] font-bold text-(--palette-text-primary) text-center truncate overflow-hidden ${oddsRowLabelWidthClass}`}
              >
                {rightRunnerName}
              </span>
              <div className="flex gap-1">
                <OddsBox
                  runner={rightRunner}
                  runnerName={rightRunnerName}
                  betType="back"
                />
                <OddsBox
                  runner={rightRunner}
                  runnerName={rightRunnerName}
                  betType="lay"
                />
              </div>
            </div>
          </div>
        </div>

        {isBetOnThisEvent && (
          <div ref={betslipRef} className="block lg:hidden">
            <MBetSlip />
          </div>
        )}
      </li>
    );
  },
  (prev, next) => {
    const sameEvent = prev.event === next.event;
    const sameBet =
      prev.selectedBet?.eventName === next.selectedBet?.eventName &&
      prev.selectedBet?.teamName === next.selectedBet?.teamName &&
      prev.selectedBet?.type === next.selectedBet?.type;
    return sameEvent && sameBet;
  },
);

EventRow.displayName = "EventRow";

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const BATCH_SIZE = 30;

const SingleMarket = ({
  events,
  className,
}: {
  events: any;
  className?: string;
}) => {
  const { setSelectedBet, selectedBet } = useAppStore();
  const betslipRef = useRef<HTMLDivElement | null>(null);

  const params = useParams();
  const eventId = (params as any)?.eventId || "";
  const sportId = (params as any)?.sportId || "";

  const sportKey = events?.[0]?.eventType?.id ?? "none";

  // Initial count ko thoda bada rakhein taaki "Above the fold" foran dikhe
  const [visibleCount, setVisibleCount] = useState(40); 

  // Jab sport change ho, toh foran reset aur update karein
  useEffect(() => {
    // 1. Pehla batch turant dikhao
    setVisibleCount(40);

    // 2. Agar events zyada hain, toh agle frame mein baaki sab dikha do
    // requestIdleCallback ki jagah requestAnimationFrame fast hai
    if (events?.length > 40) {
      const frame = requestAnimationFrame(() => {
        setVisibleCount(events.length);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [sportKey, events?.length]);

  useEffect(() => {
    const unsub = eventBus.on(
      "REFRESH_AFTER_PLACE",
      async ({ eventId: eId, sportId: sId }: any) => {
        const eIdToUse = eId || eventId;
        const sIdToUse = sId || sportId;
        if (!eIdToUse || !sIdToUse) return;
        try {
          await http.post(CONFIG.getAllMarketplURL, {
            eventId: String(eIdToUse),
            sportId: String(sIdToUse),
          });
        } catch {}
        try {
          await http.post(CONFIG.unmatchedBets, {
            eventId: String(eIdToUse),
            sportId: String(sIdToUse),
          });
        } catch {}
      },
    );
    return unsub;
  }, [eventId, sportId]);

  // Scroll to betslip
  useEffect(() => {
    if (selectedBet?.eventName && betslipRef.current) {
      requestAnimationFrame(() => {
        const el = betslipRef.current!;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        const offset = window.innerHeight / 2 - el.offsetHeight / 2;
        let position = elementPosition - offset;
        if (position < 0) position = 0;
        window.scrollTo({ top: position, behavior: "smooth" });
      });
    }
  }, [selectedBet?.eventName, selectedBet?.teamName]);

  if (!events) return <MarketLoader />;

  return (
    <div id="single-market.tsx">
      <ul className={cn("min-[900]:mt-6 mt-4", className)}>
        {events.slice(0, visibleCount).map((event: any) => (
          <EventRow
            key={event.marketId}
            event={event}
            selectedBet={selectedBet}
            setSelectedBet={setSelectedBet}
            betslipRef={betslipRef}
          />
        ))}
      </ul>
    </div>
  );
};

export default SingleMarket