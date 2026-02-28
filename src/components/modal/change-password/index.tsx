"use client";

import { useEffect, useState, useCallback, type FormEvent } from "react";
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
import { splitMsg } from "@/lib/functions";

/* ---------------------- PASSWORD RULES ---------------------- */
// ✅ Ek jagah define karo - pehle duplicate tha (component ke bahar aur andar dono jagah)
const PASSWORD_PATTERN = /^(?=.*\d).{8,}$/;

/* ---------------------- TYPES ---------------------- */
interface FormState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface TouchedState {
  oldPassword: boolean;
  newPassword: boolean;
  confirmPassword: boolean;
}

/* ---------------------- PURE VALIDATION FN ---------------------- */
// ✅ Component ke bahar rakha - re-render pe recreate nahi hoga
const getErrors = (form: FormState, touched: TouchedState) => {
  const { oldPassword, newPassword, confirmPassword } = form;

  const oldPasswordError =
    touched.oldPassword
      ? !oldPassword.trim()
        ? "Your Password is required."
        : oldPassword === newPassword
        ? "New password and Old password should not be same."
        : ""
      : "";

  const newPasswordError =
    touched.newPassword
      ? !newPassword.trim()
        ? "New Password is required."
        : !PASSWORD_PATTERN.test(newPassword)
        ? "Password must be at least 8 characters and include a number."
        : newPassword === oldPassword
        ? "New password and Old password should not be same."
        : ""
      : "";

  const confirmPasswordError =
    touched.confirmPassword
      ? !confirmPassword.trim()
        ? "Confirm Password is required."
        : confirmPassword !== newPassword
        ? "Passwords do not match."
        : ""
      : "";

  return { oldPasswordError, newPasswordError, confirmPasswordError };
};

