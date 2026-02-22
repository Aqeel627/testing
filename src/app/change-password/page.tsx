"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import style from "./style.module.css";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const Loader = dynamic(() => import("@/components/common/loader/loader"));

export default function ChangePassword() {
  const { theme } = useTheme();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Show/Hide password states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Input values
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Validations
  const oldPasswordError = touched.oldPassword && !oldPassword.trim();
  const newPasswordError = touched.newPassword && !newPassword.trim();
  const confirmPasswordEmptyError = touched.confirmPassword && !confirmPassword.trim();
  const confirmPasswordMatchError = touched.confirmPassword && confirmPassword.trim() !== "" && confirmPassword !== newPassword;

  const confirmPasswordError = confirmPasswordEmptyError || confirmPasswordMatchError;

  const hasFormValues =
    !!oldPassword.trim() &&
    !!newPassword.trim() &&
    !!confirmPassword.trim() &&
    newPassword === confirmPassword;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (!hasFormValues) {
      return;
    }

    setIsSubmitting(true);
    setApiError("");

    // API Call Simulate
    try {
      setTimeout(() => {
        setIsSubmitting(false);
        // Modal close karwane ka logic ya redirect
        router.push("/");
      }, 1000);
    } catch (error) {
       setApiError("Something went wrong");
       setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {theme === "light" && <div className="absolute inset-0 z-10 bg-black/50"></div>}
      
      <section
        className={cn(
          // ✅ z-[9999] use kiya hai taake mobile header/sidebar ke bhi ooper aaye
          "fixed! rounded-none! inset-0! z-[9999] drawer flex flex-col w-full h-[100dvh]",
          theme === "dark"
            ? "apple-glass apple-glass-dark"
            : "apple-glass-light"
        )}
      >
        {/* HEADER (mobile only) - Desktop pe ye hide ho jayega */}
        <div className="flex justify-between items-center px-4 min-[600px]:px-6 h-14 shrink-0 min-[900px]:hidden">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="100exch Logo"
              width={152}
              height={40}
              className="object-contain h-10 min-[600px]:mx-2 mx-1"
            />
          </Link>
        </div>

        {/* MAIN CENTERED WRAPPER (Mobile aur Desktop dono ke liye perfect centering) */}
        <div className="flex flex-1 items-center justify-center p-4 md:p-8 w-full overflow-y-auto">
          
          {/* THE GLASS CARD */}
          <div
            className={cn(
              "flex flex-col w-full max-w-[550px] px-6 py-8 md:px-10 md:py-10 rounded-[16px] shadow-2xl relative",
              "border border-white/5" // Halka sa glass border depth ke liye
            )}
            style={{
              background:
                theme === "dark"
                  ? "linear-gradient(rgba(10, 17, 24, 0.59), rgba(15, 25, 35, 0))"
                  : "linear-gradient(180deg, rgba(244,246,248,0.92) 0%, rgba(244,246,248,0.40) 100%), url('/background-3-blur.webp')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full flex flex-col justify-center gap-6">
              
              {/* Heading */}
              <div className="flex flex-col mb-2 gap-3.5 items-center min-[900px]:items-start">
                <h2 className="text-[24px] md:text-[28px] font-extrabold tracking-tight">
                  Change Password
                </h2>
              </div>

              <form className="space-y-6 flex flex-col gap-6 w-full" onSubmit={handleSubmit} noValidate>
                
                {/* Old Password Field */}
                <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                  <label
                    htmlFor="oldPassword"
                    className={`font-semibold text-base leading-normal font-normal leading-[1.57143] block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${oldPasswordError
                        ? "text-(--palette-error-main)"
                        : "text-(--palette-text-secondary)"
                      }`}
                  >
                    Old Password
                    <span className=""> *</span>
                  </label>
                  <div
                    className={cn(
                      "font-normal text-base leading-[1.4375em] text-(--palette-text-primary) box-border cursor-text inline-flex items-center w-full relative rounded-lg group",
                      theme === "dark" ? "liquid-field" : "liquid-field-light",
                    )}
                  >
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Old Password"
                      name="oldPassword"
                      id="oldPassword"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, oldPassword: true }))
                      }
                      aria-invalid={oldPasswordError}
                      className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowOldPassword((prev) => !prev)}
                      className={cn(
                        style.btn,
                        "top-1/2 -translate-y-1/2 right-1 text-(--palette-action-active) cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center z-10"
                      )}
                      aria-label={showOldPassword ? "Hide password" : "Show password"}
                    >
                      {/* Password Toggle SVG */}
                      {showOldPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"></path><path fill="currentColor" fillRule="evenodd" d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5" clipRule="evenodd"></path></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" clipRule="evenodd"></path></svg>
                      )}
                    </button>
                    <fieldset
                      className={`text-left absolute top-[-5px] group-focus-within:border-2 pointer-events-none min-w-[0%] border overflow-hidden transition-[border-color] duration ease-in-out m-0 px-2 py-0 rounded-[inherit] border-solid bottom-0 inset-x-0 ${oldPasswordError
                          ? "border-(--palette-error-main)"
                          : "border-[rgba(var(--palette-grey-500Channel)_/_20%)] group-hover:border-(--palette-text-primary) group-focus-within:border-(--palette-text-primary)"
                        }`}
                    >
                      <legend className="w-[105px] overflow-hidden block h-[11px] text-[14px] invisible whitespace-nowrap max-w-full transition-[max-width] duration-100 ease-out delay-[50ms] p-0">
                        <span>Old Password *</span>
                      </legend>
                    </fieldset>
                  </div>
                  {oldPasswordError && (
                    <div className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)">
                      Can not be empty
                    </div>
                  )}
                </div>

                {/* New Password Field */}
                <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                  <label
                    htmlFor="newPassword"
                    className={`font-semibold text-base leading-normal font-normal leading-[1.57143] block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${newPasswordError
                        ? "text-(--palette-error-main)"
                        : "text-(--palette-text-secondary)"
                      }`}
                  >
                    New Password
                    <span className=""> *</span>
                  </label>
                  <div
                    className={cn(
                      "font-normal text-base leading-[1.4375em] text-(--palette-text-primary) box-border cursor-text inline-flex items-center w-full relative rounded-lg group",
                      theme === "dark" ? "liquid-field" : "liquid-field-light",
                    )}
                  >
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      name="newPassword"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, newPassword: true }))
                      }
                      aria-invalid={newPasswordError}
                      className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className={cn(
                        style.btn,
                        "top-1/2 -translate-y-1/2 right-1 text-(--palette-action-active) cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center z-10"
                      )}
                    >
                      {/* Password Toggle SVG */}
                      {showNewPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"></path><path fill="currentColor" fillRule="evenodd" d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5" clipRule="evenodd"></path></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" clipRule="evenodd"></path></svg>
                      )}
                    </button>
                    <fieldset
                      className={`text-left absolute top-[-5px] group-focus-within:border-2 pointer-events-none min-w-[0%] border overflow-hidden transition-[border-color] duration ease-in-out m-0 px-2 py-0 rounded-[inherit] border-solid bottom-0 inset-x-0 ${newPasswordError
                          ? "border-(--palette-error-main)"
                          : "border-[rgba(var(--palette-grey-500Channel)_/_20%)] group-hover:border-(--palette-text-primary) group-focus-within:border-(--palette-text-primary)"
                        }`}
                    >
                      <legend className="w-[110px] overflow-hidden block h-[11px] text-[14px] invisible whitespace-nowrap max-w-full transition-[max-width] duration-100 ease-out delay-[50ms] p-0">
                        <span>New Password *</span>
                      </legend>
                    </fieldset>
                  </div>
                  {newPasswordError && (
                    <div className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)">
                      Can not be empty
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                  <label
                    htmlFor="confirmPassword"
                    className={`font-semibold text-base leading-normal font-normal leading-[1.57143] block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${confirmPasswordError
                        ? "text-(--palette-error-main)"
                        : "text-(--palette-text-secondary)"
                      }`}
                  >
                    Re-enter New Password
                    <span className=""> *</span>
                  </label>
                  <div
                    className={cn(
                      "font-normal text-base leading-[1.4375em] text-(--palette-text-primary) box-border cursor-text inline-flex items-center w-full relative rounded-lg group",
                      theme === "dark" ? "liquid-field" : "liquid-field-light",
                    )}
                  >
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter New Password"
                      name="confirmPassword"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onBlur={() =>
                        setTouched((prev) => ({ ...prev, confirmPassword: true }))
                      }
                      aria-invalid={confirmPasswordError}
                      className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0"
                    />
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className={cn(
                        style.btn,
                        "top-1/2 -translate-y-1/2 right-1 text-(--palette-action-active) cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center z-10"
                      )}
                    >
                      {/* Password Toggle SVG */}
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"></path><path fill="currentColor" fillRule="evenodd" d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5" clipRule="evenodd"></path></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="M1.606 6.08a1 1 0 0 1 1.313.526L2 7l.92-.394v-.001l.003.009l.021.045l.094.194c.086.172.219.424.4.729a13.4 13.4 0 0 0 1.67 2.237a12 12 0 0 0 .59.592C7.18 11.8 9.251 13 12 13a8.7 8.7 0 0 0 3.22-.602c1.227-.483 2.254-1.21 3.096-1.998a13 13 0 0 0 2.733-3.725l.027-.058l.005-.011a1 1 0 0 1 1.838.788L22 7l.92.394l-.003.005l-.004.008l-.011.026l-.04.087a14 14 0 0 1-.741 1.348a15.4 15.4 0 0 1-1.711 2.256l.797.797a1 1 0 0 1-1.414 1.415l-.84-.84a12 12 0 0 1-1.897 1.256l.782 1.202a1 1 0 1 1-1.676 1.091l-.986-1.514c-.679.208-1.404.355-2.176.424V16.5a1 1 0 0 1-2 0v-1.544c-.775-.07-1.5-.217-2.177-.425l-.985 1.514a1 1 0 0 1-1.676-1.09l.782-1.203c-.7-.37-1.332-.8-1.897-1.257l-.84.84a1 1 0 0 1-1.414-1.414l.797-.797a15.4 15.4 0 0 1-1.87-2.519a14 14 0 0 1-.591-1.107l-.033-.072l-.01-.021l-.002-.007l-.001-.002v-.001C1.08 7.395 1.08 7.394 2 7l-.919.395a1 1 0 0 1 .525-1.314" clipRule="evenodd"></path></svg>
                      )}
                    </button>
                    <fieldset
                      className={`text-left absolute top-[-5px] group-focus-within:border-2 pointer-events-none min-w-[0%] border overflow-hidden transition-[border-color] duration ease-in-out m-0 px-2 py-0 rounded-[inherit] border-solid bottom-0 inset-x-0 ${confirmPasswordError
                          ? "border-(--palette-error-main)"
                          : "border-[rgba(var(--palette-grey-500Channel)_/_20%)] group-hover:border-(--palette-text-primary) group-focus-within:border-(--palette-text-primary)"
                        }`}
                    >
                      <legend className="w-[170px] overflow-hidden block h-[11px] text-[14px] invisible whitespace-nowrap max-w-full transition-[max-width] duration-100 ease-out delay-[50ms] p-0">
                        <span>Re-enter New Password *</span>
                      </legend>
                    </fieldset>
                  </div>
                  {confirmPasswordEmptyError ? (
                    <div className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)">
                      Can not be empty
                    </div>
                  ) : confirmPasswordMatchError ? (
                    <div className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)">
                      Passwords do not match
                    </div>
                  ) : null}
                </div>

                {/* API Error Message */}
                {apiError && (
                  <div className="text-red-500 text-sm mt-2">
                    {apiError}
                  </div>
                )}

                {/* Submit & Home Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!hasFormValues || isSubmitting}
                    className={cn(
                      "w-full rounded-[8px] relative p-[6px_12px] text-[15px] font-bold h-[48px] cursor-pointer disabled:cursor-not-allowed transition-all",
                      hasFormValues && !isSubmitting
                        ? "bg-[#078DEE] text-white hover:bg-[#0672c2]"
                        : "bg-[rgba(145,158,171,0.24)] text-[rgba(145,158,171,0.8)]"
                    )}
                  >
                    {isSubmitting ? (
                      <span className="contents">
                        <span className="absolute visible flex -translate-2/4 text-(--palette-action-disabled) left-2/4 top-2/4">
                          <span className="h-4 w-4 inline-block submitLoader">
                            <svg className="block text-(--palette-action-disabled)" viewBox="22 22 44 44">
                              <circle className="visible text-(--palette-action-disabled) circleAnimation" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6"></circle>
                            </svg>
                          </span>
                        </span>
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>

                  <Link
                    href="/"
                    className="w-full rounded-[8px] cursor-pointer shadow-(--customShadows-z8) font-bold text-[15px] py-3.5 h-[48px] inline-flex justify-center items-center bg-[var(--gth-btn-bg)] text-white dark:text-black"
                  >
                    <span className="max-[600px]:translate-y-[-0.5px]">
                      Go to Home
                    </span>
                  </Link>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}