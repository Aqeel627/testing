// "use client";

// import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import { usePathname } from "next/navigation";
// import http from "@/lib/axios-instance";
// import { CONFIG } from "@/lib/config";
// import MatchOdd from "@/components/common/my-bets/match-odd";
// import { eventBus } from "@/lib/eventBus";
// import { useAuthStore } from "@/lib/useAuthStore";

// type ExposureItem = {
//   event?: { id: string; name: string };
//   eventType?: { id: string; name: string };
//   betCounts?: number;
//   eventName?: string;
//   [k: string]: any;
// };

// type Bet = {
//   marketId?: string;
//   marketName?: string;
//   betId?: string;
//   selectionName?: string;
//   requestedPrice?: number;
//   requestedSize?: number;
//   matchedDate?: string | Date;
//   placedDate?: string | Date;
//   side?: "BACK" | "LAY" | string;
// };

// type MarketGroup = {
//   marketId: string;
//   marketName: string;
//   BACK: Bet[];
//   LAY: Bet[];
// };

// export default function DesktopOpenBetsRightNav() {
//   const pathname = usePathname();
//   const { isLoggedIn } = useAuthStore();

//   // route: /market-details/:eventId/:sportId
//   const routeMatch = useMemo(
//     () => pathname.match(/^\/market-details\/([^/]+)\/([^/]+)/),
//     [pathname],
//   );

//   const isMarketDetails = !!routeMatch;
//   const routeEventId = routeMatch?.[1] ?? null;
//   const routeSportId = routeMatch?.[2] ?? null;

//   // dropdown states (only for non-market pages)
//   const [exposureList, setExposureList] = useState<ExposureItem[]>([]);
//   const [selectedMarketValue, setSelectedMarketValue] = useState<string>(""); // "sportId,eventId"

//   const [unmatchedBets, setUnmatchedBets] = useState<Bet[]>([]);
//   const [matchedBets, setMatchedBets] = useState<MarketGroup[]>([]);
//   const [loading, setLoading] = useState(false);

//   const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const clearLoop = () => {
//     if (loopRef.current) {
//       clearTimeout(loopRef.current);
//       loopRef.current = null;
//     }
//   };

//   const groupMatchedByMarket = (rawMatched: Bet[]): MarketGroup[] => {
//     const grouped: Record<string, { marketName: string; BACK: Bet[]; LAY: Bet[] }> = {};

//     (rawMatched || []).forEach((bet) => {
//       if (!bet.marketId) return;

//       if (!grouped[bet.marketId]) {
//         grouped[bet.marketId] = {
//           marketName: bet.marketName || "",
//           BACK: [],
//           LAY: [],
//         };
//       }

//       const sideKey = (bet.side as "BACK" | "LAY") || "BACK";
//       grouped[bet.marketId][sideKey].push(bet);
//     });

//     return Object.entries(grouped).map(([marketId, data]) => ({
//       marketId,
//       marketName: data.marketName,
//       BACK: data.BACK,
//       LAY: data.LAY,
//     }));
//   };

//   const getUnMatchedBetList = useCallback(
//     async (
//       sportId?: string | null,
//       eventId?: string | null,
//       opts?: { schedule?: boolean },
//     ) => {
//       if (!sportId || !eventId) return false;
//       if (!localStorage.getItem("token")) return false;

//       setLoading(true);
//       try {
//         const res = await http.post(CONFIG.unmatchedBets, { sportId, eventId });
//         const data = res?.data?.data ?? res?.data ?? {};

//         const unmatched: Bet[] = data?.unmatchedBets || [];
//         const matchedRaw: Bet[] = data?.matchedBets || [];

//         setUnmatchedBets(unmatched);
//         setMatchedBets(groupMatchedByMarket(matchedRaw));

//         const hasData = unmatched.length > 0 || matchedRaw.length > 0;

//         // ✅ Desktop auto-refresh ONLY on market-details (old flow)
//         if (opts?.schedule && isMarketDetails && hasData) {
//           clearLoop();
//           loopRef.current = setTimeout(() => {
//             getUnMatchedBetList(sportId, eventId, { schedule: true });
//           }, 1000);
//         } else {
//           clearLoop();
//         }

//         return hasData;
//       } catch {
//         clearLoop();
//         return false;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [isMarketDetails],
//   );

//   // ✅ On market-details route change: auto load that specific market
//   useEffect(() => {
//     clearLoop();
//     setUnmatchedBets([]);
//     setMatchedBets([]);

//     if (!isLoggedIn) return;

//     if (isMarketDetails) {
//       // route market only
//       const val = `${routeSportId},${routeEventId}`;
//       setSelectedMarketValue(val);
//       getUnMatchedBetList(routeSportId, routeEventId, { schedule: true });
//     }

