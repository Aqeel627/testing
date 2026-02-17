import React from "react";
import styles from "./loader.module.css";
import Link from "next/link";
import Image from "next/image";

const loader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.cssContainer}>
        <div className={styles.loaderContainer}>
          <div className={styles.loaderContainer}>
            <span style={{ transform: "scale(0.900699)", opacity: 0.483634 }}>
              <Link
                className={styles.loaderImageContainer}
                aria-label="Logo"
                href="/"
                data-discover="true"
              >
                <Image
                  alt="brand logo"
                  width={1}
                  height={1}
                  src="/brand_logo_dark.png?v=9"
                  style={{ width: "100%", height: "100%" }}
                  className={styles.LoaderImg}
                />
              </Link>
            </span>
            <span
              className={styles.loaderSpan}
              style={{
                transform: "scale(1.2475) rotate(111.375deg)",
                borderRadius: "25%",
              }}
            ></span>

            <span
              className={styles.loaderBorder}
              style={{
                transform: "scale(1.2475) rotate(111.375deg)",
                borderRadius: "25%",
              }}
            ></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loader;
