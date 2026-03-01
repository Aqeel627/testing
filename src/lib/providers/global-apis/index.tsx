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

const GlobalApisCall = () => {
  const {
    setCasinoEvents,
    setMenuList,
    setAllEventsList,
    setStakeValue,
    // setOurBanners,
    // setOurCasinoGames,
    // setOurEvents,
  } = useAppStore();
  const {
    setBanners,
    setCasinoGames,
    // setAllEventsList,
    setCompetitions,
    setEventsByApi,
    setEventTypes,
  } = useIndexManagerStore();
  const { checkLogin } = useAuthStore();
  const handleAllEvents = (data: any) => {
    setAllEventsList(data);
  };

  useDisableTouchGestures();
  DisableWheelZoom();
  DisableZoom();

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");

    fetchData({
      url: CONFIG.getAllEventsList,
      payload: { key: CONFIG.siteKey },
      cachedKey: "allEventsList",
      setFn: handleAllEvents,
      expireIn: CONFIG.getAllEventsListTime,
    });

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
        // {
        //   storeAs: "allEventsList",
        //   fromKey: "events",
        //   setFn: setAllEventsList,
        //   filterFn: (data: any) => {
        //     return data?.reduce((acc: any, item: any) => {
        //       const id = item?.eventType?.id;

        //       if (id) {
        //         if (!acc[id]) {
        //           acc[id] = [];
        //         }
        //         acc[id].push(item);
        //       }

        //       return acc;
        //     }, {});
        //   },
        // },
      ],
    });
  }, []);
  return null;
};

export default GlobalApisCall;
