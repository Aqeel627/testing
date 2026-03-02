"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useAppStore } from "@/lib/store/store";
import { useEffect, useState } from "react";
import { useIndexManagerStore } from "@/lib/store/indexManagerStore";

interface SlideItem {
  src: string;
  href: string;
}

interface PairedSlide {
  top: SlideItem;
  bottom: SlideItem;
}

const FALLBACK_BANNERS = [
  {
    image:
      "/home-slider/slider-1.jpeg",
    link: "#",
  },
  {
    image:
      "/home-slider/slider-2.jpeg",
    link: "#",
  },
  {
    image:
      "/home-slider/slider-3.jpeg",
    link: "#",
  },
  {
    image:
      "/home-slider/slider-4.jpeg",
    link: "#",
  },
  {
    image:
    "/home-slider/slider-5.jpeg",
    link: "#",
  },
];
const STATIC_PLACEHOLDER =
  "/home-slider/slider-6.jpeg";

// tilt (same direction)
const TILT_CLASS = "transform-gpu rotate-[2deg] origin-center";

// Your card size (same as you already have)
const DESKTOP_CARD_SIZE =
  "w-[clamp(140px,10vw,164px)] h-[clamp(140px,10vw,164px)]";

/**
 * ✅ IMPORTANT:
 * These breakpoints are now based on the SWIPER CONTAINER width (your center column),
 * not the full window width.
 */
const CENTER_BREAKPOINTS: Record<
  number,
  { slidesPerView: number; spaceBetween: number }
> = {
  // 0: { slidesPerView: 2.2, spaceBetween: 6 },

  // ✅ the values you said you want (400–740)
  400: { slidesPerView: 2.8, spaceBetween: 6 },
  500: { slidesPerView: 3.2, spaceBetween: 6 },
  550: { slidesPerView: 3.5, spaceBetween: 6 },
  600: { slidesPerView: 3.6, spaceBetween: 6 },
  660: { slidesPerView: 4.2, spaceBetween: 6 },
  740: { slidesPerView: 4.6, spaceBetween: 6 },

  // your higher widths (tune as you like)
  820: { slidesPerView: 5.0, spaceBetween: 6 },
  860: { slidesPerView: 5.5, spaceBetween: 4 },
  900: { slidesPerView: 5.8, spaceBetween: 4 },
  1000: { slidesPerView: 6.0, spaceBetween: 10 },
  1100: { slidesPerView: 6.5, spaceBetween: 12 },
  1200: { slidesPerView: 7.0, spaceBetween: 12 },
  1350: { slidesPerView: 7.5, spaceBetween: 12 },
};

