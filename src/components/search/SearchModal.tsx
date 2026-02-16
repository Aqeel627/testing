"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./SearchModal.module.css";
import { useAppStore } from "@/lib/store/ui-store";

type SearchItem = {
    id: string;
    title: string;
    path: string;
};

export default function SearchModal() {
    const isOpenSearch = useAppStore((s) => s.isOpenSearch);
    const toggleSearch = useAppStore((s) => s.toggleSearch);

    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");

    const close = () => toggleSearch(false);

    useEffect(() => {
        if (isOpenSearch) {
            setTimeout(() => inputRef.current?.focus(), 0);
            document.documentElement.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
            setQuery("");
        }
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [isOpenSearch]);

    const data: SearchItem[] = useMemo(
        () => [
            {
                id: "1",
                title: "ICC Men's T20 World Cup",
                path: "/cricket/icc-men's-t20-world-cup/icc-mens-t20-world-cup",
            },
            { id: "2", title: "AFC Champions League", path: "/soccer/afc-champions-league" },
            { id: "3", title: "Al Ahli v Al Ahli (UAE)", path: "/soccer/afc-champions-league/al-ahli-v-al-ahli-uae" },
            { id: "4", title: "Al-Hilal v Al Wahda (Abu Dhabi)", path: "/soccer/afc-champions-league/al-hilal-v-al-wahda-abu-dhabi" },
            { id: "5", title: "Alan Rubio v Tomic", path: "/tennis/metepec-challenger-2026/alan-rubio-v-tomic" },
            { id: "6", title: "Albion FC v Cerro", path: "/soccer/uruguayan-primera-division/albion-fc-v-cerro" },
        ],
        []
    );

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return data;
        return data.filter(
            (x) =>
                x.title.toLowerCase().includes(q) ||
                x.path.toLowerCase().includes(q)
        );
    }, [data, query]);

    return (
        <Dialog.Root open={isOpenSearch} onOpenChange={toggleSearch}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />

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
                        <div className={styles.header}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                viewBox="0 0 24 24"
                                className={styles.searchIcon}
                            >
                                <path
                                    fill="currentColor"
                                    d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42ZM5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6Z"
                                />
                            </svg>

                            <input
                                ref={inputRef}
                                className={styles.input}
                                placeholder="Search..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            <button type="button" className={styles.esc} onClick={close}>
                                Esc
                            </button>
                        </div>

                        <div className={styles.divider} />

                        <div className={styles.list}>
                            {filtered.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.item}
                                    tabIndex={0}
                                    onClick={() => close()}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") close();
                                    }}
                                >
                                    <div className={styles.textWrap}>
                                        <p className={styles.title}>{item.title}</p>
                                        <p className={styles.sub}>{item.path}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}