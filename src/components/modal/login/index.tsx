"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import style from "./style.module.css";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/useAuthStore";
// import { useToast } from "@/app/(pages)/components/toast/toast-context";
import { useRouter } from "next/navigation";
import { useCacheStore } from "@/lib/store/cacheStore";
import Icon from "@/icons/icons";
import Loader from "@/components/common/loader/loader";

export default function LoginModal() {
  const { loginModal, setLoginModal } = useCacheStore();
  const { theme } = useTheme();
  const { login } = useAuthStore();
  // const { showToast } = useToast();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({
    username: false,
    password: false,
  });
  const [apiError, setApiError] = useState("");

  const usernameError = touched.username && !username.trim();
  const passwordError = touched.password && !password.trim();
  const hasFormValues = !!username.trim() && !!password.trim();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [loginModal]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({
      username: true,
      password: true,
    });

    if (!username.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    try {
      const res = await login(username.trim().toLowerCase(), password);

      const ok =
        res === true ||
        (typeof res === "object" &&
          res !== null &&
          ((res as any).status === true || (res as any).success === true));

      const rawMessage =
        typeof (res as any)?.meta?.message === "string"
          ? (res as any).meta.message
          : "";

      const parts = rawMessage
        .split(/',\s*'/)
        .map((p: any) => p.replace(/^'+|'+$/g, "").trim());

      const msg = {
        status: parts[0] || "",
        title: parts[1] || "",
        desc: parts[2] || "",
      };

      if (ok) {
        // showToast(msg.status, msg.title, msg.desc);
        setLoginModal(false);

        if ((res as any)?.data?.userDetail?.isLogin === 0) {
          document.cookie = "forceChangePassword=true; path=/";
          router.replace("/change-password");
          return;
        }
      } else {
        // showToast(msg.status, msg.title, msg.desc);
        setApiError(msg.desc || "Invalid username or password");
      }

      setUsername("");
      setPassword("");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.meta?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed";
      setApiError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loginModal && isLoading) {
    return <Loader />;
  }

  return (
    <>
      {theme === "light" && (
        <div className="absolute inset-0 z-10 bg-black/50"></div>
      )}
      <section
        className={cn(
          "fixed! rounded-none! inset-0! z-9999 drawer!",
          theme === "dark"
            ? "apple-glass apple-glass-dark "
            : "apple-glass-light",

          // ✅ DESKTOP ONLY (does not touch mobile)
          "min-[900px]:p-12",
          "min-[900px]:overflow-y-auto",
        )}
      >
        {/* ✅ Desktop alignment wrapper (no mobile styles applied) */}
        <div className="min-[900px]:mx-auto min-[900px]:max-w-[1120px] min-[900px]:min-h-[calc(100vh-96px)] min-[900px]:flex min-[900px]:flex-col">
          {/* HEADER (mobile only — unchanged visually on mobile) */}
          {/* <div className="flex justify-between items-center px-4 min-[600]:px-6 h-12 min-[900px]:hidden"></div> */}

          {/* MAIN (mobile unchanged; desktop centered) */}
          <div
            className={cn(
              "flex flex-col max-[900]:pt-12 pb-4 min-[900]:flex-row w-full flex-1 basis-auto min-[900]:h-[calc(100vh-10px)]",
              // ✅ DESKTOP ONLY
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
              {/* LEFT SIDE (DESKTOP ONLY) */}
              <div
                className={cn(
                  "hidden min-[900px]:flex",
                  "px-14 py-14",
                  "items-center",
                )}
                style={{
                  background:
                    theme === "dark"
                      ? " linear-gradient(rgba(10, 17, 24, 0.59), rgba(15, 25, 35, 0))"
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
                      theme === "dark" ? "/logo-black.svg" : "/logo-white.svg"
                    }
                    alt="GJEXCH Logo"
                    width={360}
                    height={110}
                    className="object-contain w-auto h-20"
                    priority
                  />
                </div>
              </div>

              {/* RIGHT SIDE (mobile base preserved, desktop polished) */}
              <div
                className={cn(
                  "flex rounded-none! flex-col justify-center px-4 md:px-4 lg:px-4 flex-1 basis-auto max-[900px]:pt-6 min-[900px]:py-20",

                  // ✅ DESKTOP ONLY
                  "min-[900px]:py-14 min-[900px]:px-16",
                  "min-[900px]:bg-white/5 dark:min-[900px]:bg-black/10",
                  "min-[900px]:border-l min-[900px]:border-white/10",
                )}
              >
                <div className="md:mx-auto md:w-md xl:w-105 max-w-105 max-[900px]:max-w-105 max-[900px]:mt-[1px] min-[900px]:w-full min-[900px]:max-w-[520px]">
                  <form
                    className="space-y-5"
                    onSubmit={handleSubmit}
                    noValidate
                  >
                    {/* Heading */}
                    <div className="flex flex-col mb-[41px] gap-3.5 max-[900px]:items-center min-[900px]:items-start min-[900px]:mb-8">
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
                            alt="GJEXCH Logo"
                            width={152}
                            height={48}
                            className="object-contain min-[600]:mx-2 mx-1 w-[152px] h-[48px]"
                          />
                        </Link>
                      </div>
                      <h2 className="text-xl xl:text-[19px] font-bold max-[600px]:text-[18px] max-[900px]:text-[19px]">
                        Sign in to GJEXCH
                      </h2>
                    </div>

                    <div className="flex flex-col gap-6">
                      {/* USERNAME (UNCHANGED) */}
                      <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                        <label
                          htmlFor="username"
                          className={`font-semibold text-base leading-normal font-normal  leading-[1.57143] block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${
                            usernameError
                              ? "text-(--palette-error-main)"
                              : "text-(--palette-text-secondary)"
                          }`}
                        >
                          Username
                          <span className=""> *</span>
                        </label>
                        <div
                          className={cn(
                            "font-normal text-base leading-[1.4375em]  text-(--palette-text-primary) box-border cursor-text inline-flex items-center w-full relative rounded-lg group",
                            theme === "dark"
                              ? "liquid-field"
                              : "liquid-field-light",
                          )}
                        >
                          <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            id="username"
                            autoComplete="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() =>
                              setTouched((prev) => ({
                                ...prev,
                                username: true,
                              }))
                            }
                            aria-invalid={usernameError}
                            aria-describedby={
                              usernameError ? "username-helper-text" : undefined
                            }
                            className="font-[inherit] placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full max-[600px]:text-base text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0"
                          />
                          <fieldset
                            className={`text-left absolute top-[-5px] group-focus-within:border-2 pointer-events-none min-w-[0%] border overflow-hidden transition-[border-color] duration ease-in-out m-0 px-2 py-0 rounded-[inherit] border-solid bottom-0 inset-x-0 ${
                              usernameError
                                ? "border-(--palette-error-main)"
                                : "border-[rgba(var(--palette-grey-500Channel)_/_20%)] group-hover:border-(--palette-text-primary) group-focus-within:border-(--palette-text-primary)"
                            }`}
                          >
                            <legend className="w-18.75 overflow-hidden block h-[11px] text-[14px] invisible whitespace-nowrap max-w-full transition-[max-width] duration-100 ease-out delay-[50ms] p-0">
                              <span>Username *</span>
                            </legend>
                          </fieldset>
                        </div>
                        {usernameError && (
                          <div
                            className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)"
                            id="username-helper-text"
                          >
                            Can not be empty
                          </div>
                        )}
                      </div>

                      {/* PASSWORD (UNCHANGED) */}
                      <div className="inline-flex   flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                        <label
                          htmlFor="password"
                          className={`font-semibold text-base leading-normal font-normal  leading-[1.57143] block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${
                            passwordError
                              ? "text-(--palette-error-main)"
                              : "text-(--palette-text-secondary)"
                          }`}
                        >
                          Password
                          <span className=""> *</span>
                        </label>
                        <div
                          className={cn(
                            "font-normal liquid-field text-base leading-[1.4375em]  text-(--palette-text-primary) box-border cursor-text inline-flex items-center w-full relative rounded-lg group",
                            theme === "dark"
                              ? "liquid-field"
                              : "liquid-field-light",
                          )}
                        >
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            name="password"
                            id="password"
                            autoComplete="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() =>
                              setTouched((prev) => ({
                                ...prev,
                                password: true,
                              }))
                            }
                            aria-invalid={passwordError}
                            aria-describedby={
                              passwordError ? "password-helper-text" : undefined
                            }
                            className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0"
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setShowPassword((prev) => !prev)}
                            className={cn(
                              style.btn,
                              "top-1/2  -translate-y-1/2 right-0.5 text-(--palette-text-secondary)  cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center",
                            )}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true"
                                role="img"
                                className="h-5 w-5"
                                id="_r_4_"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"
                                ></path>
                                <path
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                aria-hidden="true"
                                role="img"
                                className="h-5 w-5"
                                id="_r_4_"
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            )}
                          </button>
                          <fieldset
                            className={`text-left absolute top-[-5px] pointer-events-none group-focus-within:border-2 min-w-[0%] border overflow-hidden transition-[border-color] duration ease-in-out m-0 px-2 py-0 rounded-[inherit] border-solid bottom-0 inset-x-0 ${
                              passwordError
                                ? "border-(--palette-error-main)"
                                : "border-[rgba(var(--palette-grey-500Channel)_/_20%)] group-hover:border-(--palette-text-primary) group-focus-within:border-(--palette-text-primary)"
                            }`}
                          >
                            <legend className="w-18.25 overflow-hidden block h-[11px] text-[14px] invisible whitespace-nowrap max-w-full transition-[max-width] duration-100 ease-out delay-[50ms] p-0">
                              <span>Password *</span>
                            </legend>
                          </fieldset>
                        </div>
                        {passwordError && (
                          <div
                            className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)"
                            id="password-helper-text"
                          >
                            Can not be empty
                          </div>
                        )}
                      </div>

                      {/* API Error Toast (UNCHANGED) */}
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

                      {/* Login Button (UNCHANGED) */}
                      <button
                        type="submit"
                        disabled={!hasFormValues || isSubmitting}
                        // className={`w-full rounded-lg relative p-[6px_12px] min-h-9 text-sm font-bold h-[48px] ${
                        //   hasFormValues && !isSubmitting
                        //     ? "bg-(--primary-color) text-white cursor-pointer hover:bg-(--login-btn-hover)"
                        //     : "bg-[rgba(145,158,171,0.24)] text-(--secondary-text-color) cursor-not-allowed"
                        // }`}
                        className={cn(
                          "w-full rounded-lg relative p-[6px_12px] min-h-9 text-sm font-bold h-[48px] bg-(--primary-color) text-white cursor-pointer disabled:cursor-not-allowed",
                          hasFormValues &&
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
                          "Login"
                        )}
                      </button>

                      {/* Go to Home (UNCHANGED) */}
                      {/* <Link
                        href="/"
                        onClick={() => setLoginModal(false)}
                        className="w-full rounded-[8px] cursor-pointer shadow-(--customShadows-z8)
  font-bold text-[15px] py-3.5 h-[48px] inline-flex justify-center items-center bg-(--gth-btn-bg) text-white dark:text-black"
                      >
                        <span className="max-[600px]:translate-y-[-0.5px]">
                          {" "}
                          Go to Home
                        </span>
                      </Link> */}
                      <Link
                        href={"/"}
                        onClick={() => setLoginModal(false)}
                        className="text-center text-sm gap-1 flex justify-center items-center"
                      >
                        <Icon name={'back'} width={16} height={16} className="text-(--primary-color)"/>
                        <span className="text-(--primary-color)">
                          Return to Homepage
                        </span>
                      </Link>
                    </div>
                  </form>
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
