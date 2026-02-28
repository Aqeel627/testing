"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import style from "./style.module.css";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { CONFIG } from "@/lib/config";
import { CryptoService } from "@/lib/crypto-service";
import { useCacheStore } from "@/lib/store/cacheStore";
import Icon from "@/icons/icons";
import Loader from "@/components/common/loader/loader";
import { useToast } from "@/components/common/toast/toast-context";

/* ---------------------- PASSWORD RULES ---------------------- */
const passwordPattern = /^(?=.*\d).{8,}$/;



export default function ChangePassword() {
  const { theme } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const { closePasswordModal } = useCacheStore();

  // Show/Hide password states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Input values
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordPattern = /^(?=.*\d).{8,}$/; 

  

  const [touched, setTouched] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });



  /* ---------------------- VALIDATION ---------------------- */

  /* ---------------------- VALIDATION ---------------------- */
  const passwordMatchValidator = (password: string, confirmPassword: string) =>
    password === confirmPassword;

  const validateField = (name: string, value: string, form: any) => {
    let error = "";
    let mismatch = "";

    if (name === "oldPassword") {
      error = !value
        ? "Your Password is required."
        : value === form.newPassword
          ? "New password and Old password should not be same.."
          : "";
    }

    if (name === "newPassword") {
      if (!value) error = "New Password is required.";
      else if (!passwordPattern.test(value))
        error = "Password should be min 8 characters with number combination.";
      else if (value === form.oldPassword)
        error = "New password and Old password should not be same.";

      if (form.confirmPassword && value !== form.confirmPassword)
        mismatch = "Passwords do not match.";
    }

    if (name === "confirmPassword") {
      mismatch = !value
        ? "Confirm Password is required."
        : value !== form.newPassword
          ? "Passwords do not match."
          : "";
    }

    return { error, mismatch };
  };

  const hasFormValues =
    oldPassword.trim() &&
    newPassword.trim() &&
    confirmPassword.trim() &&
    passwordPattern.test(newPassword) &&
    oldPassword !== newPassword &&
    passwordMatchValidator(newPassword, confirmPassword);

  // Errors for rendering
  const oldPasswordError =
    touched.oldPassword &&
    validateField("oldPassword", oldPassword, {
      oldPassword,
      newPassword,
      confirmPassword,
    }).error;

  const newPasswordError =
    touched.newPassword &&
    validateField("newPassword", newPassword, {
      oldPassword,
      newPassword,
      confirmPassword,
    }).error;

  const confirmPasswordEmptyError =
    touched.confirmPassword &&
    validateField("confirmPassword", confirmPassword, {
      oldPassword,
      newPassword,
      confirmPassword,
    }).error === "Confirm Password is required.";

  const confirmPasswordMatchError =
    touched.confirmPassword &&
    validateField("confirmPassword", confirmPassword, {
      oldPassword,
      newPassword,
      confirmPassword,
    }).mismatch;

  const confirmPasswordError = confirmPasswordEmptyError || confirmPasswordMatchError;

  /* ---------------------- LOADER ---------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  /* ---------------------- SUBMIT ---------------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    setTouched({
      oldPassword: true,
      newPassword: true,
      confirmPassword: true,
    });

    if (!hasFormValues) return;

    setIsSubmitting(true);
    setApiError("");

    const payload = { newPassword, oldPassword };

    try {
      const encrypted = await CryptoService.encryptJSON1(payload);
      const finalPayload = { data: encrypted.iv + "###" + encrypted.payload };

      const response = await fetch(CONFIG.changeUserPassword, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(finalPayload),
      });

      const encryptedRes = await response.json();
      const res = await CryptoService.decryptApiResponse(encryptedRes);
      const parts = res?.meta?.message?.split(/',\s*'/).map((p: any) => p.replace(/^'+|'+$/g, "").trim());
      const msg = { status: parts[0] || "", title: parts[1] || "", desc: parts[2] || "" };

      // ✅ Success logic INSIDE try block
      if (res?.meta?.status_code === 200) {
        showToast(msg.status, msg.title, msg.desc || "Password changed successfully");

        // Clear inputs
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        // Reset touched
        setTouched({ oldPassword: false, newPassword: false, confirmPassword: false });

        // Clear storage
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }

        // Redirect
        router.push("/");
        return;
      } else {
        const parts = res?.meta?.message
          ?.split(/',\s*'/)
          .map((p: string | undefined) => p?.replace(/^'+|'+$/g, "").trim() || "");
        setApiError(parts?.[2] || "Failed to change password. Please check your current password.");
      }
    } catch (err: any) {
      console.error("🔥 ERROR in changePassword:", err);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // ✅ always stop loading
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {theme === "light" && (
        <div className="absolute inset-0 z-10 bg-black/50"></div>
      )}

      <section
        className={cn(
          "fixed! rounded-none! inset-0! z-[9999] drawer flex flex-col w-full h-[100dvh]",
          theme === "dark"
            ? "apple-glass apple-glass-dark"
            : "apple-glass-light",
        )}
      >

        {/* MAIN CENTERED WRAPPER */}
        <div className="flex flex-1 items-center justify-center p-4 md:p-8 w-full overflow-y-auto">
          {/* THE GLASS CARD */}
          <div
            className={cn(
              "flex flex-col w-full max-w-[550px] px-6 py-8 md:px-10 md:py-10 rounded-[16px] shadow-2xl relative",
              "border border-white/5",
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

              <form
                className="space-y-6 flex flex-col gap-6 w-full"
                onSubmit={handleSubmit}
                noValidate
              >
                {/* Old Password Field */}
                <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                  <label
                    htmlFor="oldPassword"
                    className={`font-semibold text-base leading-normal block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${oldPasswordError ? "text-(--palette-error-main)" : "text-(--palette-text-secondary)"}`}
                  >
                    Old Password
                    <span> *</span>
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
                      onBlur={() => setTouched((prev) => ({ ...prev, oldPassword: true }))}
                      aria-invalid={oldPasswordError ? "true" : "false"}
                      className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0 bg-transparent"
                    />

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowOldPassword((prev) => !prev)}
                      className={cn(
                        style.btn,
                        "absolute right-2 top-1/2 -translate-y-1/2 text-(--palette-text-secondary) cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center z-10 bg-transparent border-0"
                      )}
                      aria-label={showOldPassword ? "Hide password" : "Show password"}
                    >
                      {showOldPassword ? <Icon name="beforeEye" width={22} height={22} /> : <Icon name="afterEye" width={22} height={22} />}
                    </button>

                    <fieldset
                      className={`text-left absolute top-[-5px] group-focus-within:border-2 pointer-events-none min-w-[0%] border overflow-hidden transition-[border-color] duration ease-in-out m-0 px-2 py-0 rounded-[inherit] border-solid bottom-0 inset-x-0 ${oldPasswordError ? "border-(--palette-error-main)" : "border-[rgba(var(--palette-grey-500Channel)_/_20%)] group-hover:border-(--palette-text-primary) group-focus-within:border-(--palette-text-primary)"}`}
                    >
                      <legend className="w-[105px] overflow-hidden block h-[11px] text-[14px] invisible whitespace-nowrap max-w-full transition-[max-width] duration-100 ease-out delay-[50ms] p-0">
                        <span>Old Password *</span>
                      </legend>
                    </fieldset>
                  </div>

                  {oldPasswordError && (
                    <div className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)">
                      {oldPassword.trim() === ""
                        ? "Your Password is required."
                        : oldPassword === newPassword
                          ? "New password and Old password should not be same."
                          : ""}
                    </div>
                  )}
                </div>

                {/* New Password Field */}
                <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                  <label
                    htmlFor="newPassword"
                    className={`font-semibold text-base leading-normal block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${newPasswordError ? "text-(--palette-error-main)" : "text-(--palette-text-secondary)"
                      }`}
                  >
                    New Password
                    <span> *</span>
                  </label>

                  <div
                    className={cn(
                      "font-normal text-base leading-[1.4375em] text-(--palette-text-primary) box-border cursor-text inline-flex items-center w-full relative rounded-lg group",
                      theme === "dark" ? "liquid-field" : "liquid-field-light"
                    )}
                  >
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New Password"
                      name="newPassword"
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, newPassword: true }))}
                      aria-invalid={newPasswordError ? "true" : "false"}
                      className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0 bg-transparent"
                    />

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className={cn(
                        style.btn,
                        "absolute right-2 top-1/2 -translate-y-1/2 text-(--palette-text-secondary) cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center z-10 bg-transparent border-0"
                      )}
                    >
                      {showNewPassword ? <Icon name="beforeEye" width={22} height={22} /> : <Icon name="afterEye" width={22} height={22} />}
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
                      {newPassword.trim() === ""
                        ? "New Password is required."
                        : !passwordPattern.test(newPassword)
                          ? "Password must be at least 8 characters and include a number."
                          : oldPassword && newPassword === oldPassword
                            ? "New password and Old password should not be same."
                            : ""}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0 border-[initial]">
                  <label
                    htmlFor="confirmPassword"
                    className={`font-semibold text-base leading-normal block text-ellipsis absolute origin-[left_top] z-[1] select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px] whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0 ${confirmPasswordError ? "text-(--palette-error-main)" : "text-(--palette-text-secondary)"
                      }`}
                  >
                    Re-enter New Password
                    <span> *</span>
                  </label>

                  <div
                    className={cn(
                      "font-normal text-base leading-[1.4375em] text-(--palette-text-primary) box-border cursor-text inline-flex items-center w-full relative rounded-lg group",
                      theme === "dark" ? "liquid-field" : "liquid-field-light"
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
                      aria-invalid={confirmPasswordError ? "true" : "false"}
                      className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0 bg-transparent"
                    />

                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      className={cn(
                        style.btn,
                        "absolute right-2 top-1/2 -translate-y-1/2 text-(--palette-text-secondary) cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center z-10 bg-transparent border-0"
                      )}
                    >
                      {showConfirmPassword ? (
                        <Icon name="beforeEye" width={22} height={22} />
                      ) : (
                        <Icon name="afterEye" width={22} height={22} />
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

                  {confirmPasswordError && (
                    <div className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)">
                      {confirmPassword.trim() === ""
                        ? "Confirm Password is required."
                        : confirmPassword !== newPassword
                          ? "Passwords do not match."
                          : ""}
                    </div>
                  )}
                </div>


                {/* Submit & Home Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    className={cn(
                      "w-full rounded-lg relative p-[6px_12px] min-h-9 text-sm font-bold h-[48px] disabled:bg-gray-500 bg-(--primary-color) text-white cursor-pointer disabled:cursor-not-allowed",
                      hasFormValues &&
                      !isSubmitting &&
                      "hover:bg-(--primary-color-dark)",
                    )}
                  >
                    {isSubmitting ? (
                      <span className="contents">
                        <span className="absolute visible flex -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                          <span className="h-4 w-4 inline-block submitLoader">
                            <Icon name="circleAnimation" />
                          </span>
                        </span>
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>

                  <Link
                    href={"/"}
                    onClick={closePasswordModal}
                    className="text-center text-sm gap-1 flex justify-center items-center"
                  >
                    <Icon
                      name={"back"}
                      width={16}
                      height={16}
                      className="text-(--gth-btn-bg)"
                    />
                    <span className="text-(--gth-btn-bg)">
                      Return to Homepage
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
