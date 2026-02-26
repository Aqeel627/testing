import React from "react";
import ProfitLossMarketPage from "@/components/pages/profitloss-market-page/index";
import RequireAuth from "@/lib/require-auth";

export default function ProfitLossMarket() {
  return (
    <RequireAuth>
      <ProfitLossMarketPage></ProfitLossMarketPage>
    </RequireAuth>
  );
}