//     return () => clearLoop();
//   }, [isLoggedIn, isMarketDetails, routeEventId, routeSportId, getUnMatchedBetList]);

//   // ✅ Exposure list for dropdown (only when NOT market-details)
//   useEffect(() => {
//     if (!isLoggedIn) return;
//     if (isMarketDetails) return;

//     (async () => {
//       try {
//         const res = await http.post(CONFIG.getExposureListURL, {});
//         const list = res?.data?.data ?? res?.data ?? [];
//         setExposureList(Array.isArray(list) ? list : []);
//       } catch {
//         setExposureList([]);
//       }
//     })();
//   }, [isLoggedIn, isMarketDetails]);

//   // ✅ Refresh after cancel/place (MatchOdd emits this)
//   useEffect(() => {
//     const handler = () => {
//       const isRoute = isMarketDetails && routeSportId && routeEventId;
//       if (isRoute) {
//         getUnMatchedBetList(routeSportId, routeEventId, { schedule: true });
//         return;
//       }

//       // dropdown selected refresh (non-market page)
//       if (!selectedMarketValue) return;
//       const [sId, eId] = selectedMarketValue.split(",");
//       if (sId && eId) getUnMatchedBetList(sId, eId, { schedule: false });
//     };

//     const unsub = eventBus?.on?.("REFRESH_AFTER_PLACE", handler);
//     return () => {
//       if (typeof unsub === "function") unsub();
//     };
//   }, [isMarketDetails, routeSportId, routeEventId, selectedMarketValue, getUnMatchedBetList]);

//   const onMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedMarketValue(value);

//     if (!value) {
//       setUnmatchedBets([]);
//       setMatchedBets([]);
//       clearLoop();
//       return;
//     }

//     const [sportId, eventId] = value.split(",");
//     if (sportId && eventId) {
//       localStorage.setItem("sportId", sportId);
//       localStorage.setItem("eventId", eventId);
//       getUnMatchedBetList(sportId, eventId, { schedule: false }); // ✅ no desktop loop on non-market pages
//     }
//   };

//   const onCancelUnmatchedRefresh = () => {
//     if (isMarketDetails && routeSportId && routeEventId) {
//       getUnMatchedBetList(routeSportId, routeEventId, { schedule: true });
//       return;
//     }
//     if (!selectedMarketValue) return;
//     const [sportId, eventId] = selectedMarketValue.split(",");
//     getUnMatchedBetList(sportId, eventId, { schedule: false });
//   };

//   const hasAnyBets = (unmatchedBets?.length || 0) > 0 || (matchedBets?.length || 0) > 0;

//   return (
//     <div className="w-full">
//       {/* Dropdown only when not on market-details */}
//       {!isMarketDetails && (
//         <div className="px-4 py-3 border-b border-dashed border-(--dotted-line)">
//           <select
//             value={selectedMarketValue}
//             onChange={onMarketChange}
//             className="w-full h-9 rounded-[10px] px-3 text-[14px] font-semibold
//               border border-[rgba(145,158,171,0.2)]
//               bg-[color-mix(in_srgb,var(--palette-background-paper)_85%,transparent)]
//               text-[var(--palette-text-primary)]
//               focus:outline-none focus:border-[rgba(145,158,171,0.4)]"
//             disabled={!isLoggedIn}
//           >
//             <option value="">{isLoggedIn ? "Select Market" : "Login to view"}</option>
//             {exposureList.map((item: any, i: number) => {
//               const label = item?.event?.name ?? item?.eventName ?? "Unknown Market";
//               const sportId = item?.eventType?.id ?? item?.sportId ?? "";
//               const eventId = item?.event?.id ?? item?.eventId ?? "";
//               const value = `${sportId},${eventId}`;
//               return (
//                 <option key={eventId || i} value={value}>
//                   {label}
//                   {item?.betCounts ? ` (${item.betCounts})` : ""}
//                 </option>
//               );
//             })}
//           </select>
//         </div>
//       )}

//       <div className="w-full">
//         {!isLoggedIn ? (
//           <div className="py-6 text-center text-[var(--palette-text-secondary)] text-sm">
//             Please login to view Open Bets
//           </div>
//         ) : loading && !hasAnyBets ? (
//           <div className="py-6 text-center text-[var(--palette-text-secondary)] text-sm">
//             Loading...
//           </div>
//         ) : !hasAnyBets ? (
//           <div className="py-6 text-center text-[var(--palette-text-secondary)] text-sm">
//             No bets available
//           </div>
//         ) : (
//           <MatchOdd
//             unmatchedBets={unmatchedBets}
//             matchedBets={matchedBets}
//             onCancelUnmatchedRefresh={onCancelUnmatchedRefresh}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/common/betstable/desktop-open-bets.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useId, useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import http from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";
import MatchOdd from "@/components/common/my-bets/match-odd";
import { eventBus } from "@/lib/eventBus";
import { useAuthStore } from "@/lib/useAuthStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
type ExposureItem = {
  event?: { id: string; name: string };
  eventType?: { id: string; name: string };
  betCounts?: number;
  eventName?: string;
  [k: string]: any;
};

