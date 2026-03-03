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
import { useRouter } from "next/navigation";

const GlobalApisCall = () => {
  const { setCasinoEvents, setUserExposureList } = useAppStore();
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");
    if (isLoggedIn) {
      fetchData({
        url: CONFIG.getExposureListURL,
        payload: {},
        setFn: (data) => {
          const totalExposure = data?.reduce((acc: number, item: any) => {
            return acc + (item?.betCounts || 0);
          }, 0);
          setUserExposureList({ data, totalExposure });
        },
      });
    }

    fetchData({
      url: CONFIG.getTopCasinoGame,
      payload: { key: CONFIG.siteKey },
      cachedKey: "casinoEvents",
      setFn: setCasinoEvents,
      expireIn: CONFIG.getTopCasinoGameTime,
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
  return null;
};

export default GlobalApisCall;
