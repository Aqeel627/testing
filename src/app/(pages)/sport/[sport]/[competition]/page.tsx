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
    competition: string; // now this will be competition.id
  }>;
}

const CompetitionPage = ({ params }: CompetitionPageProps) => {
  const { sport, competition } = use(params);
  const { allEventsList } = useAppStore();

  const sportId = SPORT_IDS[sport.toLowerCase()];
  const sportName = sport.charAt(0).toUpperCase() + sport.slice(1);

  // Treat competition param as ID
  const competitionId = decodeURIComponent(competition);

  const sportEvents: any[] = useMemo(() => {
    if (!sportId || !allEventsList) return [];
    return allEventsList[sportId] ?? [];
  }, [allEventsList, sportId]);

  // ✅ Filter by competition.id instead of name
  const competitionEvents = useMemo(() => {
    return sportEvents.filter((event: any) => {
      return String(event?.competition?.id) === String(competitionId);
    });
  }, [sportEvents, competitionId]);

  // Get competition display name from first matched event
  const displayName = competitionEvents[0]?.competition?.name || "Competition";

  if (!allEventsList) return <p className="text-white p-4">Loading...</p>;

  if (!competitionEvents.length)
    return (
      <p className="text-white p-4">No events found for this competition.</p>
    );

  return (
    <>
      <SportsBreadCrumb title={sportName} subtitle={displayName} />
      <InplayMarket events={competitionEvents} />
    </>
  );
};

export default CompetitionPage;
