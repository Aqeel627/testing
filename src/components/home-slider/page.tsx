"use client";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CONFIG } from "@/lib/config";

interface SliderItem {
  id: string;
  url: string;
}

// Fallback static sliders
const staticSliders: SliderItem[] = [
  { id: "static-1", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1771190885016755.jpeg" },
  { id: "static-2", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1770989232480743.jpeg" },
  { id: "static-3", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1770989245911070.jpeg" },
  { id: "static-4", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1758881377636214.jpeg" },
  { id: "static-5", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1759080900908840.jpeg" },
  { id: "static-6", url: "https://static.assetsdelivery.net/marketing-posters/DOLLAR365COM/1770989265863471.jpeg" },
];

const sliderWrapperStyles = `w-full relative rounded-[16px] overflow-hidden group 
  [&_.custom-pagination]:!absolute [&_.custom-pagination]:!top-[21px] [&_.custom-pagination]:!bottom-auto [&_.custom-pagination]:!left-[21px] [&_.custom-pagination]:!w-auto [&_.custom-pagination]:z-50 [&_.custom-pagination]:flex [&_.custom-pagination]:items-center [&_.custom-pagination]:gap-3 
  [&_.swiper-pagination-bullet]:!m-0 [&_.swiper-pagination-bullet]:!w-2 [&_.swiper-pagination-bullet]:!h-2 [&_.swiper-pagination-bullet]:!bg-[#40c4ff] [&_.swiper-pagination-bullet]:!opacity-[0.24] [&_.swiper-pagination-bullet]:rounded-full [&_.swiper-pagination-bullet]:transition-all [&_.swiper-pagination-bullet]:duration-300 
  [&_.swiper-pagination-bullet-active]:!bg-[#40c4ff] [&_.swiper-pagination-bullet-active]:!opacity-100 [&_.swiper-pagination-bullet-active]:!w-2 [&_.swiper-pagination-bullet-active]:!h-2`;

export default function HomeSlider() {
  const [mounted, setMounted] = useState(false);
  const [banners, setBanners] = useState<SliderItem[]>([]);

  useEffect(() => {
    setMounted(true);

    const fetchSliders = async () => {
      try {
        const res = await fetch(CONFIG.bannersList, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            layout: "desktop",
            type: "SLIDER"
          }),
        });
        const json = await res.json();
        const sliders: SliderItem[] = json?.data?.slider?.map((item: any) => ({
          id: item.id,
          url: item.url,
        })) || [];
        setBanners(sliders);
      } catch (err) {
        console.error("Failed to fetch sliders:", err);
      }
    };

    fetchSliders();
  }, []);

  if (!mounted) {
    return <div className="overflow-hidden aspect-[2/1] sm:aspect-[21/9] lg:aspect-[10/3]" />;
  }

  // Use API sliders if available, otherwise fallback to static
  const displaySliders = banners.length > 0 ? banners : staticSliders;

  return (
    <div className="w-full">
      <div className={sliderWrapperStyles}>
        {/* Dots Top-Left */}
        <div className="custom-pagination"></div>

        {/* Arrows Top-Right */}
        <div className="absolute top-3 right-[14px] z-20 flex items-center gap-3">
          <button className="custom-prev cursor-pointer text-white opacity-70 hover:opacity-100 transition-opacity p-1 rounded-full">
            <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd" d="M15.488 4.43a.75.75 0 0 1 .081 1.058L9.988 12l5.581 6.512a.75.75 0 1 1-1.138.976l-6-7a.75.75 0 0 1 0-.976l6-7a.75.75 0 0 1 1.057-.081" clipRule="evenodd"></path>
            </svg>
          </button>

          <button className="custom-next cursor-pointer text-white opacity-70 hover:opacity-100 transition-opacity p-1 rounded-full">
            <svg className="w-5 h-5" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
              <path fill="currentColor" fillRule="evenodd" d="M8.512 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.138-.976L14.012 12L8.431 5.488a.75.75 0 0 1 .08-1.057" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>

        <SwiperComponent
          modules={[Autoplay, Navigation, Pagination]}
          slidesPerView={1}
          loop
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          autoHeight={false}
          navigation={{
            prevEl: ".custom-prev",
            nextEl: ".custom-next",
          }}
          pagination={{
            el: ".custom-pagination",
            clickable: true,
          }}
        >
          {displaySliders.map((item, index) => (
            <SwiperSlide key={item.id || index}>
              <div className="w-full relative aspect-[3.26/1] sm:aspect-[21/9] lg:aspect-[9.629/3] max-h-[400px]">
                <Image
                  src={item.url}
                  alt={`Slider ${index + 1}`}
                  fill
                  className="w-full h-full object-cover"
                  priority={index === 0}
                  unoptimized
                />
              </div>
            </SwiperSlide>
          ))}
        </SwiperComponent>
      </div>
    </div>
  );
}