export default function HomeSlider() {
  // const { ourBanners } = useAppStore();
  const { banners } = useIndexManagerStore();
  const [finalSlides, setFinalSlides] = useState<any[]>([]);

  useEffect(() => {
    async function verifyAndPrepare() {
      const baseData =
        banners && banners.length > 0 ? banners : FALLBACK_BANNERS;

      const verifiedData = await Promise.all(
        baseData.map(async (item: any) => {
          const fullPath = item.image.startsWith("http")
            ? item.image
            : "/" + item.image;
          try {
            const res = await fetch(fullPath, { method: "HEAD" });
            if (res.ok) return { ...item, verifiedImage: fullPath };
          } catch (e) {}
          return { ...item, verifiedImage: STATIC_PLACEHOLDER };
        }),
      );

      let displayData = [...verifiedData];
      while (displayData.length > 0 && displayData.length < 24) {
        displayData = [...displayData, ...verifiedData];
      }
      setFinalSlides(displayData);
    }

    verifyAndPrepare();
  }, [banners]);

  const pairedSlides: any[] = [];
  if (finalSlides.length > 0) {
    for (let i = 0; i < finalSlides.length; i += 2) {
      pairedSlides.push({
        top: finalSlides[i],
        bottom: finalSlides[i + 1] || finalSlides[0],
      });
    }
  }

  if (finalSlides.length === 0) {
    return <div className="h-[164px] w-full bg-transparent" />;
  }

  return (
    <div id="home-slider.tsx">
      <div className="w-full">
        {/* match your layout rule: desktop starts at 1200 */}
        <div className="relative mt-3 min-[1200px]:mt-0 min-[1200px]:py-1">
          {/* Mobile/Tablet (below 1200): single images */}
          <div className="min-[1200px]:hidden">
            <Swiper
              modules={[Autoplay]}
              loop
              spaceBetween={12}
              speed={1200}
              grabCursor
              slidesPerView={3}
              slidesPerGroup={1}
              autoplay={{
                delay: 1800,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              className={cn("select-none cursor-grab active:cursor-grabbing")}
            >
              {finalSlides?.map((s: any, i: any) => (
                <SwiperSlide key={i} className="h-auto">
                  <div className="flex flex-col gap-3 items-center">
                    <a
                      href={s?.link}
                      draggable={false}
                      className="block w-full overflow-hidden rounded-[12px] bg-[#213743] aspect-[5/5]"
                    >
                      <div className="relative h-full w-full">
                        <Image
                        loading="lazy"
                          src={s.verifiedImage}
                          alt={`slide-${i}`}
                          fill
                          className="object-cover"
                          draggable={false}
                          unoptimized
                          onError={(e: any) => {
                            e.currentTarget.src = STATIC_PLACEHOLDER;
                          }}
                        />
                      </div>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop (>=1200): paired images */}
          <div className="hidden min-[1200px]:block">
            <Swiper
              modules={[Autoplay]}
              loop
              speed={1200}
              grabCursor
              slidesPerGroup={1}
              slidesPerView={2.2} // base (overridden by breakpoints)
              spaceBetween={6} // base (overridden by breakpoints)
              // ✅ key part: breakpoints are based on container (center column width)
              breakpointsBase="container"
              breakpoints={CENTER_BREAKPOINTS}
              // ✅ key part: updates when you drag/resize the center column
              resizeObserver
              observer
              observeParents
              autoplay={{
                delay: 1800,
                disableOnInteraction: false,
                pauseOnMouseEnter: false,
              }}
              className={cn("select-none cursor-grab active:cursor-grabbing")}
            >
              {pairedSlides?.map((pair, i) => (
                <SwiperSlide key={i} className="h-auto">
                  <div className={cn("flex flex-col gap-3 items-center")}>
                    <a
                      href={pair?.top?.link}
                      draggable={false}
                      className={cn(
                        "block overflow-hidden rounded-[12px] bg-[#213743]",
                        DESKTOP_CARD_SIZE,
                      )}
                    >
                      <div className="relative h-full w-full">
                        <Image
                        loading="lazy"
                          src={pair.top.verifiedImage}
                          alt={`slide-top-${i}`}
                          fill
                          className="object-cover"
                          draggable={false}
                          unoptimized
                          onError={(e: any) => {
                            e.currentTarget.src = STATIC_PLACEHOLDER;
                          }}
                        />
                      </div>
                    </a>

                    <a
                      href={pair?.bottom?.link}
                      draggable={false}
                      className={cn(
                        "block overflow-hidden rounded-[12px] bg-[#213743]",
                        DESKTOP_CARD_SIZE,
                      )}
                    >
                      <div className="relative h-full w-full">
                        <Image
                        loading="lazy"
                          src={pair.bottom.verifiedImage}
                          alt={`slide-bottom-${i}`}
                          fill
                          className="object-cover"
                          draggable={false}
                          unoptimized
                          onError={(e: any) => {
                            e.currentTarget.src = STATIC_PLACEHOLDER;
                          }}
                        />
                      </div>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Right fade (your existing element) */}
          <div className="pointer-events-none absolute top-0 right-0 h-full w-10 md:w-14 z-20" />
        </div>
      </div>
    </div>
  );
}
