import dynamic from "next/dynamic";

// Server Component:
const MarketDetailsComp = dynamic(
  () => import("@/components/pages/market-details"),
);

export default function MarketDetailsComponent() {
  return (
    <div>
      <MarketDetailsComp />
    </div>
  );
}
