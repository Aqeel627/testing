
// my working
// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { cn } from "@/lib/utils";

// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay } from "swiper/modules";
// import "swiper/css";

// interface SlideItem {
//   src: string;
//   href: string;
// }

// interface PairedSlide {
//   top: SlideItem;
//   bottom: SlideItem;
// }

// const slides: SlideItem[] = [
//   { src: "/home-slider/slider-1.jpeg", href: "#" },
//   { src: "/home-slider/slider-2.jpeg", href: "#" },
//   { src: "/home-slider/slider-3.jpeg", href: "#" },
//   { src: "/home-slider/slider-4.jpeg", href: "#" },
//   { src: "/home-slider/slider-6.jpeg", href: "#" },
//   { src: "/home-slider/slider-4.jpeg", href: "#" },
// ];

// const loopSlides: SlideItem[] = [...slides, ...slides, ...slides];

// const pairedSlides: PairedSlide[] = [];
// for (let i = 0; i < loopSlides.length; i += 2) {
//   pairedSlides.push({
//     top: loopSlides[i],
//     bottom: loopSlides[i + 1] || loopSlides[0],
//   });
// }

// // tilt (same direction)
// const TILT_CLASS = "transform-gpu rotate-[2deg] origin-center";

// export default function HomeSlider() {
//   return (
//     <div className="w-full">
//       {/* ✅ Desktop only: remove mt-3 + add py-1
//           ✅ Mobile flow untouched: mt-3 remains on mobile */}
//       <div className="relative mt-3 lg:mt-0 lg:py-1">
//         {/* Mobile/Tablet: Single images (UNCHANGED) */}
//         <div className="lg:hidden">
//           <Swiper
//             modules={[Autoplay]}
//             loop={true}
//             spaceBetween={12}
//             speed={1200}
//             grabCursor={true}
//             slidesPerView={3}
//             slidesPerGroup={1}
//             autoplay={{
//               delay: 1800,
//               disableOnInteraction: false,
//               pauseOnMouseEnter: false,
//             }}
//             className={cn("select-none cursor-grab active:cursor-grabbing")}
//           >
//             {loopSlides.map((s, i) => (
//               <SwiperSlide key={i} className="h-auto">
//                 <Link
//                   href={s.href}
//                   draggable={false}
//                   className="block w-full overflow-hidden rounded-[12px] bg-[#213743] aspect-[5/5]"
//                 >
//                   <div className="relative h-full w-full">
//                     <Image
//                       src={s.src}
//                       alt={`slide-${i}`}
//                       fill
//                       className="object-cover"
//                       draggable={false}
//                     />
//                   </div>
//                 </Link>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         {/* Desktop: Paired images */}
//         <div className="hidden lg:block">
//           <Swiper
//             modules={[Autoplay]}
//             loop={true}
//             spaceBetween={14}
//             speed={1200}
//             grabCursor={true}
//             slidesPerView={4.3}
//             slidesPerGroup={1}
//             autoplay={{
//               delay: 1800,
//               disableOnInteraction: false,
//               pauseOnMouseEnter: false,
//             }}
//             className={cn(
//               "select-none cursor-grab active:cursor-grabbing",
//               "!overflow-visible"
//             )}
//           >
//             {pairedSlides.map((pair, i) => (
//               <SwiperSlide key={i} className={cn("h-auto", "!overflow-visible")}>
//                 {/* ✅ Desktop only tilt + center column */}
//                 <div className={cn("flex flex-col gap-3 items-center", TILT_CLASS)}>
//                   {/* ✅ Desktop only: EXACT 164x164 */}
//                   <Link
//                     href={pair.top.href}
//                     draggable={false}
//                     className="block w-[164px] h-[164px] overflow-hidden rounded-[12px] bg-[#213743]"
//                   >
//                     <div className="relative h-full w-full">
//                       <Image
//                         src={pair.top.src}
//                         alt={`slide-top-${i}`}
//                         fill
//                         className="object-cover"
//                         draggable={false}
//                       />
//                     </div>
//                   </Link>

