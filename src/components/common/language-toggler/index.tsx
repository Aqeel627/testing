"use client";
import { useEffect, useRef, useState } from "react";
import { parseCookies, setCookie } from "nookies";

const COOKIE_NAME = "googtrans";
interface LanguageDescriptor {
  name: string;
  title: string;
}
declare global {
  namespace globalThis {
    var __GOOGLE_TRANSLATION_CONFIG__: {
      languages: LanguageDescriptor[];
      defaultLanguage: string;
    };
  }
}
interface GoogleTranslationConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
  countryLanguages: Record<string, string>; // <-- add this
}
const translationConfig =
  globalThis.__GOOGLE_TRANSLATION_CONFIG__ as GoogleTranslationConfig;

const LanguageToggler = () => {
  const [languageConfig, setLanguageConfig] = useState<any>();
  const [language, setLanguage] = useState("English");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  async function getUserCountry(): Promise<string> {
    try {
      const res = await fetch(
        "https://pro.ip-api.com/json/?key=qSA5ctYZHdWsx04",
      );
      const data = await res.json();
      // console.log('User country code:', data.countryCode);
      return data.countryCode;
    } catch (err) {
      console.error("Failed to detect country", err);
      return "US";
    }
  }
  function reorderLanguagesByCountry(
    languages: LanguageDescriptor[],
    countryCode: string,
  ) {
    const defaultLang = translationConfig?.defaultLanguage || "en";
    const localLang = translationConfig?.countryLanguages[countryCode] || "";
    const english = languages?.find((l) => l.name === defaultLang);
    const local =
      localLang && localLang !== defaultLang
        ? languages?.find((l) => l.name === localLang)
        : null;
    const others = languages?.filter(
      (l) => l.name !== defaultLang && l.name !== localLang,
    );
    return [english, local, ...(others?.length ? others : [])].filter(Boolean);
  }

  const handleSelectLanguage = (lang: any, name: any) => {
    setLanguage(lang);
    setOpen(false);

    // Expire old googtrans cookie
    const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";

    document.cookie = `googtrans=; ${expire}; path=/;`;
    document.cookie = `googtrans=; ${expire}; domain=.yourdesign.live; path=/;`;

    // Set new googtrans cookie
    const cookieValue = `/auto/${name}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; domain=.yourdesign.live; path=/;`;

    // Also store in your app’s cookie (if you want)
    setCookie(null, COOKIE_NAME, cookieValue, { path: "/" });

    // Refresh to apply translation
    window.location.reload();
  };

  useEffect(() => {
    // console.log('Translation config:', language);

    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue: any;
    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }

    if (globalThis.__GOOGLE_TRANSLATION_CONFIG__ && !languageValue) {
      languageValue = globalThis.__GOOGLE_TRANSLATION_CONFIG__?.defaultLanguage;
    }
    const languageTitle =
      globalThis.__GOOGLE_TRANSLATION_CONFIG__?.languages?.find(
        (lang) => lang.name === languageValue,
      )?.title || languageValue;

    if (languageValue) {
      setLanguage(languageTitle);
      // console.log("Set language from cookie or default:", languageTitle);
    }

    if (globalThis.__GOOGLE_TRANSLATION_CONFIG__) {
      setLanguageConfig(globalThis.__GOOGLE_TRANSLATION_CONFIG__);
    }
    if (globalThis.__GOOGLE_TRANSLATION_CONFIG__) {
      // console.log('Loaded languages:', globalThis.__GOOGLE_TRANSLATION_CONFIG__.languages);
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div id="languageToggler.tsx">
    <div
      className="flex w-fit relative"
      ref={dropdownRef}
    >
      <div className="relative">
        {open && (
          <div
            className="arrow"
            style={{
              position: "absolute",
              left: "50%",
              top: "48px",
              transform: "translateX(-50%)",
            }}
          ></div>
        )}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex flex-col justify-between items-center px-3 py-0.5 border bg-transparent border-[rgba(145,158,171,0.2)] dark:border-gray-600 rounded-[8px] text-sm font-medium text-[#919EAB] dark:text-[#637381] transition hover:bg-[rgba(145,158,171,0.12)]"
        >
          <p className="text-[12px] text-(--palette-text-secondary)">
            Language
          </p>
          <p className="text-[14px] text-(--palette-text-primary)">
            {language}
          </p>
        </button>

        {/* Dropdown Menu */}
        {open && (
          <ul
            translate="no"
            className="absolute mt-2 -ml-1 h-30! rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)]  text-(--palette-text-primary) z-50 overflow-y-auto no-scrollbar"
          >
            {languageConfig?.map((lang: any) => (
              <li key={lang.title}>
                <button
                  onClick={() => handleSelectLanguage(lang.title, lang.name)}
                  className={`text-sm w-full text-left relative bg-transparent cursor-pointer gap-2 font-semibold  transition p-3 rounded-none  
                           ${language === lang.title
                      ? "bg-[#2e3e49]! text-white"
                      : "hover:bg-[rgba(145,158,171,0.08)]"
                    }`}
                >
                  {lang.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default LanguageToggler;
