"use client";
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useDisableTouchGestures } from "@/lib/hooks/use-disable-touch-gestures";
import { useAppStore } from "@/lib/store/store";
import { useAuthStore } from "@/lib/useAuthStore";
import React, { useEffect } from "react";
import { DisableWheelZoom, DisableZoom } from "../disable-zoom";

const GlobalApisCall = () => {
  const {
    setCasinoEvents,
    setAllEventsList,
    setMenuList,
    setOurBanners,
    setOurCasinoGames,
    setOurEvents,
  } = useAppStore();
  const { checkLogin } = useAuthStore();
  const handleAllEvents = (data: any) => {
    setAllEventsList(data);
    console.log("Events Set", data);

    const formatted = useAppStore.getState().getFormattedInplayEvents?.();
    console.log("Formatted:", formatted);
  };

  useDisableTouchGestures();
  DisableWheelZoom();
  DisableZoom();

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkLogin(token || "");
    console.log("code live");

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
      url: CONFIG.events,
      payload: { key: CONFIG.siteKey },
      cachedKey: "events",
      setFn: (data: any) => {
        const { banners, casinoGames, events } = data ?? [];
        setOurBanners(banners);
        setOurCasinoGames(casinoGames);
        setOurEvents(events);
      },
      expireIn: CONFIG.eventsTime,
    });
  }, []);
  return null;
};

export default GlobalApisCall;
