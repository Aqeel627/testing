"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useCacheStore } from "@/lib/store/cacheStore";
import dynamic from "next/dynamic";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "../../common/input-otp";

const Loader = dynamic(() => import("@/components/common/loader/loader"));

interface TwoFAModalProps {
  username?: string;
  role?: string;
  onVerify?: (code: string) => Promise<boolean>;
  onBack?: () => void;
}

export default function TwoFAModal({
  username = "testdeal",
  role = "Administrator",
  onVerify,
  onBack,
}: TwoFAModalProps) {
  const { loginModal, setLoginModal } = useCacheStore();
  const { theme } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [apiError, setApiError] = useState("");
  const [shake, setShake] = useState(false);

  const hasFullCode = otpValue.length === 6;

  // ✅ Lock body scroll when modal is open (prevents background from scrolling)
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [loginModal]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleSubmit = async () => {
    if (!hasFullCode || isSubmitting) return;
    setIsSubmitting(true);
    setApiError("");
    try {
      if (onVerify) {
        const success = await onVerify(otpValue);
        if (!success) {
          setApiError("Invalid verification code. Please try again.");
          triggerShake();
          setOtpValue("");
        }
      }
    } catch (error: any) {
      setApiError(
        error?.response?.data?.meta?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Verification failed",
      );
      triggerShake();
      setOtpValue("");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loginModal && isLoading) return <Loader />;

  return (
    <>
      {theme === "light" && (
        <div className="absolute inset-0 z-10 bg-black/50"></div>
      )}
      <section
        className={cn(
          "fixed! rounded-none! inset-0! z-9999 drawer!",
          "overflow-hidden",
          theme === "dark"
            ? "apple-glass apple-glass-dark"
            : "apple-glass-light",
          "min-[900px]:p-12",
          "min-[900px]:overflow-y-auto",
        )}
      >
        <div className="min-[900px]:mx-auto min-[900px]:max-w-[1120px] min-[900px]:min-h-[calc(100vh-96px)] min-[900px]:flex min-[900px]:flex-col">
          {/* HEADER — mobile only, identical to LoginModal */}
          <div className="flex justify-between items-center px-4 min-[600]:px-6 h-12 min-[900px]:hidden">
            <Link
              href="/"
              onClick={() => setLoginModal(false)}
              className="flex items-center"
            >
              <Image
                src={
                  theme === "dark"
                    ? "/logo-black.svg"
                    : "/logo-white.svg"
                }
                alt="100exch Logo"
                width={152}
                height={1000}
                className="object-contain h-13 min-[600]:mx-2 mx-1"
              />
            </Link>
          </div>

          {/* MAIN — identical to LoginModal */}
          <div
            className={cn(
              "flex flex-col max-[900]:pt-12 pb-4 min-[900]:flex-row w-full flex-1 basis-auto min-[900]:h-[calc(100vh-10px)]",
              "min-[900px]:h-auto min-[900px]:flex-1 min-[900px]:items-center min-[900px]:justify-center min-[900px]:pb-0",
            )}
          >
            <div
              className={cn(
                "contents",
                "min-[900px]:block min-[900px]:w-full min-[900px]:max-w-[1120px]",
                "min-[900px]:grid min-[900px]:grid-cols-[480px_1fr]",
                "min-[900px]:rounded-3xl min-[900px]:overflow-hidden",
                "min-[900px]:border min-[900px]:border-white/10",
                "min-[900px]:shadow-2xl",
              )}
            >
              {/* LEFT SIDE — 100% identical to LoginModal */}
              <div
                className={cn(
                  "hidden min-[900px]:flex",
                  "px-14 py-14",
                  "items-center",
                )}
                style={{
                  background:
                    theme === "dark"
                      ? "linear-gradient(rgba(10, 17, 24, 0.59), rgba(15, 25, 35, 0));"
                      : "linear-gradient(180deg, rgba(244,246,248,0.92) 0%, rgba(244,246,248,0.40) 100%), url('/background-3-blur.webp')",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full flex flex-col justify-center gap-10">
                  <h2 className="text-[40px] leading-[1.08] font-extrabold tracking-tight">
                    Hi, Welcome back
                  </h2>
                  <Image
                    src={
                      theme === "dark"
                        ? "/logo-white.svg"
                        : "/logo-black.svg"
                    }
                    alt="100exch Logo"
                    width={360}
                    height={110}
                    className="object-contain w-auto h-20"
                    priority
                  />
                </div>
              </div>

              {/* RIGHT SIDE — same padding/flex as LoginModal */}
              <div
                className={cn(
                  "flex rounded-none! flex-col justify-center px-4 md:px-4 lg:px-4 flex-1 basis-auto max-[900px]:pt-6 min-[900]:py-20",
                  "min-[900px]:py-14 min-[900px]:px-16",
                  "min-[900px]:bg-white/5 dark:min-[900px]:bg-black/10",
                  "min-[900px]:border-l min-[900px]:border-white/10",
                )}
              >
                <div className="md:mx-auto md:w-md xl:w-105 max-w-105 max-[900px]:max-w-105 max-[900px]:mt-[1px] min-[900px]:w-full min-[900px]:max-w-[520px]">
                  <div className="space-y-5">
                    {/* Heading */}
                    <div className="flex flex-col mb-[24px] gap-2 items-center min-[900px]:mb-6">
                      {/* Lock icon */}
                      <div
                        className={cn(
                          "w-11 h-11 rounded-full flex items-center justify-center",
                          theme === "dark"
                            ? "bg-[rgba(255,255,255,0.07)] border border-white/10"
                            : "bg-[rgba(0,0,0,0.05)] border border-black/10",
                        )}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 1C9.243 1 7 3.243 7 6v2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6c0-2.757-2.243-5-5-5zm0 2c1.654 0 3 1.346 3 3v2H9V6c0-1.654 1.346-3 3-3zm0 9a2 2 0 1 1 0 4a2 2 0 0 1 0-4z"
                            fill="var(--primary-color, #3b82f6)"
                          />
                        </svg>
                      </div>
                      {/* Title */}
                      <h2 className="text-xl xl:text-[19px] font-bold max-[600px]:text-[18px] max-[900px]:text-[19px]">
                        Two-Factor{" "}
                        <span
                          style={{ color: "var(--primary-color, #3b82f6)" }}
                        >
                          Authentication
                        </span>
                      </h2>
                      <p className="text-sm text-(--palette-text-secondary) leading-relaxed max-[900px]:text-center min-[900px]:text-left">
                        Enter the 6-digit code from your authenticator app
                      </p>
                    </div>

                    {/* Fields wrapper */}
                    <div className="flex flex-col gap-4">
                      {/* User Info Card */}
                      <div
                        className={cn(
                          "flex items-center justify-between px-4 py-2.5 rounded-xl backdrop-blur-[6px]",
                          theme === "dark"
                            ? "bg-[rgba(255,255,255,0.05)] border border-white/10"
                            : "bg-[rgba(0,0,0,0.04)] border border-black/8",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{
                              background: "var(--primary-color, #3b82f6)",
                            }}
                          >
                            {username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-(--palette-text-primary) leading-tight">
                              {username}
                            </p>
                            <p className="text-xs text-(--palette-text-secondary) leading-tight mt-0.5">
                              {role}
                            </p>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                            theme === "dark"
                              ? "bg-[rgba(16,185,129,0.12)] border-[rgba(16,185,129,0.3)] text-emerald-400"
                              : "bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-emerald-600",
                          )}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M12 1l8 3v7c0 5.25-3.5 10.15-8 11.5C7.5 21.15 4 16.25 4 11V4l8-3z" />
                          </svg>
                          High Security
                        </span>
                      </div>

                      {/*  otp inpu shedcn */}
                      <style>{`
                     
                      `}</style>
                      <div
                        className={cn(
                          "flex justify-center twofa-otp-group",
                        )}
                        style={
                          shake
                            ? { animation: "twofa-shake 0.6s ease-in-out" }
                            : {}
                        }
                      >
                        <InputOTP
                          maxLength={6}
                          value={otpValue}
                          onChange={(val) => {
                            setOtpValue(val);
                            setApiError("");
                          }}
                        >
                          <InputOTPGroup className="gap-2.5">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                              <InputOTPSlot
                                key={i}
                                index={i}
                                className={cn(
                                  // size
                                  "md:w-11 w-10 md:h-[52px]  h-[45px] text-[1.3rem] font-bold",
                                  // shape — override shadcn's connected-pill style
                                  " border-2!",
                                  " border-l-2!",
                                  // colors
                                  theme === "dark"
                                    ? "bg-[rgba(255,255,255,0.06)] text-(--palette-text-primary) border-white/15!"
                                    : "bg-[rgba(0,0,0,0.04)] text-(--palette-text-primary) border-black/15!",
                                  // error state
                                  apiError
                                    ? "border-(--palette-error-main)!"
                                    : "",
                                  // filled state
                                  otpValue[i] && !apiError
                                    ? "border-(--primary-color)! shadow-[0_0_0_3px_rgba(59,130,246,0.15)]"
                                    : "",
                                  // active/focused state
                                  "data-[active=true]:border-(--primary-color)! data-[active=true]:ring-0! data-[active=true]:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]",
                                )}
                              />
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      {/* if error */}
                      {apiError && (
                        <div className="text-(--palette-error-lighter) bg-(--palette-error-darker) shadow-(--Paper-shadow) bg-none font-normal text-sm leading-[1.57143] flex px-4 py-1.5 rounded-lg">
                          <div className="flex text-[22px] text-(--palette-error-light) opacity-100 mr-3 px-0 py-1.75">
                            <svg
                              className="select-none w-[1em] h-[1em] inline-block shrink-0 fill-current text-2xl transition-[fill] duration-300 ease-in-out"
                              focusable="false"
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M7.843 3.802C9.872 2.601 10.886 2 12 2c1.114 0 2.128.6 4.157 1.802l.686.406c2.029 1.202 3.043 1.803 3.6 2.792c.557.99.557 2.19.557 4.594v.812c0 2.403 0 3.605-.557 4.594c-.557.99-1.571 1.59-3.6 2.791l-.686.407C14.128 21.399 13.114 22 12 22c-1.114 0-2.128-.6-4.157-1.802l-.686-.407c-2.029-1.2-3.043-1.802-3.6-2.791C3 16.01 3 14.81 3 12.406v-.812C3 9.19 3 7.989 3.557 7c.557-.99 1.571-1.59 3.6-2.792zM13 16a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-1-9.75a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                          <div className="min-w-0 overflow-auto px-0 py-2">
                            {apiError}
                          </div>
                        </div>
                      )}

                      {/* Verify Code Button — identical structure to Login button */}
                      <button
                        type="button"
                        disabled={!hasFullCode || isSubmitting}
                        onClick={handleSubmit}
                        className={cn(
                          "w-full rounded-lg relative p-[6px_12px] min-h-9 text-sm font-bold h-[48px] bg-(--primary-color) text-white cursor-pointer disabled:cursor-not-allowed",
                          hasFullCode &&
                          !isSubmitting &&
                          "hover:bg-(--primary-color-dark)",
                        )}
                      >
                        {isSubmitting ? (
                          <span className="contents">
                            <span className="absolute visible flex -translate-2/4 text-(--palette-action-disabled) left-2/4 top-2/4">
                              <span className="h-4 w-4 inline-block submitLoader">
                                <svg
                                  className="block text-(--palette-action-disabled)"
                                  viewBox="22 22 44 44"
                                >
                                  <circle
                                    className="visible text-(--palette-action-disabled) circleAnimation"
                                    cx="44"
                                    cy="44"
                                    r="20.2"
                                    fill="none"
                                    strokeWidth="3.6"
                                  ></circle>
                                </svg>
                              </span>
                            </span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Verify Code
                          </span>
                        )}
                      </button>

                      {/* Back to Login — identical structure to Go to Home button */}
                      <button
                        type="button"
                        onClick={onBack}
                        className="w-full rounded-[8px] cursor-pointer shadow-(--customShadows-z8) font-bold text-[15px] py-3.5 h-[48px] inline-flex justify-center items-center bg-(--gth-btn-bg) text-white dark:text-black gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                        <span className="max-[600px]:translate-y-[-0.5px]">
                          Back to Login
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP ONLY: guaranteed bottom breathing space */}
          <div className="hidden min-[900px]:block h-2" />
        </div>
      </section>
    </>
  );
}