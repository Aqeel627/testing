import dynamic from "next/dynamic";

const MarketDetails = dynamic(
  () => import("@/components/pages/market-details"),
);

export default function MarketDetailsComponent() {
  return <MarketDetails />;
}
