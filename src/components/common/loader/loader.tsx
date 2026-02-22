import styles from "./loader.module.css";
import Link from "next/link";
import Image from "next/image";

const Loader = () => {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.cssContainer}>
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
                src="/logo.png"
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
