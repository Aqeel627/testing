"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { type MouseEvent, useEffect, useMemo, useState } from "react";
import styles from "./sidebar.module.css";
import { useAppStore } from "@/lib/store/store";
import Link from "next/link";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/store/ui-store";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface ThirdItem {
  name: string;
  count: number;
  href?: string;
}

interface Tournament {
  name: string;
  count: number;
  thirdItems: ThirdItem[];
  href?: string;
}

interface Sport {
  name: string;
  iconUrl: string;
  count: number;
  tournaments: Tournament[];
  href?: string;
}

interface SidebarConfig {
  sports: Sport[];
  quickLinks: Array<{
    label: string;
    href: string;
    count: number;
    icon: React.ReactNode;
  }>;
}

interface ActiveState {
  type: "quicklink" | "sport" | null;
  qlLabel?: string;
  sportIndex?: number;
  tournamentIndex?: number;
  thirdIndex?: number;
}

const DROPDOWN_TRANSITION = {
  height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.2, ease: "easeOut" as const },
};

const SPORT_ICONS: Record<string, string> = {
  "4": "/sidebar/ic_cricket.svg",
  "1": "/sidebar/ic_football.svg",
  "2": "/ic_tennis.svg",
};

// ─────────────────────────────────────────────
// QuickLinkItem
// ─────────────────────────────────────────────
interface QuickLinkItemProps {
  label: string;
  href: string;
  count: number;
  icon: React.ReactNode;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}
// Sidebar component ke andar ye function add karein
const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left; // Mouse X position inside element
  const y = e.clientY - rect.top;  // Mouse Y position inside element

  // Ye dono values hum CSS variables (--x, --y) mein set kar rahe hain
  e.currentTarget.style.setProperty("--x", `${x}px`);
  e.currentTarget.style.setProperty("--y", `${y}px`);
};
const QuickLinkItem = ({
  label,
  href,
  count,
  icon,
  isActive,
  onActivate,
  onClose,
}: QuickLinkItemProps) => (
  <li className={styles.item}>
    <Link
      href={href}
      onMouseDown={handleRipple}
      className={cn(styles.link, isActive && styles.linkActive)}
      onClick={() => {
        onActivate();
        onClose(); // close sidebar on quicklink navigation
      }}
    >
      <span className={styles.linkIconWrap}>
        <Icon
          name={icon}
          className={cn(
            styles.linkIcon,
            label === "Market Analysis" && "h-5! w-5!",
          )}
        />
      </span>
      <span className={styles.linkText}>{label}</span>
      <span className={styles.badgeWrap}>
        <span className={styles.badge}>{count}</span>
      </span>
    </Link>
  </li>
);

// ─────────────────────────────────────────────
// ThirdItemComponent (individual match → navigates + closes sidebar)
// ─────────────────────────────────────────────
interface ThirdItemComponentProps {
  item: ThirdItem;
  isActive: boolean;
  onActivate: () => void;
}

const ThirdItemComponent = ({
  item,
  isActive,
  onActivate,
}: ThirdItemComponentProps) => {
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  return (
    <li className={styles.navItemLi}>
      <Link
        href={item.href || "#"}
        onMouseDown={handleRipple} // <-- Ye line add karein
        className={cn(styles.navLink, isActive && styles.activeSubItem)}
        onClick={() => {
          onActivate();
          closeSidebar(); // navigate to market-details → close sidebar
        }}
      >
        <span className={styles.thirdItemText}>{item.name}</span>
        <span className={styles.badgeWrap}>
          <span className={styles.badge}>{item.count}</span>
        </span>
      </Link>
    </li>
  );
};

// ─────────────────────────────────────────────
// TournamentItemComponent
// Clicking a tournament ONLY toggles its child dropdown — no navigation, no sidebar close
// ─────────────────────────────────────────────
interface TournamentItemComponentProps {
  tournament: Tournament;
  sportIndex: number;
  tournamentIndex: number;
  openTournamentKey: string | null;
  onTournamentClick: (
    e: MouseEvent<HTMLAnchorElement>,
    sportIndex: number,
    tournamentIndex: number,
  ) => void;
  isTournamentActive: boolean;
  activeThirdIndex: number | null;
  onThirdItemActivate: (thirdIndex: number) => void;
}

