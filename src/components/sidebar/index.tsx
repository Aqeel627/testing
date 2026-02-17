"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { type MouseEvent, useState } from "react";
import styles from "./sidebar.module.css";
import { useAppStore } from "@/lib/store/ui-store";
import Link from "next/link";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

// Type definitions for better type safety
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

const DROPDOWN_TRANSITION = {
  height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
  opacity: { duration: 0.2, ease: "easeOut" as const },
};

// Component for quick link items
interface QuickLinkItemProps {
  label: string;
  href: string;
  count: number;
  icon: React.ReactNode;
  pathName:string
}

const QuickLinkItem = ({ label, href, count, icon, pathName }: QuickLinkItemProps) => (
  <li className={styles.item}>
    <Link href={href} className={cn(styles.link,pathName===href&&styles.linkActive)}>
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

// Component for third level items
interface ThirdItemComponentProps {
  item: ThirdItem;
}

const ThirdItemComponent = ({ item }: ThirdItemComponentProps) => (
  <li className={styles.navItemLi}>
    <a className={styles.navLink} href={item.href || "#"}>
      <span className={styles.thirdItemText}>{item.name}</span>
      <span className={styles.badgeWrap}>
        <span className={styles.badge}>{item.count}</span>
      </span>
    </a>
  </li>
);

// Component for tournament items (second level)
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
}

const TournamentItemComponent = ({
  tournament,
  sportIndex,
  tournamentIndex,
  openTournamentKey,
  onTournamentClick,
}: TournamentItemComponentProps) => {
  const tKey = `${sportIndex}-${tournamentIndex}`;
  const hasThirdItems = tournament.thirdItems.length > 0;

  return (
    <li className={styles.navItemLi}>
      <a
        className={styles.navLink}
        href={hasThirdItems ? "#" : tournament.href}
        onClick={
          hasThirdItems
            ? (e) => onTournamentClick(e, sportIndex, tournamentIndex)
            : undefined
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
      </a>

      {/* Third Items Dropdown */}
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
              <ThirdItemComponent key={idx} item={item} />
            ))}
          </ul>
        </motion.div>
      )}
    </li>
  );
};

// Component for sport items (first level)
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
}

const SportItemComponent = ({
  sport,
  sportIndex,
  openSportIndex,
  openTournamentKey,
  onSportClick,
  onTournamentClick,
}: SportItemComponentProps) => {
  const isOpen = openSportIndex === sportIndex;

  return (
    <li className={styles.item} key={sport.name + sportIndex}>
      <a
        className={styles.link}
        href={sport.href || "#"}
        onClick={(e) => onSportClick(e, sportIndex)}
      >
        <span className={styles.linkIconWrap}>
          <span
            className={styles.sportImage}
            style={
              {
                "--sport-icon": `url(${sport.iconUrl})`,
              } as CSSProperties
            }
          ></span>
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

      {/* Tournaments Dropdown */}
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
            />
          ))}
        </ul>
      </motion.div>
    </li>
  );
};

// Main Sidebar Component
interface SidebarProps {
  config?: SidebarConfig;
}

export default function Sidebar({ config }: SidebarProps) {
  const pathName = usePathname();
  const [isQuickLinksOpen, setIsQuickLinksOpen] = useState(true);
  const [isSportsOpen, setIsSportsOpen] = useState(true);
  const [openSportIndex, setOpenSportIndex] = useState<number | null>(null);
  const [openTournamentKey, setOpenTournamentKey] = useState<string | null>(
    null,
  );
  const toggleSearch = useAppStore((s) => s.toggleSearch);

  // Default config if none provided
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
            thirdItems: [
              { name: "Central Stags v Canterbury Kings", count: 1 },
            ],
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
        href: "/inplay/all",
        count: 22,
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

  const handleQuickLinksToggle = () => {
    setIsQuickLinksOpen((prev) => !prev);
  };

  const handleSportClick = (
    event: MouseEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    event.preventDefault();
    setOpenTournamentKey(null);
    setOpenSportIndex((prev) => (prev === index ? null : index));
  };

  const handleTournamentClick = (
    event: MouseEvent<HTMLAnchorElement>,
    sportIndex: number,
    tournamentIndex: number,
  ) => {
    event.preventDefault();
    const key = `${sportIndex}-${tournamentIndex}`;
    setOpenTournamentKey((prev) => (prev === key ? null : key));
  };

  const handleSearchToggle = () => {
    toggleSearch(true);
  };

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
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  count={link.count}
                  icon={link.icon}
                  pathName={pathName}
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
                />
              ))}
            </ul>
          </motion.div>
        </li>
      </ul>
    </div>
  );
}
