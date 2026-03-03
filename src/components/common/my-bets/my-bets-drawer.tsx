"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMyBetsDrawerStore } from "@/lib/store/myBetsDrawerStore";
import BreadCrumb from "@/components/common/bread-crumb";
import MyBets from "@/components/common/my-bets/my-bets";
import styles from "./drawer.module.css";

export default function MyBetsDrawer() {
  const isOpen = useMyBetsDrawerStore((s) => s.isOpen);
  const setOpen = useMyBetsDrawerStore((s) => s.setOpen);
  const close = useMyBetsDrawerStore((s) => s.close);

  const mode = useMyBetsDrawerStore((s) => s.mode);
  const eventId = useMyBetsDrawerStore((s) => s.eventId);
  const sportId = useMyBetsDrawerStore((s) => s.sportId);

  const title = mode === "OPEN_BETS" ? "Open Bets" : "My Bets";

  // ✅ prevent openChange loops
  const handleOpenChange = useCallback(
    (v: boolean) => {
      if (v === isOpen) return;
      setOpen(v);
    },
    [isOpen, setOpen],
  );

  // scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

<Dialog.Content className={styles.content} onOpenAutoFocus={(e) => e.preventDefault()}>
  <VisuallyHidden asChild>
    <Dialog.Title>{title}</Dialog.Title>
  </VisuallyHidden>

  {/* ✅ FIXED close button (top-right, above everything) */}
  {/* <button type="button" className={styles.closeBtn} onClick={close} aria-label="Close">
    <span className={styles.closeX}>×</span>
  </button>

  <div className={styles.topBar}>
    <div className="my-4">
      <BreadCrumb title={title} />
    </div>
  </div> */}
  <div className={styles.topBar}>
  <div className="my-4">
    <BreadCrumb title={title} />
  </div>

  {/* ✅ close button now belongs to header area, no overlap */}
  <button
    type="button"
    className={styles.closeBtn}
    onClick={close}
    aria-label="Close"
  >
    <span className={styles.closeX}>×</span>
  </button>
</div>

  <div className={styles.body}>
    <MyBets eventId={mode === "OPEN_BETS" ? eventId : null} sportId={mode === "OPEN_BETS" ? sportId : null} onRequestClose={close} />
  </div>
</Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}