//                   {/* ✅ Desktop only: EXACT 164x164 */}
//                   <Link
//                     href={pair.bottom.href}
//                     draggable={false}
//                     className="block w-[164px] h-[164px] overflow-hidden rounded-[12px] bg-[#213743]"
//                   >
//                     <div className="relative h-full w-full">
//                       <Image
//                         src={pair.bottom.src}
//                         alt={`slide-bottom-${i}`}
//                         fill
//                         className="object-cover"
//                         draggable={false}
//                       />
//                     </div>
//                   </Link>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         {/* Right fade */}
//         <div className="pointer-events-none absolute top-0 right-0 h-full w-10 md:w-14 z-20" />
//       </div>
//     </div>
//   );
// }


"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useLayoutWidthStore } from "@/lib/store/layoutWidth.store";

interface SlideItem {
  src: string;
  href: string;
}

interface PairedSlide {
  top: SlideItem;
  bottom: SlideItem;
}

const slides: SlideItem[] = [
  { src: "/home-slider/slider-1.jpeg", href: "#" },
  { src: "/home-slider/slider-2.jpeg", href: "#" },
  { src: "/home-slider/slider-3.jpeg", href: "#" },
  { src: "/home-slider/slider-4.jpeg", href: "#" },
  { src: "/home-slider/slider-6.jpeg", href: "#" },
  { src: "/home-slider/slider-4.jpeg", href: "#" },
];

const loopSlides: SlideItem[] = [...slides, ...slides, ...slides];



const pairedSlides: PairedSlide[] = [];
for (let i = 0; i < loopSlides.length; i += 2) {
  pairedSlides.push({
    top: loopSlides[i],
    bottom: loopSlides[i + 1] || loopSlides[0],
  });
}
const DEFAULT_BREAKPOINTS = {
  1024: { slidesPerView: 6.5, spaceBetween: 10 },
  1060: { slidesPerView: 6.9, spaceBetween: 10 },
  1100: { slidesPerView: 7.2, spaceBetween: 10 },
  1170: { slidesPerView: 7.5, spaceBetween: 10 },
  1200: { slidesPerView: 4.5, spaceBetween: 10 },
  1280: { slidesPerView: 3, spaceBetween: 10 },
  1366: { slidesPerView: 4.5, spaceBetween: 10 },
  1440: { slidesPerView: 4.5, spaceBetween: 10 },
  1536: { slidesPerView: 4.9, spaceBetween: 10 },
  1600: { slidesPerView: 5.1, spaceBetween: 10 },
  1920: { slidesPerView: 6.0, spaceBetween: 10 },
};

const getExpandedSlides = (mainWidth: number) => {
  if (!mainWidth) return undefined;

  if (mainWidth >= 1350) return { slides: 4.6, space: 16 };
  if (mainWidth >= 1200) return { slides: 4.2, space: 14 };
  if (mainWidth >= 1100) return { slides: 5.8, space: 12 };
  if (mainWidth >= 1000) return { slides: 5.2, space: 10 };
  if (mainWidth >= 900)  return { slides: 7, space: 4 };
  if (mainWidth >= 860)  return { slides: 5.5, space: 4 };
  if (mainWidth >= 820)  return { slides: 5, space: 6 };
  return undefined;
};

// tilt (same direction)
const TILT_CLASS = "transform-gpu rotate-[2deg] origin-center";

// ✅ Desktop only: responsive square size (never exceeds 164, shrinks on smaller desktops)
const DESKTOP_CARD_SIZE = "w-[clamp(140px,10vw,164px)] h-[clamp(140px,10vw,164px)]";

