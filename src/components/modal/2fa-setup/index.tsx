"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useCacheStore } from "@/lib/store/cacheStore";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../common/input-otp";

interface TwoFASetupModalProps {
  onComplete?: () => void;
  onSkip?: () => void;
}

const MOCK_SECRET = "zx9m qwer tyu8 dfgh jk3l lmno pqrs vwxy";

function DownloadBtn({ href, icon, label, theme }: { href: string; icon: React.ReactNode; label: string; theme: string | undefined }) {
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200",
        theme === "dark"
          ? "bg-[rgba(255,255,255,0.07)] border-white/12 hover:bg-[rgba(255,255,255,0.12)] text-(--palette-text-primary)"
          : "bg-[rgba(0,0,0,0.05)] border-black/10 hover:bg-[rgba(0,0,0,0.09)] text-(--palette-text-primary)",
      )}
    >
      {icon}{label}
    </a>
  );
}

export default function TwoFASetupModal({ onComplete, onSkip }: TwoFASetupModalProps) {
  const { setLoginModal } = useCacheStore();
  const { theme } = useTheme();
  const [step, setStep]         = useState<1 | 2>(1);
  const [otpValue, setOtpValue] = useState("");
  const [copied, setCopied]     = useState(false);
  const [apiError, setApiError] = useState("");
  const hasFullCode = otpValue.length === 6;

  const copySecret = async () => {
    await navigator.clipboard.writeText(MOCK_SECRET.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* ── identical to LoginModal ── */}
      {theme === "light" && <div className="absolute inset-0 z-10 bg-black/50" />}

      {/* ═══════════════════════════════════════════════════════════════════
          SECTION — word-for-word identical to LoginModal
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        className={cn(
          "fixed! rounded-none! inset-0! z-9999 drawer!",
          theme === "dark" ? "apple-glass apple-glass-dark" : "apple-glass-light",
          "min-[900px]:p-12",
          "min-[900px]:overflow-y-auto",
        )}
      >
        {/* Desktop alignment wrapper — identical to LoginModal */}
        <div className="min-[900px]:mx-auto min-[900px]:max-w-[1120px] min-[900px]:min-h-[calc(100vh-96px)] min-[900px]:flex min-[900px]:flex-col">

          {/* HEADER — mobile only, identical to LoginModal */}
          <div className="relative flex justify-between items-center px-4 min-[600]:px-6 h-12 min-[900px]:hidden">
            <Link href="/" onClick={() => setLoginModal(false)} className="flex items-center">
              <Image src={theme === "dark" ? "/logo-black.svg" : "/logo-white.svg"} alt="100exch Logo" width={152} height={1000}   loading="lazy" className="object-contain h-13 min-[600]:mx-2 mx-1" />
            </Link>
          </div>

          {/* MAIN — identical to LoginModal */}
          <div className={cn(
            "flex flex-col max-[900]:pt-12 pb-4 min-[900]:flex-row w-full flex-1 basis-auto min-[900]:h-[calc(100vh-10px)]",
            "min-[900px]:h-auto min-[900px]:flex-1 min-[900px]:items-center min-[900px]:justify-center min-[900px]:pb-0",
          )}>
            {/* Grid card — identical to LoginModal */}
            <div className={cn(
              "contents",
              "min-[900px]:block min-[900px]:w-full min-[900px]:max-w-[1120px]",
              "min-[900px]:grid min-[900px]:grid-cols-[480px_1fr]",
              "min-[900px]:rounded-3xl min-[900px]:overflow-hidden",
              "min-[900px]:border min-[900px]:border-white/10",
              "min-[900px]:shadow-2xl",
            )}>

              {/* ── LEFT SIDE — identical to LoginModal ── */}
              <div
                className={cn("hidden min-[900px]:flex", "px-14 py-14", "items-center")}
                style={{
                  background: theme === "dark"
                    ? "linear-gradient(rgba(10,17,24,0.59), rgba(15,25,35,0))"
                    : "linear-gradient(180deg, rgba(244,246,248,0.92) 0%, rgba(244,246,248,0.40) 100%), url('/background-3-blur.webp')",
                  backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center",
                }}
              >
                <div className="w-full relative flex flex-col justify-center gap-10">
                  <h2 className="text-[40px] leading-[1.08] font-extrabold tracking-tight">Hi, Welcome back</h2>
                  <Image src={theme === "dark" ? "/logo-black.svg" : "/logo-white.svg"} alt="100exch Logo" width={360} height={110} loading="lazy"  className="object-contain w-auto h-20" priority />
                </div>
              </div>

              {/* ── RIGHT SIDE — outer classes identical to LoginModal ── */}
              <div className={cn(
                "flex rounded-none! flex-col justify-center px-4 md:px-4 lg:px-4 flex-1 basis-auto max-[900px]:pt-6 min-[900]:py-20",
                "min-[900px]:py-14 min-[900px]:px-16",
                "min-[900px]:bg-white/5 dark:min-[900px]:bg-black/10",
                "min-[900px]:border-l min-[900px]:border-white/10",
              )}>
                <div className="md:mx-auto md:w-md xl:w-105 max-w-105 max-[900px]:max-w-105 max-[900px]:mt-[1px] min-[900px]:w-full min-[900px]:max-w-[520px]">

                  {/* ─────────────────────────────────────────────────────
                      All content sits inside space-y-4. No extra padding.
                      No min-h. Content is compact enough that it fits
                      inside LoginModal's natural right-panel height.
                  ───────────────────────────────────────────────────── */}
                  <div className="space-y-4">

                    {/* Heading — centered, compact */}
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      {/* Icon */}
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center mb-0.5",
                        theme === "dark" ? "bg-[rgba(255,255,255,0.07)] border border-white/10" : "bg-[rgba(0,0,0,0.05)] border border-black/10",
                      )}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none">
                          <path d="M12 1l8 3v7c0 5.25-3.5 10.15-8 11.5C7.5 21.15 4 16.25 4 11V4l8-3z" fill="var(--primary-color, #3b82f6)" />
                        </svg>
                      </div>

                      <h2 className="text-xl xl:text-[19px] font-bold max-[600px]:text-[18px]">
                        Two-Factor <span style={{ color: "var(--primary-color, #3b82f6)" }}>Authentication</span>
                      </h2>
                      <p className="text-xs text-(--palette-text-secondary)">
                        Secure your account with an authenticator app
                      </p>

                      {/* Step dots */}
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full bg-(--primary-color) transition-all duration-300", step === 1 ? "scale-125 ring-2 ring-(--primary-color)/30" : "scale-100")} />
                        <span className={cn("w-6 h-px transition-all duration-300", step === 2 ? "bg-(--primary-color)" : "bg-white/15")} />
                        <span className={cn("w-2 h-2 rounded-full transition-all duration-300", step === 2 ? "bg-(--primary-color) scale-125 ring-2 ring-(--primary-color)/30" : "bg-white/20")} />
                      </div>
                    </div>

                    {/* ═══════════════════════════
                        STEP 1 — Install App
                    ═══════════════════════════ */}
                    {step === 1 && (
                      <div className="flex flex-col gap-3">
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--palette-text-secondary)">
                          Step 1 of 2 — Install the app
                        </p>

                        <p className="text-xs text-(--palette-text-secondary) leading-relaxed">
                          First, you'll need to install an authenticator app on your mobile device.
                        </p>

                        {/* App card — compact */}
                        <div className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl border",
                          theme === "dark" ? "bg-[rgba(255,255,255,0.05)] border-white/10" : "bg-[rgba(0,0,0,0.03)] border-black/8",
                        )}>
                          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%)" }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                              <path d="M12 1l8 3v7c0 5.25-3.5 10.15-8 11.5C7.5 21.15 4 16.25 4 11V4l8-3z" fill="#4fc3f7" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-(--palette-text-primary) leading-tight">Auth Rooms</p>
                            <p className="text-[11px] text-(--palette-text-secondary) mt-0.5">Required · Free · iOS &amp; Android</p>
                            <p className="text-[11px] mt-1" style={{ color: "var(--primary-color, #3b82f6)" }}>
                              This is the only authenticator app supported by our system
                            </p>
                          </div>
                        </div>

                        {/* Download buttons */}
                        <div className="flex gap-2">
                          <DownloadBtn href="#" theme={theme} label="Download for iOS"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
                          />
                          <DownloadBtn href="#" theme={theme} label="Download for Android"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0 0 12 1.5c-.96 0-1.86.23-2.66.63L7.88.65c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.3A5.983 5.983 0 0 0 6 7h12a5.983 5.983 0 0 0-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/></svg>}
                          />
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-2.5 pt-1">
                          <button type="button" onClick={() => setStep(2)}
                            className="w-full rounded-lg relative p-[6px_12px] min-h-9 text-sm font-bold h-[48px] bg-(--primary-color) text-white cursor-pointer hover:bg-(--primary-color-dark) transition-colors duration-200">
                            <span className="flex items-center justify-center gap-2">
                              I have the app installed
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                            </span>
                          </button>
                          <button type="button" onClick={onSkip}
                            className="w-full rounded-[8px] cursor-pointer shadow-(--customShadows-z8) font-bold text-[15px] py-3.5 h-[48px] inline-flex justify-center items-center bg-(--gth-btn-bg) text-white dark:text-black">
                            <span className="max-[600px]:translate-y-[-0.5px]">Skip for now</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* ═══════════════════════════
                        STEP 2 — Scan & Verify
                    ═══════════════════════════ */}
                    {step === 2 && (
                      <div className="flex flex-col gap-3">
                        <style>{`
                          @keyframes twofa-scan {
                            0%   { top: 6px;  opacity: 1; }
                            90%  { top: 74px; opacity: 1; }
                            100% { top: 74px; opacity: 0; }
                          }
                          .twofa-scan-line { animation: twofa-scan 2s ease-in-out infinite; }
                        `}</style>

                        <p className="text-[10px] font-semibold uppercase tracking-widest text-(--palette-text-secondary)">
                          Step 2 of 2 — Scan &amp; Verify
                        </p>

                        {/* QR + secret — single row side by side to save vertical space */}
                        <div className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl border",
                          theme === "dark" ? "bg-[rgba(255,255,255,0.04)] border-white/10" : "bg-[rgba(0,0,0,0.03)] border-black/8",
                        )}>
                          {/* Scanner frame — 88px, same height as app card */}
                          <div className="relative w-[88px] h-[88px] flex-shrink-0 flex items-center justify-center">
                            {([
                              { pos: "top-0 left-0",     bw: "2px 0 0 2px", br: "3px 0 0 0" },
                              { pos: "top-0 right-0",    bw: "2px 2px 0 0", br: "0 3px 0 0" },
                              { pos: "bottom-0 left-0",  bw: "0 0 2px 2px", br: "0 0 0 3px" },
                              { pos: "bottom-0 right-0", bw: "0 2px 2px 0", br: "0 0 3px 0" },
                            ] as const).map(({ pos, bw, br }, idx) => (
                              <span key={idx} className={cn("absolute w-3.5 h-3.5 pointer-events-none", pos)}
                                style={{ border: `solid var(--primary-color, #3b82f6)`, borderWidth: bw, borderRadius: br }} />
                            ))}
                            <span className="twofa-scan-line absolute left-1 right-1 h-[1.5px] rounded-full pointer-events-none z-10"
                              style={{ background: "linear-gradient(90deg, transparent, var(--primary-color, #3b82f6), transparent)", boxShadow: "0 0 5px var(--primary-color, #3b82f6)" }} />
                            <div className="w-[74px] h-[74px] rounded-md overflow-hidden bg-white flex items-center justify-center">
                              <svg width="66" height="66" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8"  y="8"  width="30" height="30" rx="3" fill="#111"/>
                                <rect x="13" y="13" width="20" height="20" rx="2" fill="white"/>
                                <rect x="18" y="18" width="10" height="10" rx="1" fill="#111"/>
                                <rect x="82" y="8"  width="30" height="30" rx="3" fill="#111"/>
                                <rect x="87" y="13" width="20" height="20" rx="2" fill="white"/>
                                <rect x="92" y="18" width="10" height="10" rx="1" fill="#111"/>
                                <rect x="8"  y="82" width="30" height="30" rx="3" fill="#111"/>
                                <rect x="13" y="87" width="20" height="20" rx="2" fill="white"/>
                                <rect x="18" y="92" width="10" height="10" rx="1" fill="#111"/>
                                {[[48,8],[60,8],[72,8],[48,14],[66,14],[54,20],[48,26],[72,26],[8,48],[32,48],[48,48],[72,48],[96,48],[108,48],[8,54],[38,54],[60,54],[84,54],[8,60],[54,60],[78,60],[108,60],[8,66],[48,66],[72,66],[108,66],[8,72],[38,72],[66,72],[108,72],[48,84],[72,84],[90,84],[54,90],[78,90],[48,96],[84,96],[66,102],[48,108],[72,108],[96,108]].map(([x,y],i)=>(
                                  <rect key={i} x={x} y={y} width="5" height="5" rx="0.5" fill="#111"/>
                                ))}
                              </svg>
                            </div>
                          </div>

                          {/* Right: label + secret key */}
                          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                            <p className="text-[11px] text-(--palette-text-secondary) leading-tight">
                              Can't scan? Enter this code manually:
                            </p>
                            <div className={cn(
                              "flex items-center justify-between gap-1.5 px-2 py-1.5 rounded-lg border font-mono text-[10px] tracking-wider",
                              theme === "dark" ? "bg-[rgba(255,255,255,0.05)] border-white/10 text-(--palette-text-primary)" : "bg-[rgba(0,0,0,0.04)] border-black/8 text-(--palette-text-primary)",
                            )}>
                              <span className="truncate">{MOCK_SECRET}</span>
                              <button type="button" onClick={copySecret}
                                className={cn("flex-shrink-0 p-0.5 rounded transition-all duration-200", copied ? "text-emerald-500" : "text-(--palette-text-secondary) hover:text-(--palette-text-primary)")}
                                aria-label="Copy secret key">
                                {copied
                                  ? <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                  : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                }
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* OTP label + input — single compact row */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-shrink-0">
                            <p className="text-xs font-semibold text-(--palette-text-primary) leading-tight">6-digit code</p>
                            <p className="text-[10px] text-(--palette-text-secondary) mt-0.5 leading-tight">From your authenticator app</p>
                          </div>
                          <InputOTP maxLength={6} value={otpValue} onChange={(val) => { setOtpValue(val); setApiError(""); }}>
                            <InputOTPGroup className="gap-1.5">
                              {[0,1,2,3,4,5].map((i) => (
                                <InputOTPSlot key={i} index={i}
                                  className={cn(
                                    "w-9 h-10 text-base font-bold",
                                    "border-2! border-l-2!",
                                    theme === "dark"
                                      ? "bg-[rgba(255,255,255,0.06)] text-(--palette-text-primary) border-white/15!"
                                      : "bg-[rgba(0,0,0,0.04)] text-(--palette-text-primary) border-black/15!",
                                    apiError ? "border-(--palette-error-main)!" : "",
                                    otpValue[i] && !apiError ? "border-(--primary-color)! shadow-[0_0_0_2px_rgba(59,130,246,0.15)]" : "",
                                    "data-[active=true]:border-(--primary-color)! data-[active=true]:ring-0! data-[active=true]:shadow-[0_0_0_2px_rgba(59,130,246,0.15)]",
                                  )}
                                />
                              ))}
                            </InputOTPGroup>
                          </InputOTP>
                        </div>

                        {/* API error */}
                        {apiError && (
                          <div className="text-(--palette-error-lighter) bg-(--palette-error-darker) font-normal text-sm leading-[1.57143] flex px-4 py-1.5 rounded-lg">
                            <div className="flex text-[22px] text-(--palette-error-light) opacity-100 mr-3 px-0 py-1.75">
                              <svg className="select-none w-[1em] h-[1em] inline-block shrink-0 fill-current text-2xl" focusable="false" aria-hidden="true" viewBox="0 0 24 24">
                                <path fill="currentColor" fillRule="evenodd" d="M7.843 3.802C9.872 2.601 10.886 2 12 2c1.114 0 2.128.6 4.157 1.802l.686.406c2.029 1.202 3.043 1.803 3.6 2.792c.557.99.557 2.19.557 4.594v.812c0 2.403 0 3.605-.557 4.594c-.557.99-1.571 1.59-3.6 2.791l-.686.407C14.128 21.399 13.114 22 12 22c-1.114 0-2.128-.6-4.157-1.802l-.686-.407c-2.029-1.2-3.043-1.802-3.6-2.791C3 16.01 3 14.81 3 12.406v-.812C3 9.19 3 7.989 3.557 7c.557-.99 1.571-1.59 3.6-2.792zM13 16a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-1-9.75a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75" clipRule="evenodd"/>
                              </svg>
                            </div>
                            <div className="min-w-0 overflow-auto px-0 py-2">{apiError}</div>
                          </div>
                        )}

                        {/* Buttons */}
                        <div className="flex flex-col gap-2.5 pt-1">
                          <button type="button" disabled={!hasFullCode} onClick={() => hasFullCode && onComplete?.()}
                            className={cn(
                              "w-full rounded-lg relative p-[6px_12px] min-h-9 text-sm font-bold h-[48px]",
                              "bg-(--primary-color) text-white cursor-pointer disabled:cursor-not-allowed",
                              hasFullCode && "hover:bg-(--primary-color-dark) transition-colors duration-200",
                            )}>
                            <span className="flex items-center justify-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              Verify &amp; Enable 2FA
                            </span>
                          </button>
                          <button type="button" onClick={() => setStep(1)}
                            className="w-full rounded-[8px] cursor-pointer shadow-(--customShadows-z8) font-bold text-[15px] py-3.5 h-[48px] inline-flex justify-center items-center bg-(--gth-btn-bg) text-white dark:text-black gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                            <span className="max-[600px]:translate-y-[-0.5px]">Back</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </div>{/* end space-y-4 */}
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP ONLY: identical to LoginModal */}
          <div className="hidden min-[900px]:block h-2" />
        </div>
      </section>
    </>
  );
}