import RequireAuth from "@/lib/require-auth";
import dynamic from "next/dynamic";

const BetHistory = dynamic(
  () => import("@/components/pages/bet-history/index"),
);

const BetHistoryROute = () => {
  return (
    <RequireAuth>
      <BetHistory />
    </RequireAuth>
  );
};

export default BetHistoryROute;
