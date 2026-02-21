'use client'
import { CONFIG } from "@/lib/config";
import { fetchData } from "@/lib/functions";
import { useAppStore } from "@/lib/store/store";
import { useAuthStore } from "@/lib/useAuthStore";
import React, { useEffect } from "react";

const GlobalApisCall = () => {
  const {
    setCasinoEvents,
    setAllEventsList,
    setMenuList,
  } = useAppStore();
  const { checkLogin } = useAuthStore();
  const handleAllEvents = (data: any) => {
    setAllEventsList(data);
    console.log("Events Set", data);

    const formatted = useAppStore.getState().getFormattedInplayEvents?.();
    console.log("Formatted:", formatted);
  };
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
  }, []);
  return null;
};

export default GlobalApisCall;
