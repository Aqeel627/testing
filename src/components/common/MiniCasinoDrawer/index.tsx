"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useMiniCasinoStore } from "@/lib/store/miniCasinoStore";
import { CONFIG } from "@/lib/config";

export default function MiniCasinoDrawer() {
  const { isOpen, close } = useMiniCasinoStore();

  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0); // 🔥 force reload

  // 🔹 Build URL ONLY when opening
  useEffect(() => {
    if (isOpen) {
      const token = localStorage.getItem("token");
      if (!token) return;

      setIframeUrl(`${CONFIG.miniCasinoIframeUrl}/auth/${token}`);
      setIframeKey((prev) => prev + 1); 
    } else {
      // 🔥 destroy iframe when closed
      setIframeUrl(null);
    }
  }, [isOpen]);

  // 🔹 Listen to iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== CONFIG.miniCasinoIframeUrl) return;
      if (!event.data) return;

      if (event.data === "IframeClosed") {
        close();
      }

      if (event.data === "unautherized") {
        const token = localStorage.getItem("token");
        if (!token) {
          close();
          window.location.href = "/login";
        }
      }

      if (event.data === "getBalance") {
        console.log("Call balance API here");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [close]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={close}
        className={cn(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Bottom Sheet */}
      <div
        className={cn(
          "fixed bottom-0 left-0 w-full h-[220px] z-50",
          "bg-neutral-900 border-t border-neutral-700",
          "transform transition-transform duration-500 ease-in-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* ✅ iframe only exists while open */}
        {isOpen && iframeUrl && (
          <iframe
            key={iframeKey}  
            src={iframeUrl}
            className="w-full h-full"
          />
        )}
      </div>
    </>
  );
}