/* ---------------------- COMPONENT ---------------------- */
export default function ChangePassword() {
  const { theme } = useTheme();
  const router = useRouter();
  const { showToast } = useToast();
  const { closePasswordModal } = useCacheStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  // Show/Hide password states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Single form state object - ek jagah manage karo
  const [form, setForm] = useState<FormState>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ✅ Touched: onChange pe bhi true karo (realtime ke liye)
  const [touched, setTouched] = useState<TouchedState>({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // ✅ Errors directly compute karo - useMemo ki zaroorat nahi yahan
  const { oldPasswordError, newPasswordError, confirmPasswordError } = getErrors(form, touched);

  // ✅ Form valid hai ya nahi
  const isFormValid =
    !!form.oldPassword.trim() &&
    !!form.newPassword.trim() &&
    !!form.confirmPassword.trim() &&
    PASSWORD_PATTERN.test(form.newPassword) &&
    form.oldPassword !== form.newPassword &&
    form.newPassword === form.confirmPassword;

  /* ---------------------- HANDLERS ---------------------- */
  // ✅ useCallback se stable reference - child re-renders rokta hai
  const handleChange = useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      // ✅ Realtime validation: jaise hi type karo, touched true
      setTouched((prev) => ({ ...prev, [field]: true }));
      // API error clear karo jab user dobara type kare
      if (apiError) setApiError("");
    },
    [apiError]
  );

  const handleBlur = useCallback(
    (field: keyof TouchedState) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    },
    []
  );

  /* ---------------------- LOADER ---------------------- */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------------------- SUBMIT ---------------------- */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Sab fields touched mark karo submit pe
    setTouched({ oldPassword: true, newPassword: true, confirmPassword: true });

    if (!isFormValid) return;

    setIsSubmitting(true);
    setApiError("");

    const payload = { newPassword: form.newPassword, oldPassword: form.oldPassword };

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
      const msg = splitMsg(res?.meta?.message);

      if (res?.meta?.status_code === 200) {
        showToast(msg.status, msg.title, msg.desc || "Password changed successfully");

        // Reset form
        setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setTouched({ oldPassword: false, newPassword: false, confirmPassword: false });

        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();
        }

        router.push("/");
      } else {
        const errParts = splitMsg(res?.meta?.message ?? "");
        setApiError(errParts.title || "Failed to change password. Please check your current password.");
      }
    } catch (err) {
      console.error("ERROR in changePassword:", err);
      setApiError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------------------- RENDER ---------------------- */
  if (isLoading) return <Loader />;

  const isDark = theme === "dark";

  return (
    <>
      {!isDark && <div className="absolute inset-0 z-10 bg-black/50" />}

      <section
        className={cn(
          "fixed! rounded-none! inset-0! z-[9999] drawer flex flex-col w-full h-[100dvh]",
          isDark ? "apple-glass apple-glass-dark" : "apple-glass-light"
        )}
      >
        <div className="flex flex-1 items-center justify-center p-4 md:p-8 w-full overflow-y-auto">
          <div
            className={cn(
              "flex flex-col w-full max-w-[550px] px-6 py-8 md:px-10 md:py-10 rounded-[16px] shadow-2xl relative",
              "border border-white/5"
            )}
            style={{
              background: isDark
                ? "linear-gradient(rgba(10, 17, 24, 0.59), rgba(15, 25, 35, 0))"
                : "linear-gradient(180deg, rgba(244,246,248,0.92) 0%, rgba(244,246,248,0.40) 100%), url('/background-3-blur.webp')",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full flex flex-col justify-center gap-6">
              <div className="flex flex-col mb-2 gap-3.5 items-center min-[900px]:items-start">
                <h2 className="text-[24px] md:text-[28px] font-extrabold tracking-tight">
                  Change Password
                </h2>
              </div>

              <form className="space-y-6 flex flex-col gap-6 w-full" onSubmit={handleSubmit} noValidate>
                {/* ---- Old Password ---- */}
                <PasswordField
                  id="oldPassword"
                  label="Old Password"
                  value={form.oldPassword}
                  show={showOldPassword}
                  error={oldPasswordError}
                  onChange={handleChange("oldPassword")}
                  onBlur={handleBlur("oldPassword")}
                  onToggleShow={() => setShowOldPassword((p) => !p)}
                  isDark={isDark}
                  legendWidth="105px"
                />

                {/* ---- New Password ---- */}
                <PasswordField
                  id="newPassword"
                  label="New Password"
                  value={form.newPassword}
                  show={showNewPassword}
                  error={newPasswordError}
                  onChange={handleChange("newPassword")}
                  onBlur={handleBlur("newPassword")}
                  onToggleShow={() => setShowNewPassword((p) => !p)}
                  isDark={isDark}
                  legendWidth="110px"
                />

                {/* ---- Confirm Password ---- */}
                <PasswordField
                  id="confirmPassword"
                  label="Re-enter New Password"
                  value={form.confirmPassword}
                  show={showConfirmPassword}
                  error={confirmPasswordError}
                  onChange={handleChange("confirmPassword")}
                  onBlur={handleBlur("confirmPassword")}
                  onToggleShow={() => setShowConfirmPassword((p) => !p)}
                  isDark={isDark}
                  legendWidth="170px"
                />

                {/* API Error */}
                {apiError && (
                  <p className="text-xs text-(--palette-error-main) -mt-3 mx-3.5">
                    {apiError}
                  </p>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={cn(
                      "w-full rounded-lg relative p-[6px_12px] min-h-9 text-sm font-bold h-[48px] bg-(--primary-color) text-white cursor-pointer",
                      "disabled:bg-gray-500 disabled:cursor-not-allowed",
                      isFormValid && !isSubmitting && "hover:bg-(--primary-color-dark)"
                    )}
                  >
                    {isSubmitting ? (
                      <span className="absolute flex -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                        <span className="h-4 w-4 inline-block submitLoader">
                          <Icon name="circleAnimation" />
                        </span>
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </button>

                  <Link
                    href="/"
                    onClick={closePasswordModal}
                    className="text-center text-sm gap-1 flex justify-center items-center"
                  >
                    <Icon name="back" width={16} height={16} className="text-(--gth-btn-bg)" />
                    <span className="text-(--gth-btn-bg)">Return to Homepage</span>
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

/* ===================== PASSWORD FIELD COMPONENT ===================== */
// ✅ Alag component banaya - baar baar repeat nahi hoga, better performance
interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  show: boolean;
  error: string | false | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onToggleShow: () => void;
  isDark: boolean;
  legendWidth: string;
}

function PasswordField({
  id,
  label,
  value,
  show,
  error,
  onChange,
  onBlur,
  onToggleShow,
  isDark,
  legendWidth,
}: PasswordFieldProps) {
  return (
    <div className="inline-flex flex-col relative min-w-0 align-top w-full m-0 p-0 border-0">
      <label
        htmlFor={id}
        className={cn(
          "font-semibold text-base leading-normal block text-ellipsis absolute origin-[left_top] z-[1]",
          "select-none pointer-events-auto max-w-[calc(133%-32px)] translate-x-3.5 translate-y-[-9px]",
          "whitespace-nowrap overflow-hidden p-0 scale-75 left-0 top-0",
          error ? "text-(--palette-error-main)" : "text-(--palette-text-secondary)"
        )}
      >
        {label} <span>*</span>
      </label>

      <div
        className={cn(
          "font-normal text-base leading-[1.4375em] text-(--palette-text-primary) box-border",
          "cursor-text inline-flex items-center w-full relative rounded-lg group",
          isDark ? "liquid-field" : "liquid-field-light"
        )}
      >
        <input
          type={show ? "text" : "password"}
          placeholder={label}
          name={id}
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={!!error}
          className="font-[inherit] max-[600px]:text-base placeholder:text-(--palette-text-primary) outline-0 leading-[inherit] tracking-[inherit] text-current box-content h-[1.4375em] block min-w-0 w-full text-[0.9375rem] m-0 px-3.5 py-[16.5px] border-0 bg-transparent"
        />

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={onToggleShow}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-(--palette-text-secondary) cursor-pointer p-2 hover:bg-[rgba(145,158,171,0.08)] rounded-full flex justify-center items-center z-10 bg-transparent border-0"
        >
          <Icon name={show ? "beforeEye" : "afterEye"} width={22} height={22} />
        </button>

        <fieldset
          className={cn(
            "text-left absolute top-[-5px] group-focus-within:border-2 pointer-events-none min-w-[0%]",
            "border overflow-hidden transition-[border-color] duration ease-in-out m-0 px-2 py-0 rounded-[inherit] border-solid bottom-0 inset-x-0",
            error
              ? "border-(--palette-error-main)"
              : "border-[rgba(var(--palette-grey-500Channel)_/_20%)] group-hover:border-(--palette-text-primary) group-focus-within:border-(--palette-text-primary)"
          )}
        >
          <legend
            style={{ width: legendWidth }}
            className="overflow-hidden block h-[11px] text-[14px] invisible whitespace-nowrap max-w-full transition-[max-width] duration-100 ease-out delay-[50ms] p-0"
          >
            <span>{label} *</span>
          </legend>
        </fieldset>
      </div>

      {/* ✅ Error message - sirf tab show hoga jab error ho */}
      {error && (
        <div className="font-normal text-xs leading-normal text-left mt-2 mb-0 mx-3.5 text-(--palette-error-main)">
          {error}
        </div>
      )}
    </div>
  );
}