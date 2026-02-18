"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { type MouseEvent, useState } from "react";
import styles from "./sidebar.module.css";
import { useAppStore } from "@/lib/store/store";
import Link from "next/link";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/store/ui-store";

// Type definitions
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

interface QuickLinkItemProps {
  label: string;
  href: string;
  count: number;
  icon: React.ReactNode;
  pathName: string;
  isActive: boolean;
  onActivate: () => void;
  onClose: () => void;
}

const QuickLinkItem = ({
  label,
  href,
  count,
  icon,
  pathName,
  isActive,
  onActivate,
  onClose,
}: QuickLinkItemProps) => (
  <li className={styles.item}>
    <Link
      href={href}
      className={cn(
        styles.link,
        (pathName?.includes(href) || isActive) && styles.linkActive,
      )}
      onClick={() => {
        onActivate();
        onClose();
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

// ─── ThirdItemComponent ───────────────────────────────────────────────────────
interface ThirdItemComponentProps {
  item: ThirdItem;
  isActive: boolean;
  onActivate: () => void;
}

const ThirdItemComponent = ({
  item,
  isActive,
  onActivate,
}: ThirdItemComponentProps) => (
  <li className={styles.navItemLi}>
    <Link
      href={item.href || "#"}
      className={cn(styles.navLink, isActive && styles.activeSubItem)}
      onClick={() => {
        // ✅ FIX 1: removed e.preventDefault() — navigation now works
        // onActivate already calls closeSidebar via handleThirdItemActivate
        onActivate();
      }}
    >
      <span className={styles.thirdItemText}>{item.name}</span>
      <span className={styles.badgeWrap}>
        <span className={styles.badge}>{item.count}</span>
      </span>
    </Link>
  </li>
);

// ─── TournamentItemComponent ──────────────────────────────────────────────────
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

  // ✅ FIX 2: pull closeSidebar here so leaf tournaments can close the sidebar
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  return (
    <li className={styles.navItemLi}>
      <Link
        href={hasThirdItems ? "#" : tournament.href || "#"}
        className={cn(styles.navLink, isTournamentActive && styles.activeSubItem)}
        onClick={
          hasThirdItems
            ? (e) => onTournamentClick(e, sportIndex, tournamentIndex)
            : () => closeSidebar() // ✅ FIX 2: leaf tournament closes sidebar on navigate
        }
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
      </Link>

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

// ─── SportItemComponent ───────────────────────────────────────────────────────
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
      <Link
        href={sport.href || "#"}
        className={cn(styles.link, isSportActive && styles.linkActive)}
        onClick={(e) => onSportClick(e, sportIndex)}
      >
        <span className={styles.linkIconWrap}>
          <span
            className={styles.sportImage}
            style={{ "--sport-icon": `url(${sport.iconUrl})` } as CSSProperties}
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
      </Link>

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
              isTournamentActive={isSportActive && activeTournamentIndex === tIndex}
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

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
interface SidebarProps {
  config?: SidebarConfig;
}

export default function Sidebar({ config }: SidebarProps) {
  const pathName = usePathname();
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(true);
  const [isSportsOpen, setIsSportsOpen] = useState(true);
  const [openSportIndex, setOpenSportIndex] = useState<number | null>(null);
  const [openTournamentKey, setOpenTournamentKey] = useState<string | null>(null);
  const { inplayEvents } = useAppStore();
  const toggleSearch = useUIStore((s) => s.toggleSearch);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  const [active, setActive] = useState<ActiveState>({ type: null });

  const defaultConfig: SidebarConfig = {
    sports: [
      {
        name: "Cricket",
        iconUrl: "/sidebar/ic_cricket.svg",
        count: 6,
        tournaments: [
          {
            name: "Ford Trophy",
            count: 1,
            thirdItems: [{ name: "Central Stags v Canterbury Kings", count: 1 }],
          },
          {
            name: "ICC Men's T20 World Cup",
            count: 1,
            thirdItems: [{ name: "Otago Volts v Auckland Aces", count: 1 }],
          },
        ],
      },
      {
        name: "Soccer",
        iconUrl: "/sidebar/ic_football.svg",
        count: 22,
        tournaments: [
          {
            name: "Premier League",
            count: 22,
            thirdItems: [{ name: "Arsenal v Chelsea", count: 22 }],
          },
          {
            name: "La Liga",
            count: 18,
            thirdItems: [{ name: "Barcelona v Sevilla", count: 18 }],
          },
        ],
      },
    ],
    quickLinks: [
      {
        label: "Inplay",
        href: "/inplay",
        count: inplayEvents?.totalLength,
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

  const sidebarConfig = config || defaultConfig;

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
    closeSidebar();
  };

  const handleSportClick = (
    event: MouseEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    event.preventDefault();
    setOpenTournamentKey(null);
    setOpenSportIndex((prev) => (prev === index ? null : index));
    setActive({ type: "sport", sportIndex: index });
    closeSidebar();
  };

  const handleTournamentClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sportIndex: number,
    tournamentIndex: number,
  ) => {
    event.preventDefault();
    const key = `${sportIndex}-${tournamentIndex}`;
    setOpenTournamentKey((prev) => (prev === key ? null : key));
    setActive({ type: "sport", sportIndex, tournamentIndex });
    closeSidebar();
  };

  const handleThirdItemActivate = (
    sportIndex: number,
    tournamentIndex: number,
    thirdIndex: number,
  ) => {
    setActive({ type: "sport", sportIndex, tournamentIndex, thirdIndex });
    closeSidebar();
  };

  const isQuickLinkActive = (label: string) =>
    active.type === "quicklink" && active.qlLabel === label;

  const isSportActive = (sportIndex: number) =>
    active.type === "sport" && active.sportIndex === sportIndex;

  const activeTournamentIndexFor = (sportIndex: number): number | null => {
    if (active.type !== "sport" || active.sportIndex !== sportIndex) return null;
    return active.tournamentIndex !== undefined ? active.tournamentIndex : null;
  };

  const activeThirdIndexFor = (sportIndex: number): number | null => {
    if (active.type !== "sport" || active.sportIndex !== sportIndex) return null;
    return active.thirdIndex !== undefined ? active.thirdIndex : null;
  };

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
          className={`${styles.searchWrapper} lg:hidden!`}
          onClick={handleSearchToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => handleKeyDown(e, handleSearchToggle)}
        >
          <div className={styles.searchBtn}>
            <Icon name={"search"} className={styles.searchIcon} />
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
                  pathName={pathName}
                  isActive={isQuickLinkActive(link.label)}
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