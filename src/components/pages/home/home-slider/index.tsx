// "use client";
// import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { CONFIG } from "@/lib/config";

// interface SliderItem {
//   id: string;
//   url: string;
// }

// // Fallback static sliders
// const staticSliders: SliderItem[] = [
//   { id: "static-1", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1771190885016755.jpeg" },
//   { id: "static-2", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1770989232480743.jpeg" },
//   { id: "static-3", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1770989245911070.jpeg" },
//   { id: "static-4", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1758881377636214.jpeg" },
//   { id: "static-5", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1759080900908840.jpeg" },
//   { id: "static-6", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1770989265863471.jpeg" },
// ];

// const sliderWrapperStyles = `w-full relative rounded-[16px] overflow-hidden group 
//   [&_.custom-pagination]:!absolute [&_.custom-pagination]:!top-[21px] [&_.custom-pagination]:!bottom-auto [&_.custom-pagination]:!left-[21px] [&_.custom-pagination]:!w-auto [&_.custom-pagination]:z-50 [&_.custom-pagination]:flex [&_.custom-pagination]:items-center [&_.custom-pagination]:gap-3 
//   [&_.swiper-pagination-bullet]:!m-0 [&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination-bullet]:!bg-[#40c4ff] [&_.swiper-pagination-bullet]:!opacity-[0.24] [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 
//   [&_.swiper-pagination-bullet-active]:!bg-[#40c4ff] [&_.swiper-pagination-bullet-active]:!opacity-100 [&_.swiper-pagination-bullet-active]:!w-2 [&_.swiper-pagination-bullet-active]:!h-2`;

// export default function HomeSlider() {
//   const [mounted, setMounted] = useState(false);
//   const [banners, setBanners] = useState<SliderItem[]>([]);

//   useEffect(() => {
//     setMounted(true);

//     const fetchSliders = async () => {
//       try {
//         const res = await fetch(CONFIG.bannersList, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             layout: "desktop",
//             type: "SLIDER"
//           }),
//         });
//         const json = await res.json();
//         const sliders: SliderItem[] = json?.data?.slider?.map((item: any) => ({
//           id: item.id,
//           url: item.url,
//         })) || [];
//         setBanners(sliders);
//       } catch (err) {
//         console.error("Failed to fetch sliders:", err);
//       }
//     };

//     fetchSliders();
//   }, []);

//   if (!mounted) {
//     return <div className="overflow-hidden aspect-[2/1] sm:aspect-[21/9] lg:aspect-[10/3]" />;
//   }

//   // Use API sliders if available, otherwise fallback to static
//   const displaySliders = banners.length > 0 ? banners : staticSliders;

//   return (
//     <div className="w-full">
//       <div className={sliderWrapperStyles}>
//         <SwiperComponent
//           modules={[Autoplay, Navigation, Pagination]}
//           loop
//           autoplay={{ delay: 3000, disableOnInteraction: false }}
//           speed={800}  
//           autoHeight={false}
//         >
//           {displaySliders.map((item, index) => (
//             <SwiperSlide key={item.id || index}>
//               <div className="w-full relative aspect-[3.26/1] sm:aspect-[21/9] lg:aspect-[9.629/3] max-h-[400px]">
//                 <Image
//                   src={item.url}
//                   alt={`Slider ${index + 1}`}
//                   fill
//                   className="w-full h-full object-cover"
//                   priority={index === 0}
//                   unoptimized
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </SwiperComponent>
//       </div>
//     </div>
//   );
// }


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