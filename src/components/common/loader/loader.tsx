"use client";

import styles from "./loader.module.css";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const Loader = () => {
  const { theme } = useTheme();

  return (
    <div className={styles.loaderWrapper}>
      <div
        className={cn(
          theme === "dark"
            ? "apple-glass apple-glass-dark"
            : "apple-glass-light",
          styles.cssContainer
        )}
      >
<div className={styles.ringContainer}>

  <span className={styles.ringTrack}></span>

  <span className={`${styles.ringArc} ${styles.arc1}`}></span>
  <span className={`${styles.ringArc} ${styles.arc2}`}></span>
  <span className={`${styles.ringArc} ${styles.arc3}`}></span>
  <span className={`${styles.ringArc} ${styles.arc4}`}></span>
  <span className={`${styles.ringArc} ${styles.arc5}`}></span>
  <span className={`${styles.ringArc} ${styles.arc6}`}></span>

  <span className={styles.ringGlow}></span>
<span className={styles.innerThinRing}></span>
  {/* <span className={styles.innerThin}></span> */}
  <div className={styles.ringInner}></div>

  {/* <div className={styles.logoSlot}>
    <Link href="/" aria-label="Logo">
      <Image
        src={theme === "dark" ? "/logo-black.svg" : "/logo-white.svg"}
        alt="brand logo"
        width={120}
        height={40}
        priority
      />
    </Link>
  </div> */}
  <span className={styles.logoAnim}>
  <Link
    href="/"
    aria-label="Logo"
    className={styles.loaderImageContainer}
  >
    <Image
      src={theme === "dark" ? "/logo-black.svg" : "/logo-white.svg"}
      alt="brand logo"
      width={152}
      height={44}
      priority
      sizes="152px"
      className={styles.LoaderImg}
    />
  </Link>
</span>

</div>
      </div>
    </div>
  );
};

export default Loader;