"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStore } from "@/lib/store/store";
import dynamic from "next/dynamic";
const Icon = dynamic(() => import("@/icons/icons"));

interface BreadCrumbProps {
  /** Override the page title shown above the crumbs. Defaults to last segment. */
  title?: string;
  /** Optional subtitle shown below the title (e.g. competition name). */
  subtitle?: string;
}

function slugToLabel(slug: string): string {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function toSportSlug(name: string): string {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

const SportsBreadCrumb = ({ title, subtitle }: BreadCrumbProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { menuList } = useAppStore();
  const eventTypeRef = useRef<HTMLSpanElement | null>(null);
  const competitionRef = useRef<HTMLSpanElement | null>(null);
  const [isEventTypeOpen, setIsEventTypeOpen] = useState(false);
  const [isCompetitionOpen, setIsCompetitionOpen] = useState(false);
  const [competition, setCompetition] = useState<any[]>([]);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedCompetition, setSelectedCompetition] = useState("");

  // Build crumb trail from pathname segments
  const crumbs = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);

    const items = [{ label: "Home", href: "/" }];

    let builtPath = "";
    segments.forEach((seg) => {
      builtPath += `/${seg}`;
      items.push({ label: slugToLabel(seg), href: builtPath });
    });

    return items;
  }, [pathname]);

  const lastCrumb = crumbs[crumbs.length - 1];
  const pageTitle = title ?? lastCrumb?.label ?? "";
  const pathSegments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname],
  );
  const sportSlug = pathSegments[1] || "";
  const defaultSportName = title || slugToLabel(sportSlug);

  function filterCompetitions(eventTypeId: string | number) {
    const filtered =
      menuList?.competitions?.filter(
        (item: any) => String(item?.eventType?.id) === String(eventTypeId),
      ) ?? [];
    setCompetition(filtered);
    return filtered;
  }

  useEffect(() => {
    if (!menuList?.eventTypes?.length) return;

    const selectedEvent = menuList.eventTypes.find(
      (item: any) =>
        String(item?.eventType?.name || "").toLowerCase() ===
        String(defaultSportName || "").toLowerCase(),
    );

    if (!selectedEvent) return;

    setSelectedEventType(selectedEvent.eventType.name);
    filterCompetitions(selectedEvent.eventType.id);
  }, [menuList, defaultSportName]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      const inEventType = eventTypeRef.current?.contains(t);
      const inCompetition = competitionRef.current?.contains(t);
      if (!inEventType) setIsEventTypeOpen(false);
      if (!inCompetition) setIsCompetitionOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const navigateToMarket = (sportName: string) => {
    router.push(`/sport/${toSportSlug(sportName)}`);
  };

  const navigateToMarketComp = (sportName: string, id: string | number) => {
    router.push(`/sport/${toSportSlug(sportName)}/${id}`);
  };

  return (
    <div className="px-2 pt-4 pb-2">
      {/* Title */}
      <h1 className="m-0 font-sans text-[1.5rem] font-bold leading-tight">
        {pageTitle}
      </h1>

      {/* Subtitle (e.g. competition name on competition page) */}
      {subtitle && (
        <p className="m-0 mt-0.5 font-sans text-[0.85rem] text-(--secondary-text-color) font-medium">
          {subtitle}
        </p>
      )}

      <div className="flex flex-wrap gap-2 min-[900px]:gap-4 mt-1.5">
        <span
          ref={eventTypeRef}
          className="h-6 min-w-6 inline-flex justify-center items-center overflow-visible text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5 relative"
        >
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsEventTypeOpen((v) => !v);
              setIsCompetitionOpen(false);
            }}
            className="cursor-pointer inline-flex"
          >
            <Icon name="play" className="w-5 h-5 text-[#68CDF9]" />
                        {selectedEventType || defaultSportName || ""}

          </button>

          
          {isEventTypeOpen && (
            <ul className="absolute left-2 p-1 top-full mt-0 -ml-1 max-h-50 glass backdrop-blur-[2px]!  rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)] text-(--palette-text-primary) z-40 overflow-y-auto no-scrollbar">
              {menuList?.eventTypes?.map((item: any) => (
                <li key={item.eventType.id}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedEventType(item.eventType.name);
                      setSelectedCompetition("");
                      filterCompetitions(item.eventType.id);
                      setIsEventTypeOpen(false);
                      navigateToMarket(item.eventType.name);
                    }}
                    className={`text-sm w-full text-nowrap text-left relative bg-transparent cursor-pointer gap-2 font-semibold transition px-2 py-1.5 rounded-[6px] ${
                      (selectedEventType &&
                        selectedEventType === item.eventType.name) ||
                      (!selectedEventType &&
                        defaultSportName === item.eventType.name)
                        ? "bg-[rgba(255,255,255,0.25)]! text-(--primary-color)"
                        : "hover:bg-[rgba(255,255,255,0.25)]"
                    }`}
                  >
                    {item.eventType.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </span>

        <span
          ref={competitionRef}
          className="h-6 min-w-6 inline-flex justify-center relative items-center text-sm bg-[#078dee29] rounded-[6px] pl-[8px] pr-2 gap-2.5"
        >
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsCompetitionOpen((v) => !v);
                setIsEventTypeOpen(false);
              }}
              className="inline-flex cursor-pointer"
            >
              <Icon name="play" className="w-5 h-5 text-[#68CDF9] " />
                            {selectedCompetition || subtitle || "Tournament"}

            </button>


            {isCompetitionOpen && (
              <ul className="absolute p-1 left-2 top-full mt-0 -ml-1 max-h-50 glass backdrop-blur-[2px]! rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)] text-(--palette-text-primary) z-40 overflow-y-auto no-scrollbar">
                {Array.isArray(competition) && competition.length > 0 ? (
                  competition.map((item: any) => (
                    <li key={item.competition.id}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedCompetition(item.competition.name);
                          setIsCompetitionOpen(false);
                          navigateToMarketComp(
                            item.eventType.name,
                            item.competition.id,
                          );
                        }}
                        className={`text-sm w-full text-nowrap text-left relative bg-transparent cursor-pointer gap-2 font-semibold transition px-2 py-1.5 rounded-[6px] ${
                          (selectedCompetition &&
                            selectedCompetition === item.competition.name) ||
                          (!selectedCompetition &&
                            subtitle === item.competition.name)
                            ? "bg-[rgba(255,255,255,0.25)]! text-(--primary-color)"
                            : "hover:bg-[rgba(255,255,255,0.25)]"
                        }`}
                      >
                        {item.competition.name}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="p-3 text-xs opacity-70">No competitions</li>
                )}
              </ul>
            )}
        </span>
      </div>
    </div>
  );
};

export default SportsBreadCrumb;
