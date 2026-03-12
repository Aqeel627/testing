"use client";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useDisableTouchGestures } from "@/lib/hooks/use-disable-touch-gestures";
import { useAppStore } from "@/lib/store/store";
import { useAuthStore } from "@/lib/useAuthStore";
import React, { useCallback, useEffect, useRef } from "react";
import { DisableWheelZoom, DisableZoom } from "../disable-zoom";
import { indexManager } from "@/lib/index-manager";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";
import { useRouter } from "next/navigation";
import http from "@/lib/axios-instance";
import { eventBus } from "@/lib/eventBus";

const GlobalApisCall = () => {
  const {
    setCasinoEvents,
    setUserExposureList,
    userExposureList,
    setStakeValue,
  } = useAppStore();
  [];
  const {
    setBanners,
    setCasinoGames,
    setAllEventsList,
    setCompetitions,
    setEventTypes,
  } = useIndexManagerStore();
  const { checkLogin, isLoggedIn } = useAuthStore();
  const router = useRouter();

  useDisableTouchGestures();
  DisableWheelZoom();
  DisableZoom();

  const didFetchExposureRef = useRef(false);
  const inFlightRef = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");
  }, [checkLogin]);
  const refreshExposure = useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const res = await http.post(CONFIG.getExposureListURL, {});
      const list = res?.data?.data ?? res?.data ?? [];
      const data = Array.isArray(list) ? list : [];

      const totalExposure = data.reduce(
        (acc: number, item: any) => acc + Number(item?.betCounts || 0),
        0,
      );

      setUserExposureList({ data, totalExposure });
    } finally {
      inFlightRef.current = false;
    }
  }, [setUserExposureList]);

  useEffect(() => {
    if (!isLoggedIn) return;
    refreshExposure().catch(() => {});
  }, [isLoggedIn, refreshExposure]);

  // ✅ bet place/cancel ke baad auto refresh (home badge update)
  useEffect(() => {
    if (!isLoggedIn) return;

    const handler = () => refreshExposure().catch(() => {});
    const unsubscribe = eventBus.on("REFRESH_AFTER_PLACE", handler);

    return () => {
      unsubscribe();
    };
  }, [isLoggedIn, refreshExposure]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");

    fetchData({
      url: CONFIG.casinoEvents,
      payload: { key: CONFIG.siteKey },
      cachedKey: "casinoEvents",
      setFn: (data: any) => {
        setCasinoEvents(data);
      },
      expireIn: CONFIG.casinoEventsTime,
    });

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
          storeAs: "allEventsList",
          fromKey: "events",
          setFn: setAllEventsList,
          filterFn: (data: any) => {
            return data?.reduce((acc: any, item: any) => {
              const id = item?.eventType?.id;

              if (id) {
                if (!acc[id]) {
                  acc[id] = [];
                }
                acc[id].push(item);
              }

              return acc;
            }, {});
          },
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

            const priorityOrder = [4, 2, 1];

            return Array.from(uniqueMap.values()).sort((a: any, b: any) => {
              const aIndex = priorityOrder.indexOf(Number(a.id));
              const bIndex = priorityOrder.indexOf(Number(b.id));

              // ✅ Dono priority list me hain
              if (aIndex !== -1 && bIndex !== -1) {
                return aIndex - bIndex;
              }

              // ✅ Sirf A priority me hai
              if (aIndex !== -1) return -1;

              // ✅ Sirf B priority me hai
              if (bIndex !== -1) return 1;

              // ✅ Dono priority me nahi hain → normal order
              return 0;
            });
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
      ],
    });
  }, []);
const inFlightStakeRef = useRef(false);

const refreshStake = useCallback(async () => {
  if (inFlightStakeRef.current) return;
  inFlightStakeRef.current = true;
  try {
    fetchData({
      url: CONFIG.getUserBetStake,
      payload: { key: CONFIG.siteKey },
      cachedKey: "betStake",
      setFn: setStakeValue,
      expireIn: CONFIG.getUserBetStakeTime,
    });
  } finally {
    inFlightStakeRef.current = false;
  }
}, [setStakeValue]);

useEffect(() => {
  if (!isLoggedIn) return;
  refreshStake();
}, [isLoggedIn, refreshStake]);
  
  return null;
};

export default GlobalApisCall;
