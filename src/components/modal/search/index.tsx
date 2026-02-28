"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./style.module.css";
import { useUIStore } from "@/lib/store/ui-store";
import { useAppStore } from "@/lib/store/store";
import Link from "next/link";
import dynamic from "next/dynamic";
import Icon from "@/icons/icons";


function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} style={{ color: "var(--primary-color)", fontWeight: 700 }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

export default function SearchModal() {
  const isOpenSearch = useUIStore((s) => s.isOpenSearch);
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const { allEventsList, selectedEventTypeId } = useAppStore();

  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const closeMobileSidebar = useUIStore((s) => s.closeSidebar);

  const close = () => {
    toggleSearch(false);
    closeMobileSidebar();
  };
  useEffect(() => {
    // console.log(allEventsList, "events all in search modal");
    // console.log("type:", typeof allEventsList);
  }, [allEventsList]);

  /* -------------------- BODY SCROLL + FOCUS -------------------- */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggleSearch(!isOpenSearch); // 👈 better pattern
      }
    };



    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSearch]);
  //
  useEffect(() => {
    if (isOpenSearch) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpenSearch]);

  /* -------------------- DATA -------------------- */

  const filteredResults = useMemo(() => {
    // Merge all arrays into a single array safely
    const eventsArray: any[] = Object.values(allEventsList || {})
      .filter(Array.isArray) // only arrays
      .flat();

    if (!query.trim()) return eventsArray;

    const q = query.toLowerCase();

    return eventsArray.filter(
      (item) =>
        item?.event?.name?.toLowerCase().includes(q) ||
        item?.eventType?.name?.toLowerCase().includes(q) ||
        item?.marketType?.toLowerCase().includes(q),
    );
  }, [query, allEventsList]);

  return (
    <Dialog.Root open={isOpenSearch} onOpenChange={toggleSearch}>
      <Dialog.Portal>
        {/* ---------- OVERLAY ---------- */}
        <Dialog.Overlay className={styles.overlay} />

        {/* ---------- CONTENT ---------- */}
        <Dialog.Content
          className={styles.content}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <Dialog.Title> </Dialog.Title>
          <div className={styles.paper}>
            {/* ---------- HEADER ---------- */}
            <div className={styles.header}>
              <Icon name="searchIcon" className={styles.searchIcon} />

              <input
                ref={inputRef}
                className={styles.input}
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <button type="button" className={styles.esc} onClick={()=>toggleSearch(false)}>
                Esc
              </button>
            </div>

            <div className={styles.divider} />

            {/* ---------- LIST ---------- */}
            {/* ---------- LIST ---------- */}
            <div className={styles.list}>
              {filteredResults.length > 0 ? (
                filteredResults.map((match: any, index: number) => (
                  <Link
                    key={index}
                    className={styles.item}
                    onClick={close}
                    tabIndex={0}
                    href={`/market-details/${match.event?.id}/${match.eventType?.id}`}
                  >
                    <div className={styles.textWrap}>
                     <p className={styles.title}>
      {highlight(`${match?.eventType?.name} | ${match?.marketType}`, query)}
    </p>
    <p className={styles.sub}>
      {highlight(match?.event?.name || "", query)}
    </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className={styles.notFound}>
                  <h3 className={styles.notFoundTitle}>Not found</h3>
                  <p className={styles.notFoundText}>
                    No results found for <span>"{query}"</span>.<br />
                    Try checking for typos or using complete words.
                  </p>
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
