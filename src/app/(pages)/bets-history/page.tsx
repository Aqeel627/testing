import dynamic from "next/dynamic";

const BetHistory = dynamic(
  () => import("@/components/pages/bet-history/index"),
);

const BetHistoryROute = () => {
  return <BetHistory />;
};

export default BetHistoryROute;
