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
        <SwiperComponent
          modules={[Autoplay, Navigation, Pagination]}
          loop
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          speed={800}  
          autoHeight={false}
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
