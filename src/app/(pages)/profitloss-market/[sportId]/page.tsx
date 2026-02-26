import React from "react";
import RequireAuth from "@/lib/require-auth";
import ProfitLossMarketPage from "@/components/pages/profit-loss/profitloss-market-page";

export default function ProfitLossMarket() {
  return (
    <RequireAuth>
      <ProfitLossMarketPage></ProfitLossMarketPage>
    </RequireAuth>
  );
}
