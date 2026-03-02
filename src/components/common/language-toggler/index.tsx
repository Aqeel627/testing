"use client";
import { useEffect, useRef, useState } from "react";
import { parseCookies, setCookie } from "nookies";

const COOKIE_NAME = "googtrans";

interface LanguageDescriptor {
  name: string;
  title: string;
}

interface GoogleTranslationConfig {
  languages: LanguageDescriptor[];
  defaultLanguage: string;
  countryLanguages?: Record<string, string>;
}

declare global {
  interface Window {
    __GOOGLE_TRANSLATION_CONFIG__?: GoogleTranslationConfig;
  }
}

const LanguageToggler = () => {
  const [languageConfig, setLanguageConfig] = useState<LanguageDescriptor[]>([]);
  const [language, setLanguage] = useState<string>("English");
  const [open, setOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  function reorderLanguages(languages: LanguageDescriptor[]) {
    const defaultLang =
      window.__GOOGLE_TRANSLATION_CONFIG__?.defaultLanguage || "en";

    const english = languages.find((l) => l.name === defaultLang);
    const others = languages.filter((l) => l.name !== defaultLang);

    return [english, ...others].filter(Boolean) as LanguageDescriptor[];
  }

  const handleSelectLanguage = (title: string, langCode: string) => {
    setLanguage(title);
    setOpen(false);

    const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Remove old cookie
    document.cookie = `googtrans=; ${expire}; path=/;`;
    document.cookie = `googtrans=; ${expire}; path=/;`;

    // Set new cookie
    const cookieValue = `/auto/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;

    setCookie(null, COOKIE_NAME, cookieValue, { path: "/" });

    window.location.reload();
  };

  useEffect(() => {
    if (!window.__GOOGLE_TRANSLATION_CONFIG__) return;

    const { languages, defaultLanguage } =
      window.__GOOGLE_TRANSLATION_CONFIG__;

    const reordered = reorderLanguages(languages);
    setLanguageConfig(reordered);

    const cookies = parseCookies();
    const existingLanguageCookieValue = cookies[COOKIE_NAME];

    let languageValue: string | undefined;

    if (existingLanguageCookieValue) {
      const sp = existingLanguageCookieValue.split("/");
      if (sp.length > 2) {
        languageValue = sp[2];
      }
    }

    if (!languageValue) {
      languageValue = defaultLanguage;
    }

    const languageTitle =
      languages.find((lang) => lang.name === languageValue)?.title ||
      languageValue;

    setLanguage(languageTitle);
  }, []);

  useEffect(() => {
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
    <div id="languageToggler">
      <div className="flex w-fit relative" ref={dropdownRef}>
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

          {open && (
            <ul
              translate="no"
              className="absolute mt-2 -ml-1 max-h-40 rounded-sm shadow-lg bg-[rgba(var(--palette-background-paperChannel)/90%)] text-(--palette-text-primary) z-50 overflow-y-auto no-scrollbar"
            >
              {languageConfig.map((lang) => (
                <li key={lang.name}>
                  <button
                    onClick={() =>
                      handleSelectLanguage(lang.title, lang.name)
                    }
                    className={`text-sm w-full text-left bg-transparent cursor-pointer font-semibold transition p-3 rounded-none
                      ${
                        language === lang.title
                          ? "bg-[#2e3e49] text-white"
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