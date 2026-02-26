"use client";

import styles from "./loader.module.css";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const Loader = () => {
  const { theme } = useTheme();
  return (
    <div className={styles.loaderWrapper}>
      <div
        className={cn(
          theme === "dark"
            ? "apple-glass apple-glass-dark "
            : "apple-glass-light",
          styles.cssContainer,
        )}
      >
        <div className={styles.loaderContainer}>
          {/* Logo */}
          <span className={styles.logoAnim}>
            <Link
              className={styles.loaderImageContainer}
              aria-label="Logo"
              href="/"
              data-discover="true"
            >
              <Image
                alt="brand logo"
                src={theme === "dark" ? "/logo-black.svg" : "/logo-white.svg"}
                width={152}
                height={44}
                priority
                sizes="152px"
                className={styles.LoaderImg}
              />
            </Link>
          </span>

          {/* Inner Ring */}
          <span className={styles.loaderSpan}></span>

          {/* Outer Ring */}
          <span className={styles.loaderBorder}></span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
