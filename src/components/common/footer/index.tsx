import Image from "next/image";
import { CONFIG } from "@/lib/config";
import Link from "next/link";
import dynamic from "next/dynamic";
const LanguageToggler = dynamic(() => import("@/components/common/language-toggler"));

export default function Footer() {
  return (
    <>
      <div className="mt-5">
        <div className="w-full flex flex-col  max-[900px]:rounded-[16px] rounded-t-xl bg-(--palette-background-paper) text-(--palette-text-primary) border  border-[rgba(145,158,171,0.2)] p-2 max-[900px]:p-4 max-[900px]:pb-0 overflow-hidden">
          {/* TOP SECTION */}
          <div className="flex flex-col-reverse mb-[7px]  max-[900px]:justify-center min-[900px]:gap-[11px]  min-[900px]:flex-row">
            {/* LEFT BLOCK */}
            <div className="min-[900px]:w-62.5 w-full min-w-[250px] flex items-center justify-center">
              <div className="md:mb-[3.5px] text-center w-44 mx-auto lg:mb-0  max-[900px]:flex max-[900px]:flex-col max-[900px]:justify-center">
                <Image
                  src="/footer-ic/secure.svg"
                  alt="Secure"
                  width={106}
                  height={54}
                  className="mb-[0px] lg:mb-0  mx-auto"
                />

                <p className="mt-[9px] text-[13px] mb-[1px] font-semibold leading-[19px] dark:text-[white] lg:mt-2">
                  100% SAFE
                </p>

                <p className="mb-[7px] max-[899px]:mb-[9px] text-[13px] leading-[19px] dark:text-[white] lg:mb-2  max-[900px]:w-[176px]">
                  Protected connection and encrypted data.
                </p>

                {/* <div className="flex flex-col">
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
                </div> */}

                <div className="inline-block mt-2 relative min-[900px]:hidden mx-auto">
                  <LanguageToggler />
                </div>
              </div>
            </div>

            {/* RIGHT BLOCK */}
            <div className="md:ml-1 lg:ml-[5px] min-w-0 flex-1 ">
              {/* LINKS */}

              {/* DESCRIPTION */}
              <div className="min-[900px]:pt-2   max-[900]:text-xs  text-[13px] leading-[20px] text-(--palette-text-secondary) dark:border-[rgba(145,158,171,0.2)] ">
                This website is operated by{" "}
                <span className="text-[14px] text-[#098DEE]">
                  Rich Able Developments Limited
                </span>
                , registered under No. 92605 at{" "}
                <span className="text-[14px] text-[#098DEE]">Samoa</span>.
                website is licensed and regulated by{" "}
                <span className="text-[14px] text-[#098DEE]">
                  Anjouan eGaming
                </span>{" "}
                , license No.{" "}
                <span className="text-[14px] text-[#098DEE]">
                  ALSI-202510012-FI1
                </span>
                <span>
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
              <div className="flex justify-center mt-2 max-[900px]:hidden">
                <LanguageToggler />
              </div>
            </div>
          </div>

          {/* POLICY LINKS */}
          <div className="flex flex-wrap justify-center gap-x-2 max-[899px]:px-4 min-[900px]:gap-x-4 py-2 max-[900px]:mt-[16px] text-[12px] min-[900px]:text-[13px] font-medium text-[var(--palette-text-secondary)]">
            {[
              { name: "About", href: "/about" },
              { name: "Contact Us", href: "/contact-us" },
              { name: "Responsible Gambling", href: "/responsible-gambling" },
              { name: "AML", href: "/aml-policy" },
              { name: "KYC Policy", href: "/kyc-policy" },

              // 👇 Now Terms section after these
              { name: "Terms & Conditions", href: "/terms-and-conditions" },
              { name: "Betting Rules", href: "betting-rules" },
              { name: "Dispute Resolution", href: "/dispute-resolution" },
              {
                name: "Fairness & RNG Testing Methods",
                href: "/fairness-and-rng",
              },
              { name: "Accounts", href: "/apb" },
              { name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Self-Exclusion", href: "/self-exclusion" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="hover:underline hover:text-[var(--palette-primary-main)] cursor-pointer py-1"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* COPYRIGHT */}
          <div className="mt-1 max-[900]:-mx-4 flex justify-center bg-[#919EAB29] py-1 max-[900px]:mt-[16px] text-xs font-bold text-(--palette-text-secondary)">
            <p className="flex gap-[2px]">
              Copyright © {new Date().getFullYear()} &nbsp;
              <a
                href={CONFIG.domain}
                className="cursor-pointer text-[#098DEE] hover:underline relative left-[1px]"
              >
                100exch.
              </a>{" "}
              &nbsp; &nbsp; All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Copyright © "2026"   &nbsp All rights reserved.
