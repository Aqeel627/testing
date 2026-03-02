"use client";
import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store/store";
import { CONFIG } from "@/lib/config";
import { fetchData, splitMsg } from "@/lib/functions";
import { useToast } from "@/components/common/toast/toast-context";
import dynamic from "next/dynamic";

const BreadCrumb = dynamic(() => import("@/components/common/bread-crumb"));

type StakeItem = { stakeAmount: string; stakeName?: string };

const FALLBACK_STAKES: StakeItem[] = [
  { stakeAmount: "1000" },
  { stakeAmount: "5000" },
  { stakeAmount: "10000" },
  { stakeAmount: "25000" },
  { stakeAmount: "50000" },
  { stakeAmount: "100000" },
  { stakeAmount: "200000" },
  { stakeAmount: "500000" },
];

function parseErrorMsg(raw: string): string {
  try {
    const parts = raw.match(/'([^']*)'/g);
    if (parts && parts.length >= 3) {
      return parts[2].replace(/'/g, "");
    }
    return raw;
  } catch {
    return "Something went wrong. Please try again.";
  }
}

export default function SettingsPage() {
  const { stakeValue, setStakeValue } = useAppStore();
  const [stackButtonArry, setStackButtonArry] =
    useState<StakeItem[]>(FALLBACK_STAKES);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { showToast } = useToast()

  useEffect(() => {
    // console.log(stakeValue, "stakes")
    const stakes = stakeValue?.stake;
    if (Array.isArray(stakes) && stakes.length > 0) {
      // console.log(stakes, "data")
      setStackButtonArry(stakes);
    }
  }, [stakeValue]);

  const numberOnly = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const ch = e.key;
    if (["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(ch))
      return;
    if (!/^\d$/.test(ch)) e.preventDefault();
  };

  const handleChange = (index: number, value: string) => {
    setErrorMsg(""); // clear error on any change
    setStackButtonArry((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        stakeAmount: value.replace(/\D/g, "").slice(0, 9),
      };
      return updated;
    });
  };

  // Refetch stakes from API and update store
  const refetchStakes = () => {
    fetchData({
      url: CONFIG.getUserBetStake,
      payload: { key: CONFIG.siteKey },
      cachedKey: "betStake",
      setFn: setStakeValue,
      expireIn: CONFIG.getUserBetStakeTime,
      forceApiCall: true,
    });
  };

  const updateBetSetting = () => {
    const values = stackButtonArry.map((x) => x.stakeAmount);
    if (values.some((v) => !v)) {
      setErrorMsg("Please enter all stake values.");
      return;
    }

    const respRes: Record<string, string> = {};
    values.forEach((v) => (respRes[v] = v));

    setErrorMsg("");
    setSaving(true);

    fetchData({
      url: CONFIG.userUpdateStackValueURL,
      payload: { stake: JSON.stringify(respRes) },
      setFn: (data: any) => {
        setSaving(false);
        const msg = splitMsg(data?.meta?.message);
        showToast(msg.status, msg.title, msg.desc)
        if (data?.meta?.status) {
          // ✅ Success: update store + refetch fresh stakes
          setStakeValue({ data: { stake: stackButtonArry } });
          refetchStakes();
        } else {
          // ❌ Failure: parse and show error
          const raw = data?.meta?.message || "Something went wrong.";
          setErrorMsg(parseErrorMsg(raw));
        }
      },
    });
  };

  return (
    <div id="setting.tsx">
      <div className="w-full py-4">
        <BreadCrumb title="Default Stake Amount" />
        <div className="w-full max-w-[900px] flex justify-center items-center flex-col mx-auto">
          {/* <div className="flex items-center gap-4 mb-4">
          <div
            className="flex-1 h-[1px]"
            style={{ background: "var(--dotted-line)" }}
          />
          <h2
            className="text-[15px] font-bold uppercase tracking-widest whitespace-nowrap"
            style={{ color: "var(--palette-text-primary)" }}
          >
            Default Stake Amount
          </h2>
          <div
            className="flex-1 h-[1px]"
            style={{ background: "var(--dotted-line)" }}
          />
        </div> */}

          <div
            className="w-full rounded-2xl border p-6 md:p-8"
            style={{
              background: "",
              borderColor: "var(--dotted-line)",
            }}
          >
            <div
              className="w-full rounded-lg px-4 py-3 mb-6 flex mx-auto justify-center items-center gap-2"
              style={{ background: "var(--accordion-bg)" }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "var(--primary-color)" }}
              />
              <span
                className="text-[13px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--accordion-text)" }}
              >
                Edit Your Bet Stakes
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8">
              {stackButtonArry.map((item, i) => (
                <div key={i} className="relative group">
                  {/* <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-200"
                  style={{ background: "var(--primary-color)" }}
                /> */}
                  <input
                    id={`stack_value_${i}`}
                    name={`stack_value_${i}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={item.stakeAmount}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={numberOnly}
                    maxLength={9}
                    className="w-full text-center text-[15px] md:text-[17px] font-bold rounded-md px-4 py-3 md:py-4 outline-none transition-all duration-200 focus:ring-2"
                    style={{
                      background: "var(--primary-hover)",
                      border: "1px solid var(--dotted-line)",
                      color: "var(--palette-text-primary)",
                      // @ts-ignore
                      "--tw-ring-color": "var(--primary-color)",
                    }}
                  />
                </div>
              ))}
            </div>

            <div
              className="w-full h-px mb-6"
              style={{ background: "var(--dotted-line)" }}
            />

            {/* ── Error Message ── */}
            {errorMsg && (
              <p className="text-center text-[13px] font-medium text-red-500 mb-3 -mt-2">
                {errorMsg}
              </p>
            )}

            <div className="flex justify-center">
              <button
                onClick={updateBetSetting}
                disabled={saving}
                className="w-full max-w-[360px] py-3 rounded-xl hover:bg-(--primary-color-dark) bg-(--primary-color) font-bold text-[15px] uppercase tracking-widest transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 cursor-pointer shadow-lg"
                style={{
                  boxShadow:
                    "0 4px 20px color-mix(in srgb, var(--primary-color) 35%, transparent)",
                }}
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
