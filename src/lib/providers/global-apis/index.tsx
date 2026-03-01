"use client";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useDisableTouchGestures } from "@/lib/hooks/use-disable-touch-gestures";
import { useAppStore } from "@/lib/store/store";
import { useAuthStore } from "@/lib/useAuthStore";
import React, { useEffect } from "react";
import { DisableWheelZoom, DisableZoom } from "../disable-zoom";
import { indexManager } from "@/lib/index-manager";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";
import { webSocketService } from "@/lib/websocket.service";

const GlobalApisCall = () => {
  const {
    setCasinoEvents,
    setMenuList,
    // setAllEventsList,
    setStakeValue,
    // setOurBanners,
    // setOurCasinoGames,
    // setOurEvents,
  } = useAppStore();
  const {
    setBanners,
    setCasinoGames,
    setEventsBySocket,
    setCompetitions,
    setEventsByApi,
    setEventTypes,
  } = useIndexManagerStore();
  const { checkLogin } = useAuthStore();
  // const handleAllEvents = (data: any) => {
  //   setAllEventsList(data);
  // };
  const socketDataRef = React.useRef<any[]>([]);
  const socketStartedRef = React.useRef<boolean>(false);
  useDisableTouchGestures();
  DisableWheelZoom();
  DisableZoom();

  const startSocketFlow = (marketIds: string[]): Promise<any[]> => {
    console.log("🚀 Starting socket for:", marketIds);

    return new Promise((resolve, reject) => {
      const received = new Set<string>();
      const combined: any[] = [];

      webSocketService.subscribeMarket(marketIds, "global-socket");

      webSocketService.onEvent("odds", (raw: any) => {
        try {
          let payload = raw;

          if (typeof raw === "string") {
            payload = JSON.parse(raw);
          }

          const marketId = payload?.marketId;
          if (!marketId) return;

          if (!received.has(String(marketId))) {
            received.add(String(marketId));
            combined.push(payload);
          }

          console.log("📦 Received:", marketId);

          // ✅ When ALL market data received
          if (received.size === marketIds.length) {
            console.log("✅ ALL MARKET DATA RECEIVED ✅");
            console.log("🔥 FINAL SOCKET DATA:", combined);

            socketDataRef.current = combined;

            webSocketService.unsubscribeMarket(marketIds);
            console.log("🛑 Socket closed.");

            // ⭐ RETURN DATA HERE
            resolve(combined);
          }
        } catch (err) {
          console.log("❌ Parse error:", err);
          reject(err);
        }
      });
    });
  };

const mergeSocketWithApi = (apiData: any[], socketData: any[]) => {
  if (!socketData || socketData.length === 0) return apiData;

  return apiData.map((apiItem: any) => {
    const socketUpdate = socketData.find(
      (sItem: any) => sItem.marketId === apiItem.marketId
    );

    if (!socketUpdate) return apiItem;

    // ✅ Extract runners from socket payload
    const exMap = socketUpdate.ex || {};
    const ptMap = socketUpdate.pt || {};

    const runners = Object.keys(exMap).map((selectionId) => {
      const exEntry = exMap[selectionId];

      return {
        selectionId: Number(selectionId),
        status: exEntry.status || "ACTIVE",
        lastPriceTraded: exEntry.lastPriceTraded || 0,
        totalMatched: exEntry.totalMatched || 0,
        ex: {
          availableToBack: exEntry.availableToBack || [],
          availableToLay: exEntry.availableToLay || [],
        },
      };
    });

    return {
      ...apiItem,
      status: socketUpdate.status || apiItem.status,
      totalMatched: socketUpdate.totalMatched || apiItem.totalMatched,
      runners, // ✅ FULL runners array injected here
    };
  });
};

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");

    // fetchData({
    //   url: CONFIG.getAllEventsList,
    //   payload: { key: CONFIG.siteKey },
    //   cachedKey: "allEventsList",
    //   setFn: handleAllEvents,
    //   expireIn: CONFIG.getAllEventsListTime,
    // });

    fetchData({
      url: CONFIG.getTopCasinoGame,
      payload: { key: CONFIG.siteKey },
      cachedKey: "casinoEvents",
      setFn: setCasinoEvents,
      expireIn: CONFIG.getTopCasinoGameTime,
    });

    fetchData({
      url: CONFIG.menuList,
      payload: { key: CONFIG.siteKey },
      cachedKey: "menuList",
      setFn: setMenuList,
      expireIn: CONFIG.menuListTime,
    });
    fetchData({
      url: CONFIG.getUserBetStake,
      payload: { key: CONFIG.siteKey },
      cachedKey: "betStake",
      setFn: setStakeValue,
      expireIn: CONFIG.getUserBetStakeTime,
    });
    // fetchData({
    //   url: CONFIG.events,
    //   payload: { key: CONFIG.siteKey },
    //   cachedKey: "events",
    //   setFn: (data: any) => {
    //     const { banners, casinoGames, events } = data ?? [];
    //     setOurBanners(banners);
    //     setOurCasinoGames(casinoGames);
    //     setOurEvents(events);
    //   },
    //   expireIn: CONFIG.eventsTime,
    // });

    indexManager({
      url: CONFIG.events,
      payload: { key: CONFIG.siteKey },
      expireIn: CONFIG.eventsTime,
      storeMap: [
        {
          storeAs: "banners",
          fromKey: "banners",
          setFn: setBanners,
        },
        {
          storeAs: "casinoGames",
          fromKey: "casinoGames",
          setFn: setCasinoGames,
        },
        {
          storeAs: "eventsByApi",
          fromKey: "events",
          setFn: setEventsByApi,
        },
        {
          storeAs: "eventTypes",
          fromKey: "events",
          setFn: setEventTypes,
          filterFn: (data: any) => {
            const uniqueMap = new Map();

            data?.forEach((item: any) => {
              const eventType = item?.eventType;
              if (eventType && eventType.id && !uniqueMap.has(eventType.id)) {
                uniqueMap.set(eventType.id, {
                  id: eventType.id,
                  name: eventType.name,
                  counts: 8,
                });
              }
            });
            return Array.from(uniqueMap.values());
          },
        },
        {
          storeAs: "competitions",
          fromKey: "events",
          setFn: setCompetitions,
          filterFn: (data: any) => {
            return data?.map((item: any) => {
              return {
                competition: item.competition,
                eventType: item.eventType,
                event: item.event,
              };
            });
          },
        },
        {
          storeAs: "eventsBySocket",
          fromKey: "events",
          setFn: setEventsBySocket,
          filterFn: async (data: any) => {
            if (!data || data.length === 0) return {};

            // ✅ Extract all marketIds
            const marketIds = data
              .map((item: any) => item.marketId)
              .filter(Boolean)
              .map(String);

            console.log("✅ Extracted MarketIds:", marketIds);

            let socketData: any[] = [];
            // ✅ Start socket only once
            if (!socketStartedRef.current && marketIds.length) {
              socketStartedRef.current = true;
              socketData = await startSocketFlow(marketIds);
              console.log(data, "data data data");
            }

            // ✅ Use socketData instead of original data
            // const sourceData =
            //   socketDataRef.current.length > 0
            //     ? socketDataRef.current
            //     : data;

            const finalData=mergeSocketWithApi(data, socketData);

            console.log(finalData, "finalData");

            return finalData.reduce((acc: any, item: any) => {
              const id = item?.eventType?.id;

              if (id) {
                if (!acc[id]) acc[id] = [];
                acc[id].push(item);
              }

              return acc;
            }, {});
          },
        },
      ],
    });
  }, []);
  return null;
};

export default GlobalApisCall;
