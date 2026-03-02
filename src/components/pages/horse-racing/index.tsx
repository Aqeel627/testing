"use client";

import Image from "next/image";
import { useState } from "react";
import Icon from "@/icons/icons";
import styles from "./style.module.css";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const HorsePage = () => {
  const flagExtensions: Record<string, "png" | "svg"> = {
    GB: "svg",
    USA: "png",
    UAE: "svg",
    AU: "png",
    FRA: "svg",
    IN: "png",
    IE: "svg",
    RSA: "png",
  };

  const { theme } = useTheme();
  const [activeItem, setActiveItem] = useState("ALL");
  const [activeTimes, setActiveTimes] = useState<Record<number, string>>({});

  const handleClick = (sectionIndex: number, time: string) => {
    setActiveTimes((prev) => ({ ...prev, [sectionIndex]: time }));
  };

  const items = ["ALL", "GB", "RSA", "UAE", "NZ", "FRA", "IN", "IE", "TODAY"];

  const sections = [
    { title: "Southwell", times: ["1:00", "1:30", "2:00", "0:00", "0:30"] },
    { title: "Huntingdon", times: ["19:15", "19:45", "20:15", "20:45", "21:15", "21:45", "22:15"] },
    { title: "Ffos Las", times: ["19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"] },
  ];

  return (
    <div className={styles["app-container"]}>

      {/* HEADER */}
      <div className={styles["page-header"]}>
        {/* <img
          src="/Muybridge_race_horse_animated.gif"
          alt="Running"
          className={`${styles["real-horse"]} ${styles["horse-left"]}`}
        /> */}

        <img
          src="/Muybridge_race_horse_animated.gif"
          alt="Running"
          className={cn(
            `${styles["real-horse"]} ${styles["horse-left"]}`,
            theme === "light" && styles["real-horse-light"]
          )}
        />

        <h1 >HORSE RACING</h1>

        {/* <img
          src="/Muybridge_race_horse_animated.gif"
          alt="Running Horse Right"
          className={`scale-x-[-1] scale-y-[1] ${styles["real-horse"]} ${styles["horse-right"]}`}
        /> */}

        <img
          src="/Muybridge_race_horse_animated.gif"
          alt="Running"
          className={cn(
            `scale-x-[-1] scale-y-[1] ${styles["real-horse"]} ${styles["horse-left"]}`,
            theme === "light" && styles["real-horse-light"]
          )}
        />
      </div>

      {/* FILTER BAR */}
      <div className={styles["filter-bar"]}>
        {items.map((item, idx) => {
          const isActive = activeItem === item;
          const isToday = item === "TODAY";

          return (
            <div
              key={idx}
              className={`${styles["filter-item"]} ${isActive ? styles.active : ""} ${isToday ? "ml-auto" : ""}`}
              onClick={() => setActiveItem(item)}
            >
              {item !== "ALL" && !isToday && (
                <Image
                  src={`/flags/${item}.${flagExtensions[item] ?? "png"}`}
                  alt={item}
                  width={14}
                  height={14}
                  loading="lazy"
                  className={styles["flag-icon"]}
                />
              )}
              <span className={styles["filter-text"]}> {item}</span>
              {isToday && (
                <Icon name="questionArrow" className={`${styles["filter-text"]} h-4 w-4`} />
              )}
            </div>
          );
        })}
      </div>

      {/* SKELETON CARDS */}

      {/* EVENT CARDS */}
      <div className={styles["events-container"]}>
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles["glass-card"]}>
            <div className={styles["venue-title"]}>{section.title}</div>
            <div className={styles["market-times-grid"]}>
              {section.times.map((time, i) => (
                <div
                  key={i}
                  className={`${styles["time-pill"]} ${activeTimes[sectionIndex] === time ? styles["time-pillActive"] : ""
                    }`}
                  onClick={() => handleClick(sectionIndex, time)}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default HorsePage;