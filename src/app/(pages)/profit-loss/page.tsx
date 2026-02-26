import ProfitLossPage from "@/components/pages/profit-loss-page";
import ProfitLossEventPage from "@/components/pages/profitloss-event-page";
import ProfitLossMarketPage from "@/components/pages/profitloss-market-page";
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
