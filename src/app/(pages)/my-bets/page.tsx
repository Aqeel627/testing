"use client";

import BreadCrumb from "@/components/common/bread-crumb";
import MyBets from "@/components/common/my-bets/my-bets";
import { useSearchParams } from "next/navigation";

export default function MyBetsPage() {
  const sp = useSearchParams();
  const eventId = sp.get("eventId");
  const sportId = sp.get("sportId");

  const title = eventId && sportId ? "Open Bets" : "My Bets";

  return (
    <div className="w-full">
      <div className="my-4">
        <BreadCrumb title={title} />
      </div>
      <MyBets eventId={eventId} sportId={sportId} />
    </div>
  );
}