const TournamentItemComponent = ({
  tournament,
  sportIndex,
  tournamentIndex,
  openTournamentKey,
  onTournamentClick,
  isTournamentActive,
  activeThirdIndex,
  onThirdItemActivate,
}: TournamentItemComponentProps) => {
  const tKey = `${sportIndex}-${tournamentIndex}`;
  const hasThirdItems = tournament.thirdItems.length > 0;

  return (
    <li className={styles.navItemLi}>
      {/* Always use button-like behaviour — no href navigation for tournaments */}
      <a
        href="#"
        onMouseDown={handleRipple} // <-- Ye line add karein
        className={cn(
          styles.navLink,
          isTournamentActive && styles.activeSubItem,
        )}
        onClick={(e) => onTournamentClick(e, sportIndex, tournamentIndex)}
      >
        <span className={styles.navItemText}>{tournament.name}</span>
        <span className={styles.badgeWrap}>
          <span className={styles.badge}>{tournament.count}</span>
        </span>
        {hasThirdItems && (
          <Icon
            name={"chevronRight"}
            className={`${styles.navArrow} ${openTournamentKey === tKey ? styles.navArrowOpen : ""}`}
          />
        )}
      </a>

      {hasThirdItems && (
        <motion.div
          className={`${styles.sportDropdown} pl-6`}
          initial={false}
          animate={
            openTournamentKey === tKey
              ? { height: "auto", opacity: 1 }
              : { height: 0, opacity: 0 }
          }
          transition={DROPDOWN_TRANSITION}
        >
          <ul className={styles.navItemWrapper}>
            {tournament.thirdItems.map((item, idx) => (
              <ThirdItemComponent
                key={idx}
                item={item}
                isActive={isTournamentActive && activeThirdIndex === idx}
                onActivate={() => onThirdItemActivate(idx)}
              />
            ))}
          </ul>
        </motion.div>
      )}
    </li>
  );
};

// ─────────────────────────────────────────────
// SportItemComponent
// Clicking a sport ONLY toggles its dropdown — no navigation, no sidebar close
// ─────────────────────────────────────────────
interface SportItemComponentProps {
  sport: Sport;
  sportIndex: number;
  openSportIndex: number | null;
  openTournamentKey: string | null;
  onSportClick: (e: MouseEvent<HTMLAnchorElement>, index: number) => void;
  onTournamentClick: (
    e: MouseEvent<HTMLAnchorElement>,
    sportIndex: number,
    tournamentIndex: number,
  ) => void;
  isSportActive: boolean;
  activeTournamentIndex: number | null;
  activeThirdIndex: number | null;
  onThirdItemActivate: (
    sportIndex: number,
    tournamentIndex: number,
    thirdIndex: number,
  ) => void;
}

const SportItemComponent = ({
  sport,
  sportIndex,
  openSportIndex,
  openTournamentKey,
  onSportClick,
  onTournamentClick,
  isSportActive,
  activeTournamentIndex,
  activeThirdIndex,
  onThirdItemActivate,
}: SportItemComponentProps) => {
  const isOpen = openSportIndex === sportIndex;

  return (
    <li className={styles.item}>
      {/* Always use href="#" — sport click only toggles dropdown, never navigates */}
      <a
        href="#"
        onMouseDown={handleRipple} // <-- Ye line add karein
        className={cn(styles.link, isSportActive && styles.linkActive)}
        onClick={(e) => onSportClick(e, sportIndex)}
      >
        <span className={styles.linkIconWrap}>
          <span
            className={styles.sportImage}
            style={
              { "--sport-icon": `url(${sport.iconUrl})` } as CSSProperties
            }
          />
        </span>
        <span className={styles.linkText}>{sport.name}</span>
        <span className={styles.badgeWrap}>
          <span className={styles.badge}>{sport.count}</span>
        </span>
        <Icon
          name={"chevronRight"}
          className={`${styles.navArrow} ${isOpen ? styles.navArrowOpen : ""}`}
        />
      </a>

      <motion.div
        className={`${styles.sportDropdown} pl-6`}
        initial={false}
        animate={
          isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }
        }
        transition={DROPDOWN_TRANSITION}
      >
        <ul className={styles.navItemWrapper}>
          {sport.tournaments.map((tournament, tIndex) => (
            <TournamentItemComponent
              key={`${sportIndex}-${tIndex}`}
              tournament={tournament}
              sportIndex={sportIndex}
              tournamentIndex={tIndex}
              openTournamentKey={openTournamentKey}
              onTournamentClick={onTournamentClick}
              isTournamentActive={
                isSportActive && activeTournamentIndex === tIndex
              }
              activeThirdIndex={
                isSportActive && activeTournamentIndex === tIndex
                  ? activeThirdIndex
                  : null
              }
              onThirdItemActivate={(thirdIndex) =>
                onThirdItemActivate(sportIndex, tIndex, thirdIndex)
              }
            />
          ))}
        </ul>
      </motion.div>
    </li>
  );
};

// ─────────────────────────────────────────────
// Main Sidebar
// ─────────────────────────────────────────────
interface SidebarProps {
  config?: SidebarConfig;
}