type Bet = {
  marketId?: string;
  marketName?: string;
  betId?: string;
  selectionName?: string;
  requestedPrice?: number;
  requestedSize?: number;
  matchedDate?: string | Date;
  placedDate?: string | Date;
  side?: "BACK" | "LAY" | string;
};

type MarketGroup = {
  marketId: string;
  marketName: string;
  BACK: Bet[];
  LAY: Bet[];
};

export default function DesktopOpenBetsRightNav() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();

  // /market-details/:eventId/:sportId
  const routeMatch = useMemo(
    () => pathname.match(/^\/market-details\/([^/]+)\/([^/]+)/),
    [pathname],
  );

  const isMarketDetails = !!routeMatch;
  const routeEventId = routeMatch?.[1] ?? null;
  const routeSportId = routeMatch?.[2] ?? null;

  const [exposureList, setExposureList] = useState<ExposureItem[]>([]);
  const [selectedMarketValue, setSelectedMarketValue] = useState<string>(""); // "sportId,eventId"

  const [unmatchedBets, setUnmatchedBets] = useState<Bet[]>([]);
  const [matchedBets, setMatchedBets] = useState<MarketGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const uniqueSelectId = useId();

  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLoop = () => {
    if (loopRef.current) {
      clearTimeout(loopRef.current);
      loopRef.current = null;
    }
  };

  const groupMatchedByMarket = (rawMatched: Bet[]): MarketGroup[] => {
    const grouped: Record<
      string,
      { marketName: string; BACK: Bet[]; LAY: Bet[] }
    > = {};
    (rawMatched || []).forEach((bet) => {
      if (!bet.marketId) return;
      if (!grouped[bet.marketId]) {
        grouped[bet.marketId] = {
          marketName: bet.marketName || "",
          BACK: [],
          LAY: [],
        };
      }
      const sideKey = (bet.side as "BACK" | "LAY") || "BACK";
      grouped[bet.marketId][sideKey].push(bet);
    });

    return Object.entries(grouped).map(([marketId, data]) => ({
      marketId,
      marketName: data.marketName,
      BACK: data.BACK,
      LAY: data.LAY,
    }));
  };

  const getUnMatchedBetList = useCallback(
    async (
      sportId?: string | null,
      eventId?: string | null,
      opts?: { schedule?: boolean },
    ) => {
      if (!sportId || !eventId) return false;
      if (!localStorage.getItem("token")) return false;

      setLoading(true);
      try {
        const res = await http.post(CONFIG.unmatchedBets, { sportId, eventId });
        const data = res?.data?.data ?? res?.data ?? {};

        const unmatched: Bet[] = data?.unmatchedBets || [];
        const matchedRaw: Bet[] = data?.matchedBets || [];

        setUnmatchedBets(unmatched);
        setMatchedBets(groupMatchedByMarket(matchedRaw));

        const hasData = unmatched.length > 0 || matchedRaw.length > 0;

        // ✅ Desktop auto-refresh only on market-details
        if (opts?.schedule && isMarketDetails && hasData) {
          clearLoop();
          loopRef.current = setTimeout(() => {
            getUnMatchedBetList(sportId, eventId, { schedule: true });
          }, 1000);
        } else {
          clearLoop();
        }

        return hasData;
      } catch {
        clearLoop();
        return false;
      } finally {
        setLoading(false);
      }
    },
    [isMarketDetails],
  );

  // ✅ On market-details: show ONLY that route market (old flow)
  useEffect(() => {
    clearLoop();
    setUnmatchedBets([]);
    setMatchedBets([]);

    if (!isLoggedIn) return;

    if (isMarketDetails) {
      const val = `${routeSportId},${routeEventId}`;
      setSelectedMarketValue(val);
      getUnMatchedBetList(routeSportId, routeEventId, { schedule: true });
    }

    return () => clearLoop();
  }, [
    isLoggedIn,
    isMarketDetails,
    routeEventId,
    routeSportId,
    getUnMatchedBetList,
  ]);

  // ✅ Dropdown exposure list only when NOT market-details
  useEffect(() => {
    if (!isLoggedIn) return;
    if (isMarketDetails) return;

    (async () => {
      try {
        const res = await http.post(CONFIG.getExposureListURL, {});
        const list = res?.data?.data ?? res?.data ?? [];
        setExposureList(Array.isArray(list) ? list : []);
      } catch {
        setExposureList([]);
      }
    })();
  }, [isLoggedIn, isMarketDetails]);

  // ✅ After cancel/place refresh
  useEffect(() => {
    const handler = () => {
      if (isMarketDetails && routeSportId && routeEventId) {
        getUnMatchedBetList(routeSportId, routeEventId, { schedule: true });
        return;
      }
      if (!selectedMarketValue) return;
      const [sId, eId] = selectedMarketValue.split(",");
      if (sId && eId) getUnMatchedBetList(sId, eId, { schedule: false });
    };

    const unsub = eventBus?.on?.("REFRESH_AFTER_PLACE", handler);
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [
    isMarketDetails,
    routeSportId,
    routeEventId,
    selectedMarketValue,
    getUnMatchedBetList,
  ]);

  const onMarketChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMarketValue(value);

    if (!value) {
      setUnmatchedBets([]);
      setMatchedBets([]);
      clearLoop();
      return;
    }

    const [sportId, eventId] = value.split(",");
    if (sportId && eventId) {
      localStorage.setItem("sportId", sportId);
      localStorage.setItem("eventId", eventId);
      getUnMatchedBetList(sportId, eventId, { schedule: false });
    }
  };

  const onCancelUnmatchedRefresh = () => {
    if (isMarketDetails && routeSportId && routeEventId) {
      getUnMatchedBetList(routeSportId, routeEventId, { schedule: true });
      return;
    }
    if (!selectedMarketValue) return;
    const [sportId, eventId] = selectedMarketValue.split(",");
    getUnMatchedBetList(sportId, eventId, { schedule: false });
  };

  const hasAnyBets =
    (unmatchedBets?.length || 0) > 0 || (matchedBets?.length || 0) > 0;

  return (
    <div className="w-full">
      {!isMarketDetails && (
        <div className="px-4 py-3 border-b border-dashed border-(--dotted-line)">
      <Select
      id={uniqueSelectId}
  value={selectedMarketValue === "" ? "__empty__" : selectedMarketValue}
  onValueChange={(value) => {
    const val = value === "__empty__" ? "" : value;
    setSelectedMarketValue(val);
    if (!val) {
      setUnmatchedBets([]);
      setMatchedBets([]);
      clearLoop();
      return;
    }
    const [sportId, eventId] = val.split(",");
    if (sportId && eventId) {
      localStorage.setItem("sportId", sportId);
      localStorage.setItem("eventId", eventId);
      getUnMatchedBetList(sportId, eventId, { schedule: false });
    }
  }}
  disabled={!isLoggedIn}
>
            <SelectTrigger
              className="w-full h-9 rounded-[10px] px-3 text-[14px]
      font-semibold border border-[rgba(145,158,171,0.2)]
      bg-[color-mix(in_srgb,var(--palette-background-paper)_85%,transparent)]
      text-[var(--palette-text-primary)] focus:ring-0"
            >
              <SelectValue
                placeholder={isLoggedIn ? "Select Market" : "Login to view"}
              />
            </SelectTrigger>

            <SelectContent
              position="popper"
              sideOffset={-35}
              className="w-[var(--radix-select-trigger-width)]
      bg-[var(--palette-background-paper)]
      text-[var(--palette-text-primary)]
      border border-[rgba(145,158,171,0.2)] "
            >
           <SelectItem value="__empty__"
  className="data-[state=checked]:bg-[var(--market-header-bg)] data-[state=checked]:text-[var(--table-header-text)]">
  Select Market
</SelectItem>

{exposureList.map((item: any, i: number) => {
  const label = item?.event?.name ?? item?.eventName ?? "Unknown Market";
  const sportId = item?.eventType?.id ?? item?.sportId ?? "";
  const eventId = item?.event?.id ?? item?.eventId ?? "";
  const value = `${sportId},${eventId}`;
  return (
    <SelectItem 
      key={eventId || i} 
      value={value}
      className="data-[state=checked]:bg-[var(--market-header-bg)] data-[state=checked]:text-[var(--table-header-text)]">
      {label}{item?.betCounts ? ` (${item.betCounts})` : ""}
    </SelectItem>
  );
})}
            </SelectContent>
          </Select>
        </div>
      )}

      {!isLoggedIn ? (
        <div className="py-6 text-center text-[var(--palette-text-secondary)] text-sm">
          Please login to view Open Bets
        </div>
      ) : loading && !hasAnyBets ? (
        <div className="py-6 text-center text-[var(--palette-text-secondary)] text-sm">
          Loading...
        </div>
      ) : !hasAnyBets ? (
        <div className="py-6 text-center text-[var(--palette-text-secondary)] text-sm">
          No bets available
        </div>
      ) : (
        <MatchOdd
          unmatchedBets={unmatchedBets}
          matchedBets={matchedBets}
          onCancelUnmatchedRefresh={onCancelUnmatchedRefresh}
        />
      )}
    </div>
  );
}