export default function HomeSlider() {
const mainWidth = useLayoutWidthStore((state) => state.mainWidth);

console.log("CENTER WIDTH FROM STORE:", mainWidth);


// const expandedSlides = getExpandedSlides(mainWidth);
const getExpandedConfig = (mainWidth: number) => {
  if (!mainWidth) return null;

  if (mainWidth >= 1350) return { slidesPerView: 4.6, spaceBetween: 16 };
  if (mainWidth >= 1200) return { slidesPerView: 4.2, spaceBetween: 14 };
  if (mainWidth >= 1100) return { slidesPerView: 6.5, spaceBetween: 12 };
  if (mainWidth >= 1000) return { slidesPerView: 6, spaceBetween: 10 };
  if (mainWidth >= 900)  return { slidesPerView: 5.3, spaceBetween: 4 };
  if (mainWidth >= 860)  return { slidesPerView: 5.5, spaceBetween: 4 };
  if (mainWidth >= 820)  return { slidesPerView: 5, spaceBetween: 6 };

  return null;
};
const expandedConfig = getExpandedConfig(mainWidth);


console.log("mainWidth:", mainWidth, "expandedSlides:", expandedConfig);

  return (
    <div className="w-full">
      {/* desktop: remove mt-3 + add py-1 | mobile untouched */}
      <div className="relative mt-3 lg:mt-0 lg:py-1">
        {/* Mobile/Tablet: Single images (UNCHANGED) */}
        <div className="lg:hidden">
          <Swiper
            modules={[Autoplay]}
            loop={true}
            spaceBetween={12}
            speed={1200}
            grabCursor={true}
            slidesPerView={3}
            slidesPerGroup={1}
            autoplay={{
              delay: 1800,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}
            className={cn("select-none cursor-grab active:cursor-grabbing")}
          >
            {loopSlides.map((s, i) => (
              <SwiperSlide key={i} className="h-auto">
           <div className={cn("flex flex-col gap-3 items-center")}>
                <Link
                  href={s.href}
                  draggable={false}
                  className="block w-full overflow-hidden rounded-[12px] bg-[#213743] aspect-[5/5]"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={s.src}
                      alt={`slide-${i}`}
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Desktop: Paired images (RESPONSIVE, does not break on resize) */}
        <div className="hidden lg:block">
          <Swiper
          key={mainWidth} 
            onSwiper={(s) => {
    console.log("INIT breakpoint:", s.currentBreakpoint);
    console.log("slidesPerView:", s.params.slidesPerView, "spaceBetween:", s.params.spaceBetween);
  }}
  onBreakpoint={(s, bp) => {
    console.log("BREAKPOINT:", bp);
    console.log("slidesPerView:", s.params.slidesPerView, "spaceBetween:", s.params.spaceBetween);
  }}
  
            modules={[Autoplay]}
            loop={true}
            // spaceBetween={16}
            speed={1200}
            grabCursor={true}
            slidesPerGroup={1}
{...(expandedConfig
  ? {
      slidesPerView: expandedConfig.slidesPerView,
      spaceBetween: expandedConfig.spaceBetween,
    }
  : {
      breakpoints: DEFAULT_BREAKPOINTS,
      spaceBetween: 16, // default desktop space
    })}

            observer
            observeParents
            autoplay={{
              delay: 1800,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
            }}

  //             breakpoints={{
  //   1024: { slidesPerView: 6.5, spaceBetween: 10 },
  //   1060: { slidesPerView: 6.9, spaceBetween: 10 },
  //   1100: { slidesPerView: 7.2, spaceBetween: 10 },
  //   1170: { slidesPerView: 7.5, spaceBetween: 10 },
  //   1200: { slidesPerView: 4.5, spaceBetween: 10 },
  //   1220: { slidesPerView: 4.5, spaceBetween: 10 },
  //   1280: { slidesPerView: 3, spaceBetween: 10 },
  //   1366: { slidesPerView: 3, spaceBetween: 10 },
  //   1390: { slidesPerView: 4.5, spaceBetween: 10 },
  //   1440: { slidesPerView: 4.5, spaceBetween: 10 }, // ✅ your perfect one
  //   1536: { slidesPerView: 4.9, spaceBetween: 10 },
  //   1600: { slidesPerView: 5.1, spaceBetween: 10 },
  //   1920: { slidesPerView: 6.0, spaceBetween: 10 },
  // }}
            className={cn(
              "select-none cursor-grab active:cursor-grabbing",
            )}
          >
            {pairedSlides.map((pair, i) => (
              <SwiperSlide key={i} className={cn("h-auto")}>
                <div className={cn("flex flex-col gap-3 items-center")}>
                  <Link
                    href={pair.top.href}
                    draggable={false}
                    className={cn(
                      "block overflow-hidden rounded-[12px] bg-[#213743]",
                      DESKTOP_CARD_SIZE
                    )}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={pair.top.src}
                        alt={`slide-top-${i}`}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                  </Link>

                  <Link
                    href={pair.bottom.href}
                    draggable={false}
                    className={cn(
                      "block overflow-hidden rounded-[12px] bg-[#213743]",
                      DESKTOP_CARD_SIZE
                    )}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={pair.bottom.src}
                        alt={`slide-bottom-${i}`}
                        fill
                        className="object-cover"
                        draggable={false}
                      />
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Right fade */}
        <div className="pointer-events-none absolute top-0 right-0 h-full w-10 md:w-14 z-20" />
      </div>
    </div>
  );
}