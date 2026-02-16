"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import SingleMarket from "@/components/sidebar";
import Casino from "@/components/casino/page";
import SingleaMarket from "@/components/single-market/page";
import HomeSlider from "@/components/home-slider/page";
import SportsNave from "@/components/sports-nave";


export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ================= MOBILE VIEW ================= */}
      {isMobile && (
        <div>
          <HomeSlider />
          <div className="min-[425]:mt-[12.5px] min-[375]:mt-[12px] min-[320]:mt-[11.5px]">
            <SportsNave />
          </div>
          <div className="mb-4">
          <SingleaMarket />
          </div>
          <Casino />
        </div>
      )}

      {/* ================= DESKTOP VIEW ================= */}
      {!isMobile && (
        <div>
            <HomeSlider />
          <div className="mb-[8px] mt-[10px]">
            <SportsNave />
          </div>
          <div className="mb-4">
            <SingleaMarket />
          </div>
          <Casino />
        </div>
      )}
    </>
  );
}
