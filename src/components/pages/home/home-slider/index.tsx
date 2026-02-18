"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./home-slider.module.css";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/home-slider/slider-1.jpeg", href: "#" },
  { src: "/home-slider/slider-2.jpeg", href: "#" },
  { src: "/home-slider/slider-3.jpeg", href: "#" },
  { src: "/home-slider/slider-4.jpeg", href: "#" },
];

export default function HomeSlider() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const state = useRef({ down: false, x: 0, left: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;
    state.current.down = true;
    state.current.x = e.clientX;
    state.current.left = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !state.current.down) return;
    e.preventDefault();
    const dx = e.clientX - state.current.x;
    el.scrollLeft = state.current.left - dx;
  };

  const stop = () => (state.current.down = false);

  return (
    <div className="w-full">
      <div className="relative mt-3">
        <div
          ref={trackRef}
          className={cn(
            styles.track,
            "cursor-grab active:cursor-grabbing select-none"
          )}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stop}
          onPointerCancel={stop}
          onPointerLeave={stop}
        >
          {slides.map((s, i) => (
            <div key={i} className={styles.slide}>
              <Link
                href={s.href}
                draggable={false}
                className={cn(
                  "block w-full overflow-hidden rounded-[12px] bg-[#213743]",
"aspect-[5/5]"
                )}
              >
                <div className="relative h-full w-full">
                  <Image
                    src={s.src}
                    alt={`slide-${i + 1}`}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 767px) 33vw, 25vw"
                    className="object-cover select-none"
                    draggable={false}
                  />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* right fade */}
        <div
          className="pointer-events-none absolute top-0 right-0 h-full w-10 md:w-14"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(26,44,56,1) 85%)",
          }}
        />
      </div>
    </div>
  );
}