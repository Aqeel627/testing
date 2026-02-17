"use client";

import Image from "next/image";
import Icon from "@/icons/icons";
import { useState } from "react";
const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिंदी" },
  { value: "bn", label: "বাংলা" },
  { value: "kn", label: "ಕನ್ನಡ" },
  { value: "ml", label: "മലയാളം" },
  { value: "mr", label: "मराठी" },
  { value: "ne", label: "नेपाली" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
  { value: "ta", label: "தமிழ்" },
  { value: "te", label: "తెలుగు" },
  { value: "ur", label: "اردو" },
  { value: "ru", label: "Русский" },
];
export default function Footer() {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [isOpen, setIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLanguageClick = (event: any) => {
    setAnchorEl(event.currentTarget);
    setIsOpen(true);
  };

  const handleLanguageSelect = (language: any) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className="mt-5">
        <div className="w-full flex flex-col  max-[900px]:rounded-t-[16px] rounded-t-xl bg-(--palette-background-paper) text-(--palette-text-primary) border  border-[rgba(145,158,171,0.2)] p-2 max-[900px]:p-4">
          {/* TOP SECTION */}
          <div className="flex flex-col-reverse  max-[900px]:items-center min-[900px]:gap-[11px]  min-[900px]:flex-row">
            {/* LEFT BLOCK */}
            <div className="min-[900px]:w-62.5 w-full min-w-[250px]">
              <div className="md:mb-[3.5px] w-44  max-[899px]:mx-auto lg:mb-0  max-[900px]:flex max-[900px]:flex-col max-[900px]:justify-center">
                <Image
                  src="/secure-ssl-3.webp"
                  alt="Secure"
                  width={106}
                  height={54}
                  className="mb-[0px] lg:mb-0  "
                />

                <p className="mt-[9px] text-[13px] mb-[1px] font-semibold leading-[19px] dark:text-[white] lg:mt-2">
                  100% SAFE
                </p>

                <p className="mb-[7px] max-[899px]:mb-[9px] text-[13px] leading-[19px] dark:text-[white] lg:mb-2  max-[900px]:w-[176px]">
                  Protected connection and encrypted data.
                </p>

                <div className="flex flex-col">
                  <span className="inline-flex max-[899px]:mb-[3px]    justify-center items-center h-[24px] rounded bg-[rgba(var(--palette-primary-mainChannel)_/_16%)]   text-[12px] font-bold leading-[19px] text-(--palette-primary-light)">
                    Payment Gateways
                  </span>

                  <div className="mb-2 mt-[9px] px-1 flex max-[900px]:justify-center items-center gap-[4px] min-[900px]gap-[4px] relative max-[899px]:top-[-2px]">
                    <Icon name="crossPay" className="h-5 w-5 " />
                    <Icon name="gPay" className="h-5 w-11 ml-1 mr-1" />
                    <Icon name="upi" className="h-[24px] w-[53px] max-[899px]:hidden" />
                    <Icon
                      name="home"
                      className="h-5 w-5 max-[899px]:ml-[12px] ml-[5px]"
                    />
                  </div>
                </div>

                <div className="inline-block mt-2 relative min-[900px]:hidden mx-auto">
                  <button
                    type="button"
                    onClick={handleLanguageClick}
                    className="flex flex-col justify-between items-center px-3 py-0.75 pb-0.5 border bg-[rgba(145,158,171,0.08)] border-[rgba(145,158,171,0.2)] dark:border-gray-600 rounded-[8px] text-sm font-medium text-[#919EAB] dark:text-[#637381] transition hover:bg-[rgba(145,158,171,0.12)]"
                  >
                    <p className="text-[12px] relative top-[1px]">Language</p>
                    <p className="text-[14px] text-white relative -top-[1px]">
                      {selectedLanguage}
                    </p>
                  </button>

                  {/* Dropdown Menu */}
                  {isOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={handleClose}
                      />
                      <div className="absolute -left-[72px] mt-1 -bottom-15 p-[4px] z-50 min-w-[160px] rounded-lg bg-[#1C252E] -top-88 shadow-lg  h-[95vh]">
                        {languages.map((lang) => (
                          <button
                            key={lang.value}
                            onClick={() => handleLanguageSelect(lang.label)}
                            className={`w-full h-[48px] rounded-[6px] text-left text-white px-2 py-2 mb-1 text-[14px] transition ${
                              selectedLanguage === lang.label
                                ? "bg-[rgba(145,158,171,0.16)] text-white font-semibold"
                                : "text-white hover:bg-[rgba(145,158,171,0.08)]"
                            }`}
                          >
                            <span className="relative top-[-1px]">
                              {lang.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT BLOCK */}
            <div className="md:ml-1 lg:ml-[5px]  ">
              {/* LINKS */}
              <div className="footer-items max-[600px]:pb-4 min-[600px]:mb-2 flex justify-center gap-4  whitespace-nowrap text-center text-[14px] font-medium text-(--palette-text-secondary)  md:justify-start md:text-start">
                {[
                  "About",
                  "Contact Us",
                  "Responsible Gambling",
                  "AML",
                  "KYC Policy",
                ].map((item, i) => (
                  <a
                    key={i}
                    href="#"
                    className={`cursor-pointer text-wrap max-[600]:text-[13px]  font-normal content-center hover:underline hover:text-(--palette-primary-main) ${
                      i !== 3 && ""
                    } md:px-2 lg:px-0`}
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* DESCRIPTION */}
              <div className=" border-t min-[900px]:pt-2 pt-4 border-dashed border-[rgba(145,158,171,0.2)]  text-[13px] leading-[20.9px] text-(--palette-text-secondary) dark:border-[rgba(145,158,171,0.2)] ">
                This website is operated by{" "}
                <span className="text-[14px] text-[#098DEE]">Au Exch</span>,
                registered under No. at{" "}
                <span className="text-[14px] text-[#098DEE]">Curaçao</span>.
                This website is licensed and regulated by{" "}
                <span className="text-[14px] text-[#098DEE]">Curaçao</span>
                ,eGaming, license No.{" "}
                <span className="text-[14px] ">
                  . In order to register for this website, the user is required
                  to accept the General Terms and Conditions. In the event the
                  General Terms and Conditions are updated, existing users may
                  choose to discontinue using the products and services before
                  the said update shall become effective, which is a minimum of
                  two weeks after it has been announced.
                </span>
              </div>

              {/* DESKTOP LANGUAGE SELECT */}
              {/* <div className="hidden md:block mt-2">
                        <select className="rounded   px-2 py-3 text-xs border  border-[rgba(145,158,171,0.2)]">
                           <option>English</option>
                           <option>Urdu</option>
                        </select>
                     </div> */}
              <div className="inline-block mt-2 relative max-[900px]:hidden">
                <button
                  type="button"
                  onClick={handleLanguageClick}
                  className="flex flex-col justify-between items-center px-3 py-0.5 border bg-transparent border-[rgba(145,158,171,0.2)] dark:border-gray-600 rounded-[8px] text-sm font-medium text-[#919EAB] dark:text-[#637381] transition hover:bg-[rgba(145,158,171,0.12)]"
                >
                  <p className="text-[12px] text-(--palette-text-secondary)">
                    Language
                  </p>
                  <p className="text-[14px] text-(--palette-text-primary)">
                    {selectedLanguage}
                  </p>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={handleClose} />
                    <div className="absolute left-0 mt-1 -bottom-15 p-[3px] z-50 min-w-[160px] rounded-lg bg-[rgba(var(--palette-background-paperChannel)_/_90%)]  text-(--palette-text-primary) css-4uzy5s">
                      {languages.map((lang) => (
                        <button
                          key={lang.value}
                          onClick={() => handleLanguageSelect(lang.label)}
                          className={`w-full rounded-[8px] text-left px-4 py-2 text-[14px] transition ${
                            selectedLanguage === lang.label
                              ? "bg-[rgba(145,158,171,0.16)]"
                              : " hover:bg-[rgba(145,158,171,0.08)]"
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* POLICY LINKS */}
          <div className="flex flex-wrap justify-center gap-x-2 max-[899px]:px-4 min-[900px]:gap-x-4  py-2 max-[900px]:mt-[16px] text-[12px] min-[900px]:text-[13px] font-medium text-(--palette-text-secondary) ">
            {[
              "Terms & Conditions",
              "Betting Rules",
              "Dispute Resolution",
              "Fairness & RNG Testing Methods",
              "Accounts, Payouts and Bonuses",
              "Privacy Policy",
              "Self-Exclusion",
            ].map((item, i) => (
              <a
                key={i}
                className="hover:underline hover:text-[#098DEE] cursor-pointer py-1"
              >
                {item}
              </a>
            ))}
          </div>

          {/* COPYRIGHT */}
          <div className="mt-1 flex justify-center bg-[#919EAB29] py-1 max-[900px]:mt-[16px] text-xs font-bold text-(--palette-text-secondary)">
            <p className="flex gap-[2px]">
              Copyright © 2026 &nbsp;
              <span className="cursor-pointer text-[#098DEE] hover:underline relative left-[1px]">
                AuExch.
              </span>{" "}
              &nbsp; &nbsp; All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* SMALL SCREEN FIX */}
      <style jsx global>{`
        @media (max-width: 374px) {
          .footer-items {
            font-size: 10px !important;
          }
        }
      `}</style>
    </>
  );
}

// Copyright © "2026"   &nbsp All rights reserved.
