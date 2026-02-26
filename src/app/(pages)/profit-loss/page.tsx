
import ProfitLossPage from "@/components/pages/profit-loss/profit-loss-page";
import RequireAuth from "@/lib/require-auth";
import React from "react";

export default function ProfitLoss() {
  return (
    <RequireAuth>
      <ProfitLossPage></ProfitLossPage>
    </RequireAuth>
    // <ProfitLossEventPage></ProfitLossEventPage>
    // <ProfitLossMarketPage></ProfitLossMarketPage>
  );
}