export default function Sidebar({ config }: SidebarProps) {
  const pathName = usePathname();
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(true);
  const [isSportsOpen, setIsSportsOpen] = useState(true);
  const [openSportIndex, setOpenSportIndex] = useState<number | null>(null);
  const [openTournamentKey, setOpenTournamentKey] = useState<string | null>(null);
  const { inplayEvents, menuList } = useAppStore();
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  const [active, setActive] = useState<ActiveState>({ type: null });


  // 👇 NAYA EVENT LISTENER 👇
  useEffect(() => {
    const handleResetDropdowns = () => {
      setOpenSportIndex(null);
      setOpenTournamentKey(null);
      setActive({ type: null });
    };

    // Jab bhi 'reset-sidebar' ka signal aayega, ye function chal jayega
    window.addEventListener("reset-sidebar", handleResetDropdowns);

    return () => {
      window.removeEventListener("reset-sidebar", handleResetDropdowns);
    };
  }, []);
  // 👆 ---------------------------------------------------- 👆
  const dynamicSportsConfig: Sport[] = useMemo(() => {
    if (!menuList) return [];

    const { events = [] } = menuList;

    const sportMap = new Map<
      string,
      {
        name: string;
        id: string;
        tournaments: Map<
          string,
          {
            name: string;
            id: string;
            events: Array<{ id: string; name: string }>;
          }
        >;
      }
    >();

    events.forEach((event: any) => {
      const sportId = event?.eventType?.id || "";
      const sportName = event?.eventType?.name || "";
      const compId = event?.competition?.id || "";
      const compName = event?.competition?.name || "";
      const eventId = event?.event?.id || "";
      const eventName = event?.event?.name || "";

      if (!sportId || !compId || !eventId) return;

      if (!sportMap.has(sportId)) {
        sportMap.set(sportId, { name: sportName, id: sportId, tournaments: new Map() });
      }

      const sport = sportMap.get(sportId)!;

      if (!sport.tournaments.has(compId)) {
        sport.tournaments.set(compId, { name: compName, id: compId, events: [] });
      }

      sport.tournaments.get(compId)!.events.push({ id: eventId, name: eventName });
    });

    return Array.from(sportMap.values()).map((sport) => {
      const tournaments: Tournament[] = Array.from(sport.tournaments.values()).map((comp) => ({
        name: comp.name,
        count: comp.events.length,
        // No competition-level href — tournaments only expand, never navigate
        href: undefined,
        thirdItems: comp.events.map((evt) => ({
          name: evt.name,
          count: 1,
          href: `/market-details/${evt.id}/${sport.id}`, // only market-details navigates
        })),
      }));

      return {
        name: sport.name,
        iconUrl: SPORT_ICONS[sport.id] || "/sidebar/ic_default.svg",
        count: tournaments.reduce((sum, t) => sum + t.count, 0),
        tournaments,
        // No sport-level href — sports only expand, never navigate
        href: undefined,
      };
    });
  }, [menuList]);

  const sidebarConfig: SidebarConfig = config || {
    sports: dynamicSportsConfig,
    quickLinks: [
      {
        label: "Inplay",
        href: "/inplay",
        count: inplayEvents?.totalLength || 0,
        icon: "inplay",
      },
      {
        label: "Market Analysis",
        href: "#",
        count: 0,
        icon: "analytics",
      },
    ],
  };

  // ─── Toggles ───
  const handleSportsToggle = () => {
    setIsSportsOpen((prev) => {
      const next = !prev;
      if (!next) {
        setOpenSportIndex(null);
        setOpenTournamentKey(null);
      }
      return next;
    });
  };

  const handleQuickLinksToggle = () => setIsQuickLinksOpen((prev) => !prev);

  const handleQuickLinkActivate = (label: string) => {
    setActive({ type: "quicklink", qlLabel: label });

    // 👇 In 2 lines se agar koi sport ya tournament open hoga to wo close ho jayega
    setOpenSportIndex(null);
    setOpenTournamentKey(null);

    // closeSidebar is called inside QuickLinkItem's onClick
  };

  // Sport click — ONLY toggles dropdown, no navigation, no sidebar close
  const handleSportClick = (
    e: MouseEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    e.preventDefault();
    setOpenTournamentKey(null);
    setOpenSportIndex((prev) => (prev === index ? null : index));
    setActive({ type: "sport", sportIndex: index });
  };

  // Tournament click — ONLY toggles its child list, no navigation, no sidebar close
  const handleTournamentClick = (
    e: MouseEvent<HTMLAnchorElement>,
    sportIndex: number,
    tournamentIndex: number,
  ) => {
    e.preventDefault();
    const key = `${sportIndex}-${tournamentIndex}`;
    setOpenTournamentKey((prev) => (prev === key ? null : key));
    setActive({ type: "sport", sportIndex, tournamentIndex });
  };

  const handleThirdItemActivate = (
    sportIndex: number,
    tournamentIndex: number,
    thirdIndex: number,
  ) => {
    setActive({ type: "sport", sportIndex, tournamentIndex, thirdIndex });
    // ThirdItemComponent handles closeSidebar itself
  };

  const isQuickLinkActive = (label: string, href: string) => {
    if (active.type === "sport") return false;
    if (active.type === "quicklink" && active.qlLabel === label) return true;
    if (href !== "#" && pathName?.includes(href)) return true;
    return false;
  };


  const activeTournamentIndexFor = (sportIndex: number): number | null => {
    if (active.type !== "sport" || active.sportIndex !== sportIndex) return null;
    return active.tournamentIndex !== undefined ? active.tournamentIndex : null;
  };

  const activeThirdIndexFor = (sportIndex: number): number | null => {
    if (active.type !== "sport" || active.sportIndex !== sportIndex) return null;
    return active.thirdIndex !== undefined ? active.thirdIndex : null;
  };

  const isSportActive = (sportIndex: number) =>
    active.type === "sport" && active.sportIndex === sportIndex;

  const handleSearchToggle = () => toggleSearch(true);

  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {/* Mobile Search */}
        <div
          className={`${styles.searchWrapper} lg:hidden! border-b -mx-4 border-[#919eab14]`}
          onClick={handleSearchToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, handleSearchToggle)}
        >
          <div className="px-4">
            <div className={styles.searchBtn}>
              <Icon name={"search"} className={styles.searchIcon} />
            </div>
          </div>
        </div>

        {/* Desktop Search */}
        <div
          className={`${styles.searchRow} max-lg:hidden!`}
          onClick={handleSearchToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, handleSearchToggle)}
        >
          <span className={styles.searchIconWrap}>
            <Icon name={"search"} className={styles.searchIcon} />
          </span>
          <span className={styles.shortcut}>⌘K</span>
        </div>

        {/* Quick Links Section */}
        <li className={styles.item}>
          <div
            className={`${styles.sectionTitle} flex items-center justify-between`}
            onClick={handleQuickLinksToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, handleQuickLinksToggle)}
          >
            <Icon
              name={"chevronDown"}
              className={`${styles.sectionIcon} duration-300 ${!isQuickLinksOpen ? "-rotate-90" : ""}`}
            />
            <span className={`${styles.sectionLabel} leading-[1.5]!`}>
              Quick Links
            </span>
          </div>

          <motion.div
            className={styles.sportDropdown}
            initial={false}
            animate={
              isQuickLinksOpen
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={DROPDOWN_TRANSITION}
          >
            <ul className={styles.subList}>
              {sidebarConfig.quickLinks.map((link) => (
                <QuickLinkItem
                  onClose={closeSidebar}
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  count={link.count}
                  icon={link.icon}
                  // pathName={pathName}
                  isActive={isQuickLinkActive(link.label, link.href)}
                  onActivate={() => handleQuickLinkActivate(link.label)}
                />
              ))}
            </ul>
          </motion.div>
        </li>

        {/* Sports Section */}
        <li className={styles.item}>
          <div
            className={`${styles.sectionTitle} flex items-center justify-between`}
            onClick={handleSportsToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, handleSportsToggle)}
          >
            <Icon
              name={"chevronDown"}
              className={`${styles.sectionIcon} duration-300 ${!isSportsOpen ? "-rotate-90" : ""}`}
            />
            <span className={`${styles.sectionLabel} flex-auto`}>sports</span>
            <span className={styles.badgeWrap}>
              <span className={styles.badge}>
                {sidebarConfig.sports.reduce((sum, s) => sum + s.count, 0)}
              </span>
            </span>
          </div>

          <motion.div
            className={styles.sportDropdown}
            initial={false}
            animate={
              isSportsOpen
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={DROPDOWN_TRANSITION}
          >
            <ul className={styles.subList}>
              {sidebarConfig.sports.length === 0 && (
                <li className="px-4 py-2 text-sm text-gray-500">
                  Loading sports...
                </li>
              )}
              {sidebarConfig.sports.map((sport, sportIndex) => (
                <SportItemComponent
                  key={sport.name + sportIndex}
                  sport={sport}
                  sportIndex={sportIndex}
                  openSportIndex={openSportIndex}
                  openTournamentKey={openTournamentKey}
                  onSportClick={handleSportClick}
                  onTournamentClick={handleTournamentClick}
                  isSportActive={isSportActive(sportIndex)}
                  activeTournamentIndex={activeTournamentIndexFor(sportIndex)}
                  activeThirdIndex={activeThirdIndexFor(sportIndex)}
                  onThirdItemActivate={handleThirdItemActivate}
                />
              ))}
            </ul>
          </motion.div>
        </li>
      </ul>
    </div>
  );
}