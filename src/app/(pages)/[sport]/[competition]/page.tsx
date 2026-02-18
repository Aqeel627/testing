"use client";
import { useAppStore } from "@/lib/store/store";
import InplayMarket from "@/components/pages/inplay/inplay-market";
import { useMemo, use } from "react";
import SportsBreadCrumb from "@/components/common/sports-bread-crumb";

const SPORT_IDS: Record<string, string> = {
  cricket: "4",
  soccer: "1",
  tennis: "2",
};

interface CompetitionPageProps {
  params: Promise<{
    sport: string;
    competition: string;
  }>;
}

const CompetitionPage = ({ params }: CompetitionPageProps) => {
  const { sport, competition } = use(params);
  const { allEventsList } = useAppStore();

  const sportId = SPORT_IDS[sport.toLowerCase()];
  const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);
  const competitionSlug = decodeURIComponent(competition);

  const sportEvents: any[] = useMemo(() => {
    if (!sportId || !allEventsList) return [];
    return allEventsList[sportId] ?? [];
  }, [allEventsList, sportId]);

  const competitionEvents = useMemo(() => {
    return sportEvents.filter((event: any) => {
      const compName = event?.competition?.name ?? "";
      const slug = compName.toLowerCase().replace(/\s+/g, "-");
      return slug === competitionSlug;
    });
  }, [sportEvents, competitionSlug]);

  const displayName =
    competitionEvents[0]?.competition?.name ||
    decodeURIComponent(competition).replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (!allEventsList) return <p className="text-white p-4">Loading...</p>;
  if (!competitionEvents.length)
    return <p className="text-white p-4">No events found for {displayName}.</p>;

  return (
    <>
      <SportsBreadCrumb title={sportName} subtitle={displayName} />
      <InplayMarket events={competitionEvents} />
    </>
  );
};

export default CompetitionPage;