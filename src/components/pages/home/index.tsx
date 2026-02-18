import SingleMarket from "@/components/pages/home/single-market";
import SportsNav from "@/components/pages/home/sports-nav";
import HomeSlider from "@/components/pages/home/home-slider";
import Casino from "@/components/pages/live-casino";

export default function HomePage() {
  return (
    <>
      <div>
        <HomeSlider />
        <div className="min-[425]:mt-[12.5px] min-[375]:mt-3 min-[320]:mt-[11.5px] min-[992]:mb-2 min-[992]:mt-[10.5px]">
          {/* <SportsNav /> */}
        </div>
        <div className="mb-4">
          <SingleMarket />
        </div>
        <Casino />
      </div>
    </>
  );
}
