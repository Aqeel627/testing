"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./style.module.css";

type RuleModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  text: string; // ✅ HTML string
};

export default function RuleModal({
  open,
  onOpenChange,

  text,
}: RuleModalProps) {
  const close = () => onOpenChange(false);
  const okBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ✅ Small cleanup: fix bad html and add rel for security
  const safeHtml = useMemo(() => {
    if (!text) return "";

    return text
      .replace(
        /<a([^>]*?)target=_blank/gi,
        '<a$1 target="_blank" rel="noopener noreferrer"',
      )
      .replace(/target=_blank/gi, 'target="_blank" rel="noopener noreferrer"');
  }, [text]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />

        <Dialog.Content className={styles.content}>
          <div className={styles.paper}>
            <Dialog.Title className={styles.title}>
              {/* MARKET INFORMATION */}
            </Dialog.Title>

            <div className={styles.body}>
              <div dangerouslySetInnerHTML={{ __html: safeHtml }} />
            </div>

            <div className={styles.footer}>
              <button onClick={close} className={styles.okBtn}>
                OK
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
