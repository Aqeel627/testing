"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./SearchModal.module.css";
import { useUIStore } from "@/lib/store/ui-store";
import { useAppStore } from "@/lib/store/store";
import Icon from "@/icons/icons";



export default function SearchModal() {
    const isOpenSearch = useUIStore((s) => s.isOpenSearch);
    const toggleSearch = useUIStore((s) => s.toggleSearch);
    const { allEventsList, selectedEventTypeId } = useAppStore();

    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");

    const close = () => toggleSearch(false);
    useEffect(() => {
        // console.log(allEventsList, "events all in search modal");
        // console.log("type:", typeof allEventsList);
    }, [allEventsList]);


    /* -------------------- BODY SCROLL + FOCUS -------------------- */
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                toggleSearch(!isOpenSearch);   // 👈 better pattern
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
            .filter(Array.isArray)   // only arrays
            .flat();

        if (!query.trim()) return eventsArray;

        const q = query.toLowerCase();

        return eventsArray.filter((item) =>
            item?.event?.name?.toLowerCase().includes(q) ||
            item?.eventType?.name?.toLowerCase().includes(q) ||
            item?.marketType?.toLowerCase().includes(q)
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

                            <button
                                type="button"
                                className={styles.esc}
                                onClick={close}
                            >
                                Esc
                            </button>
                        </div>

                        <div className={styles.divider} />

                        {/* ---------- LIST ---------- */}
                        {/* ---------- LIST ---------- */}
                        <div className={styles.list}>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((match: any, index: number) => (
                                    <div key={index} className={styles.item} onClick={close} tabIndex={0}>
                                        <div className={styles.textWrap}>
                                            <p className={styles.title}>{match?.eventType?.name} | {match?.marketType}</p>
                                            <p className={styles.sub}>{match?.event?.name}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={styles.notFound}>
                                    <h3 className={styles.notFoundTitle}>Not found</h3>
                                    <p className={styles.notFoundText}>
                                        No results found for <span >"{query}"</span>.<br />
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
