import ProfitLossEventPage from "@/components/pages/profit-loss/profitloss-event-page";
import RequireAuth from "@/lib/require-auth";
import React from "react";

export default function ProfitLossEvents() {
  return (
    <RequireAuth>
      <ProfitLossEventPage></ProfitLossEventPage>
    </RequireAuth>
  );
}
