// "use client";

// import React, { useCallback, useEffect, useMemo, useRef } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { useMyBetsDrawerStore } from "@/lib/store/myBetsDrawerStore";
// import BreadCrumb from "@/components/common/bread-crumb";
// import MyBets from "@/components/common/my-bets/my-bets";
// import styles from "./drawer.module.css";

// export default function MyBetsDrawer() {
//   const isOpen = useMyBetsDrawerStore((s) => s.isOpen);
//   const setOpen = useMyBetsDrawerStore((s) => s.setOpen);
//   const close = useMyBetsDrawerStore((s) => s.close);

//   const mode = useMyBetsDrawerStore((s) => s.mode);
//   const eventId = useMyBetsDrawerStore((s) => s.eventId);
//   const sportId = useMyBetsDrawerStore((s) => s.sportId);

//   const title = mode === "OPEN_BETS" ? "Open Bets" : "My Bets";

//   // ✅ prevent openChange loops
//   const handleOpenChange = useCallback(
//     (v: boolean) => {
//       if (v === isOpen) return;
//       setOpen(v);
//     },
//     [isOpen, setOpen],
//   );

//   // scroll lock
//   useEffect(() => {
//     if (!isOpen) return;
//     const prev = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = prev;
//     };
//   }, [isOpen]);

//   return (
//     <Dialog.Root modal={false} open={isOpen} onOpenChange={handleOpenChange}>
//       <Dialog.Portal>
//         <Dialog.Overlay   onClick={() => setOpen(false)} forceMount className={styles.overlay} />

// <Dialog.Content className={styles.content} onOpenAutoFocus={(e) => e.preventDefault()}>
//   <VisuallyHidden asChild>
//     <Dialog.Title>{title}</Dialog.Title>
//   </VisuallyHidden>

//   {/* ✅ FIXED close button (top-right, above everything) */}
//   {/* <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
//     <span className={styles.closeX}>×</span>
//   </button>

//   <div className={styles.topBar}>
//     <div className="my-4">
//       <BreadCrumb title={title} />
//     </div>
//   </div> */}
//   <div className={styles.topBar}>
//   <div className="my-4">
//     <BreadCrumb title={title} />
//   </div>

//   {/* ✅ close button now belongs to header area, no overlap */}
//   <button
//     type="button"
//     className={styles.closeBtn}
//     onClick={close}
//     aria-label="Close"
//   >
//     <span className={styles.closeX}>×</span>
//   </button>
// </div>

//   <div className={styles.body}>
//     <MyBets eventId={mode === "OPEN_BETS" ? eventId : null} sportId={mode === "OPEN_BETS" ? sportId : null} onRequestClose={close} />
//   </div>
// </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useMyBetsDrawerStore } from "@/lib/store/myBetsDrawerStore";
import BreadCrumb from "@/components/common/bread-crumb";
import MyBets from "@/components/common/my-bets/my-bets";

const BOTTOM_NAV_HEIGHT = 80; // MUST match navbar height

export default function MyBetsDrawer() {
  const pathname = usePathname();
  const { isOpen, close } = useMyBetsDrawerStore();

  const mode = useMyBetsDrawerStore((s) => s.mode);
  const storedEventId = useMyBetsDrawerStore((s) => s.eventId);
  const storedSportId = useMyBetsDrawerStore((s) => s.sportId);

  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const safari =
      ua.includes("Safari") && !ua.includes("Chrome") && !ua.includes("Chromium");
    setIsSafari(safari);
  }, []);

  // same rule as your flow
  const title = mode === "OPEN_BETS" ? "Open Bets" : "My Bets";

  // ✅ exact ids: only OPEN_BETS uses stored ids, MY_BETS uses null
  const eventId = mode === "OPEN_BETS" ? storedEventId : null;
  const sportId = mode === "OPEN_BETS" ? storedSportId : null;

  // ✅ iPhone bottom fix like your MiniCasinoDrawer
  const bottomGap = isSafari ? BOTTOM_NAV_HEIGHT - 12 : BOTTOM_NAV_HEIGHT;

  return (
    <div id="my-bets-drawer.tsx">
      {/* Overlay (does NOT cover bottom nav area) */}
      <div
        onClick={close}
        className={cn(
          "fixed left-0 right-0 top-0 bg-black/40 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        style={{
          bottom: `${bottomGap}px`,
          zIndex: 9998,
        }}
      />

      {/* Bottom Sheet (full height above bottom nav) */}
      <div
        className={cn(
          "fixed left-0 w-full z-[9999]",
          "transform transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          isOpen ? "translate-y-0 drawer" : "",
        )}
        style={{
          bottom: `${bottomGap}px`,
          height: `calc(100dvh - ${bottomGap}px)`,
          transform: isOpen
            ? "translateY(0)"
            : `translateY(calc(100% + ${bottomGap}px))`, // ✅ PERFECT close like casino drawer
          // your glass bg
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          background: "linear-gradient(145deg, #ffffff14, #ffffff05)",
          boxShadow:
            "0 8px 32px #00000059, inset 0 0 #ffffff40, inset 0 -2px 6px #ffffff0d",
        }}
      >
        {/* Header exactly like page (breadcrumb), with close on top-right */}
        <div className="relative px-3">
          <div className="my-4 pr-12">
            <BreadCrumb title={title} />
          </div>

          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-4 h-8 w-8 rounded-[10px] border flex items-center justify-center"
            style={{
              borderColor: "color-mix(in srgb, var(--primary-color) 90%, transparent)",
              background: "color-mix(in srgb, var(--accordion-bg) 18%, transparent)",
              boxShadow: "var(--customShadows-dropdown)",
              color: "var(--palette-text-primary)",
            }}
            aria-label="Close"
          >
            <span style={{ fontSize: 22, lineHeight: 1, transform: "translateY(-1px)" }}>
              ×
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="h-[calc(100%-64px)] overflow-y-auto px-3 pb-4">
          {/* ✅ Your existing flow unchanged */}
          <MyBets eventId={eventId} sportId={sportId} />
        </div>
      </div>
    </div>
  );
}