// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useAppStore } from "@/lib/store/store";
// import { cn } from "@/lib/utils";
// import BreadCrumb from "@/components/common/bread-crumb";

// type ExposureModalProps = {
//   open: boolean;
//   onClose: () => void;
// };

// const MOBILE_TOP_OFFSET = 80;
// const DESKTOP_TOP_OFFSET = 48;

// export default function ExposureModal({
//   open,
//   onClose,
// }: ExposureModalProps) {
//   const router = useRouter();
//   const { userExposureList } = useAppStore();
//   const [mounted, setMounted] = useState(false);

//   const exposureList = userExposureList?.data ?? [];

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   useEffect(() => {
//     if (!open) return;

//     const onKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };

//     document.addEventListener("keydown", onKeyDown);
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.removeEventListener("keydown", onKeyDown);
//       document.body.style.overflow = "unset";
//     };
//   }, [open, onClose]);

//   const gotoEvent = (expo: any) => {
//     const sportId = String(expo?.sportId ?? expo?.eventType?.id ?? "");
//     const eventId = String(
//       expo?.eventId ?? expo?.event?.id ?? expo?.exEventId ?? "",
//     );

//     if (!sportId || !eventId) return;

//     if (sportId === "7" || sportId === "4339") {
//       router.push(`/horse-racing/inplayHorseGame/${eventId}/${sportId}`);
//     } else if (sportId === "66101") {
//       router.push(`/fullMarket/virtual-sports/${sportId}/${eventId}`);
//     } else {
//       router.push(`/market-details/${eventId}/${sportId}`);
//     }

//     onClose();
//   };

//   if (!mounted) return null;

//   return (
//     <div id="exposure-modal">
//       {/* Overlay */}
// <div
//   onClick={onClose}
//   className={cn(
//     "fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300",
//     open
//       ? "opacity-100 visible pointer-events-auto"
//       : "opacity-0 invisible pointer-events-none",
//   )}
//   style={{ zIndex: 999998 }}
// />

//       {/* ---------------- MOBILE ---------------- */}
//       {/* ---------------- MOBILE ---------------- */}
// <div
// className={cn(
//   "fixed left-0 w-full min-[960px]:hidden z-[999999]",
//   "transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] overflow-hidden",
//   open
//     ? "opacity-100 visible"
//     : "opacity-0 pointer-events-none [visibility:hidden] delay-500",
// )}
//   style={{
//     top: `${MOBILE_TOP_OFFSET}px`,
//     height: `calc(100dvh - ${MOBILE_TOP_OFFSET}px)`,
//     transform: open ? "translateY(0)" : "translateY(calc(-100% - 24px))",
//     WebkitBackdropFilter: "blur(20px)",
//     backdropFilter: "blur(20px)",
//     background: "linear-gradient(145deg, #ffffff14, #ffffff05)",
//     boxShadow:
//       "0 8px 32px #00000059, inset 0 0 #ffffff40, inset 0 -2px 6px #ffffff0d",
//   }}
//   onClick={(e) => e.stopPropagation()}
// >
//         <div className="h-full flex flex-col overflow-hidden">
//           {/* Header same like MyBetsDrawer but fixed properly */}
//           <div className="relative px-3 pt-2 pb-3 shrink-0">
//             <div className="pr-10">
//               <BreadCrumb title="Exposure Detail" parentClass="mb-0! mt-0!" />
//             </div>

//             <button
//               type="button"
//               onClick={onClose}
//               className="absolute right-3 top-3 h-8 w-8 rounded-[10px] border flex items-center justify-center"
//               style={{
//                 borderColor:
//                   "color-mix(in srgb, var(--primary-color) 90%, transparent)",
//                 background:
//                   "color-mix(in srgb, var(--accordion-bg) 18%, transparent)",
//                 boxShadow: "var(--customShadows-dropdown)",
//                 color: "var(--palette-text-primary)",
//               }}
//               aria-label="Close"
//             >
//               <span
//                 style={{
//                   fontSize: 20,
//                   lineHeight: 1,
//                   transform: "translateY(-1px)",
//                 }}
//               >
//                 ×
//               </span>
//             </button>
//           </div>

//           {/* single divider only */}
//           <div className="mx-0 border-t border-[rgba(var(--palette-grey-500Channel)_/_12%)]" />

//           {/* Body scrollable */}
//           <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3">
//             {exposureList.length > 0 ? (
//               <div className="rounded-[14px] overflow-hidden border border-[rgba(var(--palette-grey-500Channel)_/_16%)]">
//                 {exposureList.map((expo: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="px-3 py-3 border-t first:border-t-0 border-[rgba(var(--palette-grey-500Channel)_/_10%)]"
//                   >
//                     <div className="flex items-center gap-2.5">
//                       {/* text */}
//                       <div className="min-w-0 flex-1">
//                         <div className="text-[10px] min-[360px]:text-[11px] uppercase tracking-[1.6px] text-[#9AA4B2] font-semibold mb-[3px]">
//                           {expo?.eventType?.name || "N/A"}
//                         </div>

//                         <button
//                           type="button"
//                           onClick={() => gotoEvent(expo)}
//                           className="block w-full text-left text-[13px] min-[360px]:text-[14px] leading-[1.33] font-bold text-[var(--palette-text-primary)] hover:text-(--primary-color) transition-colors cursor-pointer break-words"
//                         >
//                           {expo?.event?.name || "N/A"}{" "}
//                           <span className="text-(--primary-color)">
//                             ({expo?.betCounts || 0})
//                           </span>
//                         </button>

//                         <div className="mt-1 text-[11px] min-[360px]:text-[12px] text-[var(--palette-text-secondary)]">
//                           Market:{" "}
//                           <span className="text-[var(--palette-text-primary)] font-semibold">
//                             {expo?.marketName || "N/A"}
//                           </span>
//                         </div>
//                       </div>

//                       {/* optimized arrow */}
//                       <button
//                         type="button"
//                         onClick={() => gotoEvent(expo)}
//                         className="shrink-0 h-[32px] w-[32px] min-[360px]:h-[34px] min-[360px]:w-[34px] rounded-[10px] border flex items-center justify-center bg-[var(--accordion-bg)]/12"
//                         style={{
//                           borderColor:
//                             "rgba(var(--palette-grey-500Channel)_/_18%)",
//                         }}
//                         aria-label="Go to event"
//                       >
//                         <span className="text-(--primary-color) text-[16px] min-[360px]:text-[17px] leading-none relative left-[0.5px]">
//                           ›
//                         </span>
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="rounded-[14px] border border-dashed border-[rgba(var(--palette-grey-500Channel)_/_20%)] px-4 py-8 text-center text-[12px] text-[var(--palette-text-secondary)]">
//                 No real-time records found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ---------------- DESKTOP ---------------- */}
// <div
//   className={cn(
//     "fixed hidden min-[960px]:block z-[999999]",
//     "transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
//     open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none",
//   )}
//   style={{
//     top: `${DESKTOP_TOP_OFFSET}px`,
//     left: "50%",
//     width: "min(710px, calc(100vw - 40px))",
//     maxHeight: "calc(100dvh - 100px)",
//     transform: open
//       ? "translate(-50%, 0)"
//       : "translate(-50%, calc(-100% - 40px))",
//     WebkitBackdropFilter: "blur(20px)",
//     backdropFilter: "blur(20px)",
//     background: "linear-gradient(145deg, #ffffff14, #ffffff05)",
//     boxShadow:
//       "0 8px 32px #00000059, inset 0 0 #ffffff40, inset 0 -2px 6px #ffffff0d",
//     borderRadius: "18px",
//     overflow: "hidden",
//     border: "1px solid rgba(145,158,171,0.14)",
//   }}
//   onClick={(e) => e.stopPropagation()}
// >
        
//         <div className="flex flex-col">
//           <div className="relative px-5 py-3 border-b border-[rgba(var(--palette-grey-500Channel)_/_12%)] shrink-0">
//             <h2 className="text-[17px] font-semibold text-[var(--palette-text-primary)]">
//               Exposure Detail
//             </h2>

//             <button
//               type="button"
//               onClick={onClose}
//               className="absolute right-4 top-2 h-8 w-8 rounded-[10px] border flex items-center justify-center"
//               style={{
//                 borderColor:
//                   "color-mix(in srgb, var(--primary-color) 90%, transparent)",
//                 background:
//                   "color-mix(in srgb, var(--accordion-bg) 18%, transparent)",
//                 boxShadow: "var(--customShadows-dropdown)",
//                 color: "var(--palette-text-primary)",
//               }}
//               aria-label="Close"
//             >
//               <span className="text-[22px] leading-none relative -top-[1px]">
//                 ×
//               </span>
//             </button>
//           </div>

//           <div className="p-3 overflow-y-auto max-h-[430px]">
//             {exposureList.length > 0 ? (
//               <div className="rounded-[14px] overflow-hidden border border-[rgba(var(--palette-grey-500Channel)_/_18%)]">
//                 <div className="grid grid-cols-[1.1fr_2fr_1.15fr_0.8fr] bg-white/7 text-[14px] font-semibold text-[var(--palette-text-primary)]">
//                   <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_14%)]">
//                     Sport Name
//                   </div>
//                   <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_14%)]">
//                     Event Name
//                   </div>
//                   <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_14%)]">
//                     Market Name
//                   </div>
//                   <div className="px-4 py-3 text-center">Trade</div>
//                 </div>

//                 {exposureList.map((expo: any, idx: number) => (
//                   <div
//                     key={idx}
//                     className="grid grid-cols-[1.1fr_2fr_1.15fr_0.8fr] border-t border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-[14px]"
//                   >
//                     <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-[var(--palette-text-primary)] font-semibold">
//                       {expo?.eventType?.name || "N/A"}
//                     </div>

//                     <button
//                       type="button"
//                       onClick={() => gotoEvent(expo)}
//                       className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-left text-(--primary-color) font-semibold hover:underline cursor-pointer"
//                     >
//                       {expo?.event?.name || "N/A"}
//                     </button>

//                     <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-[var(--palette-text-primary)] font-semibold">
//                       {expo?.marketName || "N/A"}
//                     </div>

//                     <div className="px-4 py-3 text-center text-[var(--palette-text-primary)] font-semibold">
//                       {expo?.betCounts || 0}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="rounded-[14px] border border-dashed border-[rgba(var(--palette-grey-500Channel)_/_22%)] px-4 py-8 text-center text-[13px] text-[var(--palette-text-secondary)]">
//                 No real-time records found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import BreadCrumb from "@/components/common/bread-crumb";
import { useAuthStore } from "@/lib/useAuthStore";
import http from "@/lib/axios-instance";
import { CONFIG } from "@/lib/config";

type ExposureModalProps = {
  open: boolean;
  onClose: () => void;
};

const MOBILE_TOP_OFFSET = 80;
const DESKTOP_TOP_OFFSET = 48;

export default function ExposureModal({
  open,
  onClose,
}: ExposureModalProps) {
  const router = useRouter();
  const { token } = useAuthStore();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exposureList, setExposureList] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !token) return;

    let active = true;

    const fetchExposure = async () => {
      try {
        setExposureList([]);
        setLoading(true);

        const res = await http.post(
          CONFIG.getExposureListURL,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const list = res?.data?.data ?? res?.data ?? [];
        const data = Array.isArray(list) ? list : [];

        if (!active) return;
        setExposureList(data);
      } catch (error) {
        if (!active) return;
        setExposureList([]);
        console.error("Exposure fetch error:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchExposure();

    return () => {
      active = false;
    };
  }, [open, token]);

  const gotoEvent = (expo: any) => {
    const sportId = String(expo?.sportId ?? expo?.eventType?.id ?? "");
    const eventId = String(
      expo?.eventId ?? expo?.event?.id ?? expo?.exEventId ?? "",
    );

    if (!sportId || !eventId) return;

    if (sportId === "7" || sportId === "4339") {
      router.push(`/horse-racing/inplayHorseGame/${eventId}/${sportId}`);
    } else if (sportId === "66101") {
      router.push(`/fullMarket/virtual-sports/${sportId}/${eventId}`);
    } else {
      router.push(`/market-details/${eventId}/${sportId}`);
    }

    onClose();
  };

  if (!mounted) return null;

  return (
    <div id="exposure-modal">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-500",
          open
            ? "opacity-100 visible pointer-events-auto"
            : "opacity-0 pointer-events-none [visibility:hidden] delay-500",
        )}
        style={{ zIndex: 999998 }}
      />

      {/* MOBILE */}
      <div
        className={cn(
          "fixed left-0 w-full min-[960px]:hidden z-[999999]",
          "transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] overflow-hidden",
          open
            ? "opacity-100 visible"
            : "opacity-0 pointer-events-none [visibility:hidden] delay-500",
        )}
        style={{
          top: `${MOBILE_TOP_OFFSET}px`,
          height: `calc(100dvh - ${MOBILE_TOP_OFFSET}px)`,
          transform: open ? "translateY(0)" : "translateY(calc(-100% - 24px))",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          background: "linear-gradient(145deg, #ffffff14, #ffffff05)",
          boxShadow:
            "0 8px 32px #00000059, inset 0 0 #ffffff40, inset 0 -2px 6px #ffffff0d",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="relative px-3 pt-2 pb-3 shrink-0">
            <div className="pr-10">
              <BreadCrumb title="Exposure Detail" parentClass="mb-0! mt-0!" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 h-8 w-8 rounded-[10px] border flex items-center justify-center"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--primary-color) 90%, transparent)",
                background:
                  "color-mix(in srgb, var(--accordion-bg) 18%, transparent)",
                boxShadow: "var(--customShadows-dropdown)",
                color: "var(--palette-text-primary)",
              }}
              aria-label="Close"
            >
              <span
                style={{
                  fontSize: 20,
                  lineHeight: 1,
                  transform: "translateY(-1px)",
                }}
              >
                ×
              </span>
            </button>
          </div>

          <div className="mx-0 border-t border-[rgba(var(--palette-grey-500Channel)_/_12%)]" />

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 pt-3">
            {loading ? (
              <div className="rounded-[14px] border border-dashed border-[rgba(var(--palette-grey-500Channel)_/_20%)] px-4 py-8 text-center text-[12px] text-[var(--palette-text-secondary)]">
                Loading...
              </div>
            ) : exposureList.length > 0 ? (
              <div className="rounded-[14px] overflow-hidden border border-[rgba(var(--palette-grey-500Channel)_/_16%)]">
                {exposureList.map((expo: any, idx: number) => (
                  <div
                    key={idx}
                    className="px-3 py-3 border-t first:border-t-0 border-[rgba(var(--palette-grey-500Channel)_/_10%)]"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] min-[360px]:text-[11px] uppercase tracking-[1.6px] text-[#9AA4B2] font-semibold mb-[3px]">
                          {expo?.eventType?.name || "N/A"}
                        </div>

                        <button
                          type="button"
                          onClick={() => gotoEvent(expo)}
                          className="block w-full text-left text-[13px] min-[360px]:text-[14px] leading-[1.33] font-bold text-[var(--palette-text-primary)] hover:text-(--primary-color) transition-colors cursor-pointer break-words"
                        >
                          {expo?.event?.name || "N/A"}{" "}
                          <span className="text-(--primary-color)">
                            ({expo?.betCounts || 0})
                          </span>
                        </button>

                        <div className="mt-1 text-[11px] min-[360px]:text-[12px] text-[var(--palette-text-secondary)]">
                          Market:{" "}
                          <span className="text-[var(--palette-text-primary)] font-semibold">
                            {expo?.marketName || "N/A"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => gotoEvent(expo)}
                        className="shrink-0 h-[32px] w-[32px] min-[360px]:h-[34px] min-[360px]:w-[34px] rounded-[10px] border flex items-center justify-center bg-[var(--accordion-bg)]/12"
                        style={{
                          borderColor:
                            "rgba(var(--palette-grey-500Channel)_/_18%)",
                        }}
                        aria-label="Go to event"
                      >
                        <span className="text-(--primary-color) text-[16px] min-[360px]:text-[17px] leading-none relative left-[0.5px]">
                          ›
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[14px] border border-dashed border-[rgba(var(--palette-grey-500Channel)_/_20%)] px-4 py-8 text-center text-[12px] text-[var(--palette-text-secondary)]">
                No real-time records found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div
        className={cn(
          "fixed hidden min-[960px]:block z-[999999]",
          "transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)]",
          open
            ? "opacity-100 visible"
            : "opacity-0 pointer-events-none [visibility:hidden] delay-500",
        )}
        style={{
          top: `${DESKTOP_TOP_OFFSET}px`,
          left: "50%",
          width: "min(710px, calc(100vw - 40px))",
          maxHeight: "calc(100dvh - 100px)",
          transform: open
            ? "translate(-50%, 0)"
            : "translate(-50%, calc(-100% - 40px))",
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
          background: "linear-gradient(145deg, #ffffff14, #ffffff05)",
          boxShadow:
            "0 8px 32px #00000059, inset 0 0 #ffffff40, inset 0 -2px 6px #ffffff0d",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid rgba(145,158,171,0.14)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          <div className="relative px-5 py-3 border-b border-[rgba(var(--palette-grey-500Channel)_/_12%)] shrink-0">
            <h2 className="text-[17px] font-semibold text-[var(--palette-text-primary)]">
              Exposure Detail
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-2 h-8 w-8 rounded-[10px] border flex items-center justify-center"
              style={{
                borderColor:
                  "color-mix(in srgb, var(--primary-color) 90%, transparent)",
                background:
                  "color-mix(in srgb, var(--accordion-bg) 18%, transparent)",
                boxShadow: "var(--customShadows-dropdown)",
                color: "var(--palette-text-primary)",
              }}
              aria-label="Close"
            >
              <span className="text-[22px] leading-none relative -top-[1px]">
                ×
              </span>
            </button>
          </div>

          <div className="p-3 overflow-y-auto max-h-[430px]">
            {loading ? (
              <div className="rounded-[14px] border border-dashed border-[rgba(var(--palette-grey-500Channel)_/_22%)] px-4 py-8 text-center text-[13px] text-[var(--palette-text-secondary)]">
                Loading...
              </div>
            ) : exposureList.length > 0 ? (
              <div className="rounded-[14px] overflow-hidden border border-[rgba(var(--palette-grey-500Channel)_/_18%)]">
                <div className="grid grid-cols-[1.1fr_2fr_1.15fr_0.8fr] bg-white/7 text-[14px] font-semibold text-[var(--palette-text-primary)]">
                  <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_14%)]">
                    Sport Name
                  </div>
                  <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_14%)]">
                    Event Name
                  </div>
                  <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_14%)]">
                    Market Name
                  </div>
                  <div className="px-4 py-3 text-center">Trade</div>
                </div>

                {exposureList.map((expo: any, idx: number) => (
                  <div
                    key={idx}
                    className="grid grid-cols-[1.1fr_2fr_1.15fr_0.8fr] border-t border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-[14px]"
                  >
                    <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-[var(--palette-text-primary)] font-semibold">
                      {expo?.eventType?.name || "N/A"}
                    </div>

                    <button
                      type="button"
                      onClick={() => gotoEvent(expo)}
                      className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-left text-(--primary-color) font-semibold hover:underline cursor-pointer"
                    >
                      {expo?.event?.name || "N/A"}
                    </button>

                    <div className="px-4 py-3 border-r border-[rgba(var(--palette-grey-500Channel)_/_12%)] text-[var(--palette-text-primary)] font-semibold">
                      {expo?.marketName || "N/A"}
                    </div>

                    <div className="px-4 py-3 text-center text-[var(--palette-text-primary)] font-semibold">
                      {expo?.betCounts || 0}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[14px] border border-dashed border-[rgba(var(--palette-grey-500Channel)_/_22%)] px-4 py-8 text-center text-[13px] text-[var(--palette-text-secondary)]">
                No real-time records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}