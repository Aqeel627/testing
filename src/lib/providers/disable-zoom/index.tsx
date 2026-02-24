"use client";
import { useEffect } from "react";

export function DisableZoom() {
  useEffect(() => {
    const preventZoom = (e: any) => e.preventDefault();

    document.addEventListener("gesturestart", preventZoom);
    document.addEventListener("gesturechange", preventZoom);
    document.addEventListener("gestureend", preventZoom);

    return () => {
      document.removeEventListener("gesturestart", preventZoom);
      document.removeEventListener("gesturechange", preventZoom);
      document.removeEventListener("gestureend", preventZoom);
    };
  }, []);

  return null;
}

export function DisableWheelZoom() {
  useEffect(() => {
    const handler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handler, { passive: false });

    return () => {
      window.removeEventListener("wheel", handler);
    };
  }, []);

  return null;
}
