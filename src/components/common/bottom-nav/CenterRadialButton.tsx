// "use client";
// import { useState } from "react";
// import Icon from "@/icons/icons";

// const CenterRadialButton = () => {
//   const [open, setOpen] = useState(false);

//   const rotations = [-60, -20, 20, 60];

//   return (
//     <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex items-center justify-center pointer-events-none">

//       {/* SEMI BACKGROUND */}
//       <div
//         className={`absolute bottom-8 w-[220px] h-[220px] rounded-full transition-transform duration-500 ease-out
//         ${open ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
//         style={{
//           background: "#111", // like 2nd image dark bg
//           boxShadow: "0px 10px 40px rgba(0,0,0,0.5)",
//           transformOrigin: "bottom center",
//           zIndex: 0,
//         }}
//       />

//       {/* RADIAL ICONS */}
//       {rotations.map((deg, i) => (
//         <span
//           key={i}
//           className="absolute bottom-12 left-1/2 w-[50px] h-[50px] -translate-x-1/2 transition-all duration-500 pointer-events-auto"
//           style={
//             open
//               ? {
//                   transform: `rotate(${deg}deg) translateY(-85px) rotate(${-deg}deg)`,
//                   transitionDelay: `${i * 0.1}s`,
//                 }
//               : {
//                   transform: "translate(-50%, 0)",
//                 }
//           }
//         >
//           <div className="w-[50px] h-[50px] rounded-full bg-white shadow-lg flex items-center justify-center">
//             <Icon name="telegram" width={22} height={22} />
//           </div>
//         </span>
//       ))}

//       {/* CENTER BUTTON */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="relative z-10 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-xl pointer-events-auto"
//         style={{
//           background: "#fff",
//         }}
//       >
//         {open ? (
//           <span className="text-xl font-bold">✕</span>
//         ) : (
//           <Icon name="whatsapp" width={28} height={28} />
//         )}
//       </button>
//     </div>
//   );
// };

// export default CenterRadialButton;



// "use client";
// import { useState } from "react";
// import Icon from "@/icons/icons";

// const CenterRadialButton = () => {
//   const [open, setOpen] = useState(false);

//   // same angles like your Angular arc
//   const rotations = [-60, -20, 20, 60];

//   return (
//     // IMPORTANT: absolute relative to navbar (navbar must be "relative")
//     <div className="absolute left-1/2 bottom-0 z-[60] pointer-events-none">
//       <div className="relative w-[70px] h-[70px]">
//         {/* SEMI CIRCLE BACKGROUND (like Angular: overflow hidden + inner circle) */}
//         {/* <div
//           className={`absolute left-1/2 bottom-[52px] w-[260px] h-[140px] overflow-hidden rotate-180 transition-opacity duration-150
//           ${open ? "opacity-100" : "opacity-0"}`}
//           style={{ transform: "translateX(-50%) rotate(180deg)" }}
//         >
//           <div
//             className={`absolute left-1/2 top-1/2 w-[260px] h-[260px] rounded-full bg-[#111]
//             shadow-[inset_1px_5px_10px_rgba(20,20,20,0.35)]
//             transition-transform duration-500
//             [transition-timing-function:cubic-bezier(0,1.16,1,1)]
//             ${open ? "scale-100" : "scale-0"}`}
//             style={{ transform: "translate(-50%, -52.5%) scale(var(--tw-scale-x))" }}
//           />
//         </div> */}
//         {/* PERFECT SEMI CIRCLE BACKGROUND */}
// <div
//   className={`absolute left-1/2 bottom-[60px] w-[260px] h-[130px] 
//   overflow-hidden transition-opacity duration-200
//   ${open ? "opacity-100" : "opacity-0"}`}
//   style={{ transform: "translateX(-50%)" }}
// >
//   <div
//     className={`absolute left-1/2 top-0 w-[260px] h-[260px] 
//     -translate-x-1/2 rounded-full bg-[#111]
//     shadow-[inset_0_8px_25px_rgba(0,0,0,0.6)]
//     transition-transform duration-500
//     [transition-timing-function:cubic-bezier(0,1.16,1,1)]
//     ${open ? "scale-100" : "scale-0"}`}
//     style={{
//       transformOrigin: "center top"
//     }}
//   />
// </div>

//         {/* RADIAL ICONS */}
//         {rotations.map((deg, i) => (
//           <span
//             key={i}
//             className="absolute left-1/2 bottom-0 w-[50px] h-[50px] pointer-events-auto transition-transform duration-500"
//             style={{
//               transform: open
//                 ? `translateX(-50%) translateY(-18px) rotate(${deg}deg) translateY(-95px) rotate(${-deg}deg)`
//                 : `translateX(-50%) translateY(-18px)`,
//               transitionDelay: open ? `${i * 0.1}s` : "0s",
//             }}
//           >
//             <div className="w-[50px] h-[50px] rounded-full bg-white shadow-lg flex items-center justify-center">
//               <Icon name="telegram" width={22} height={22} />
//             </div>
//           </span>
//         ))}

//         {/* CENTER BUTTON */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="absolute left-1/2 bottom-0 w-[60px] h-[60px] rounded-full bg-white shadow-xl pointer-events-auto z-10"
//           style={{ transform: "translateX(-50%) translateY(-18px)" }}
//         >
//           <div className="w-full h-full flex items-center justify-center">
//             {open ? (
//               <span className="text-[34px] leading-none font-medium">×</span>
//             ) : (
//               <Icon name="whatsapp" width={28} height={28} />
//             )}
//           </div>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CenterRadialButton;






// "use client";
// import { useState } from "react";
// import Icon from "@/icons/icons";

// const CenterRadialButton = () => {
//   const [open, setOpen] = useState(false);

//   // Angles for arc
//   const rotations = [-60, -20, 20, 60];

//   // Random / different icons for circles
//   const radialIcons = ["telegram", "whatsapp", "instagram", "facebook"];

//   return (
//     <div className="absolute left-1/2 bottom-0 z-[60] pointer-events-none">
//       <div className="relative w-[70px] h-[70px]">
        
//         {/* PERFECT SEMI CIRCLE BACKGROUND */}
//         <div
//           className={`absolute left-1/2 bottom-[60px] w-[260px] h-[130px] 
//           overflow-hidden transition-opacity duration-200
//           ${open ? "opacity-100" : "opacity-0"}`}
//           style={{ transform: "translateX(-50%)" }}
//         >
//           <div
//             className={`absolute left-1/2 top-0 w-[260px] h-[260px] 
//             -translate-x-1/2 rounded-full bg-[#111]
//             shadow-[inset_0_8px_25px_rgba(0,0,0,0.6)]
//             transition-transform duration-500
//             [transition-timing-function:cubic-bezier(0,1.16,1,1)]
//             ${open ? "scale-100" : "scale-0"}`}
//             style={{ transformOrigin: "center top" }}
//           />
//         </div>

//         {/* RADIAL ICONS */}
//         {rotations.map((deg, i) => (
//           <span
//             key={i}
//             className="absolute left-1/2 bottom-0 w-[50px] h-[50px] pointer-events-auto transition-transform duration-500"
//             style={{
//               transform: open
//                 ? `translateX(-50%) translateY(-18px) rotate(${deg}deg) translateY(-95px) rotate(${-deg}deg)`
//                 : `translateX(-50%) translateY(-18px)`,
//               transitionDelay: open ? `${i * 0.1}s` : "0s",
//             }}
//           >
//             <div className="w-[50px] h-[50px] rounded-full bg-white shadow-lg flex items-center justify-center">
//               <Icon name={radialIcons[i]} width={22} height={22} />
//             </div>
//           </span>
//         ))}

//         {/* CENTER BUTTON */}
//         <button
//           onClick={() => setOpen(!open)}
//           className="absolute left-1/2 bottom-0 w-[60px] h-[60px] rounded-full bg-white shadow-xl pointer-events-auto z-10 flex items-center justify-center"
//           style={{ transform: "translateX(-50%) translateY(-18px)" }}
//         >
//           {open ? (
//             // Cross icon when open
//             <span className="text-[32px] leading-none font-medium">×</span>
//           ) : (
//             // Plus icon when closed
//             <span className="text-[32px] leading-none font-medium">+</span>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CenterRadialButton;









// "use client";
// import { useState } from "react";
// import Icon from "@/icons/icons";
// import { cn } from "@/lib/utils";
// import { useTheme } from "next-themes";

// const CenterRadialButton = () => {
//   const [open, setOpen] = useState(false);
//   const { theme } = useTheme();

//   const rotations = [-60, -20, 20, 60];
//   const radialIcons = ["telegram", "whatsapp", "instagram", "facebook"];

//   return (
//     // Absolute inside navbar — perfectly centered
//     <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-[70] pointer-events-none">
//       <div className="relative w-[70px] h-[70px]">

//         {/* GLASS SEMI CIRCLE BACKGROUND */}
//         <div
//           className={cn(
//             "absolute left-1/2 bottom-[60px] w-[260px] h-[130px] overflow-hidden transition-all duration-300",
//             open ? "opacity-100 scale-100" : "opacity-0 scale-95"
//           )}
//           style={{ transform: "translateX(-50%)" }}
//         >
//           <div
//             className={cn(
//               "absolute left-1/2 top-0 w-[260px] h-[260px] -translate-x-1/2 rounded-full glass backdrop-blur-[25px] border",
//               theme === "dark"
//                 ? "border-[rgba(255,255,255,0.25)]"
//                 : "border-[rgba(255,255,255,0.4)]"
//             )}
//             style={{ transformOrigin: "center top" }}
//           />
//         </div>

//         {/* RADIAL ICONS */}
//         {rotations.map((deg, i) => (
//           <span
//             key={i}
//             className="absolute left-1/2 bottom-0 w-[50px] h-[50px] pointer-events-auto transition-transform duration-500"
//             style={{
//               transform: open
//                 ? `translateX(-50%) translateY(-18px) rotate(${deg}deg) translateY(-95px) rotate(${-deg}deg)`
//                 : `translateX(-50%) translateY(-18px)`,
//               transitionDelay: open ? `${i * 0.08}s` : "0s",
//             }}
//           >
//             <div
//               className={cn(
//                 "w-[50px] h-[50px] rounded-full flex items-center justify-center glass backdrop-blur-[20px] border shadow-lg",
//                 theme === "dark"
//                   ? "border-[rgba(255,255,255,0.25)]"
//                   : "border-[rgba(255,255,255,0.4)]"
//               )}
//             >
//               <Icon name={radialIcons[i]} width={22} height={22} />
//             </div>
//           </span>
//         ))}

//         {/* CENTER BUTTON (GLASS) */}
//         <button
//           onClick={() => setOpen(!open)}
//           className={cn(
//             "absolute left-1/2 bottom-0 w-[64px] h-[64px] rounded-full pointer-events-auto z-10 flex items-center justify-center transition-all duration-300 glass backdrop-blur-[25px] border shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
//             theme === "dark"
//               ? "border-[rgba(255,255,255,0.3)]"
//               : "border-[rgba(255,255,255,0.4)]",
//             open && "scale-105"
//           )}
//           style={{ transform: "translateX(-50%) translateY(-22px)" }}
//         >
//           <span className="text-[30px] font-medium transition-transform duration-300">
//             {open ? "×" : "+"}
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CenterRadialButton;



// "use client";
// import { useState } from "react";
// import Icon from "@/icons/icons";
// import { cn } from "@/lib/utils";
// import { useTheme } from "next-themes";

// const CenterRadialButton = () => {
//   const [open, setOpen] = useState(false);
//   const { theme } = useTheme();

//   const rotations = [-60, -20, 20, 60];
//   const radialIcons = ["telegram", "whatsapp", "instagram", "facebook"];

//   return (
//     // ⬆ Slightly lifted + width limited to navbar
//     // <div className="absolute left-1/2 -translate-x-1/2 bottom-[14px] z-[70] pointer-events-none w-full max-w-[420px]">
//     <div className="relative flex items-center justify-center pointer-events-none">
//       <div className="relative w-[70px] h-[70px] mx-auto">

//         {/* GLASS SEMI CIRCLE BACKGROUND */}
//         <div
// className={cn(
//   "absolute left-1/2 -translate-x-1/2 bottom-[64px] h-[125px] overflow-hidden transition-all duration-300",
//   open
//     ? "opacity-100 scale-100 visible"
//     : "opacity-0 scale-95 invisible"
// )}
// style={{
//   width: "82vw", 
// }}
//         >
//           <div
//             className={cn(
//               "absolute left-1/2 top-0 w-full aspect-square -translate-x-1/2 rounded-full glass backdrop-blur-[25px] border",
//               theme === "dark"
//                 ? "border-[rgba(255,255,255,0.25)]"
//                 : "border-[rgba(255,255,255,0.4)]"
//             )}
//             style={{ transformOrigin: "center top" }}
//           />
//         </div>

//         {/* RADIAL ICONS */}
//         {rotations.map((deg, i) => (
//           <span
//             key={i}
//             className="absolute left-1/2 bottom-0 w-[50px] h-[50px] pointer-events-auto transition-transform duration-500"
//             style={{
//               transform: open
//                 ? `translateX(-50%) translateY(-22px) rotate(${deg}deg) translateY(-95px) rotate(${-deg}deg)`
//                 : `translateX(-50%) translateY(-22px)`,
//               transitionDelay: open ? `${i * 0.08}s` : "0s",
//             }}
//           >
//             <div
//               className={cn(
//                 "w-[50px] h-[50px] rounded-full flex items-center justify-center glass backdrop-blur-[20px] border shadow-lg transition-opacity duration-300",
//                 open ? "opacity-100" : "opacity-0",
//                 theme === "dark"
//                   ? "border-[rgba(255,255,255,0.25)]"
//                   : "border-[rgba(255,255,255,0.4)]"
//               )}
//             >
//               <Icon name={radialIcons[i]} width={22} height={22} />
//             </div>
//           </span>
//         ))}

//         {/* CENTER BUTTON */}
//         <button
//           onClick={() => setOpen(!open)}
//           className={cn(
//             "absolute left-1/2 bottom-0 w-12 h-12 rounded-full pointer-events-auto z-10 flex items-center justify-center transition-all duration-300 glass backdrop-blur-[25px] border shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
//             theme === "dark"
//               ? "border-[rgba(255,255,255,0.3)]"
//               : "border-[rgba(255,255,255,0.4)]",
//             open && "scale-105"
//           )}
//         //   style={{ transform: "translateX(-50%) translateY(-22px)" }}
//         style={{ transform: "translateX(-50%) translateY(-11px)" }}
//         >
//           <span className="text-[30px] font-medium transition-transform duration-300 relative bottom-[2px]">
//             {open ? "×" : "+"}
//           </span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CenterRadialButton;


"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/icons/icons";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const CenterRadialButton = () => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current;
      if (!el) return;

      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const rotations = [-60, -20, 20, 60];
  const radialIcons = ["telegram", "whatsapp", "instagram", "facebook"];

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center pointer-events-none"
    >
      <div className="relative w-[70px] h-[70px] mx-auto">
        {/* GLASS SEMI CIRCLE BACKGROUND */}
        {/* <div
          className={cn(
            "absolute left-1/2 -translate-x-1/2 bottom-[64px] h-[125px] overflow-hidden transition-all duration-300",
            open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
          )}
          style={{ width: "82vw" }}
        > */}
        <div
  className={cn(
    "absolute left-1/2 -translate-x-1/2 bottom-[64px] h-[125px] overflow-hidden transition-all duration-300",
    "w-[77vw] max-[375px]:w-[74vw]",
    open ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
  )}
>
          <div
            className={cn(
              "absolute left-1/2 top-0 w-full aspect-square -translate-x-1/2 rounded-full glass backdrop-blur-[25px] border",
              theme === "dark"
                ? "border-[rgba(255,255,255,0.25)]"
                : "border-[rgba(255,255,255,0.4)]"
            )}
            style={{ transformOrigin: "center top" }}
          />
        </div>

        {/* RADIAL ICONS */}
        {rotations.map((deg, i) => (
          <span
            key={i}
            className="absolute left-1/2 bottom-0 w-[14vw] h-[14vw] pointer-events-auto transition-transform duration-500"
            style={{
              transform: open
                ? `translateX(-50%) translateY(-22px) rotate(${deg}deg) translateY(-95px) rotate(${-deg}deg)`
                : `translateX(-50%) translateY(-22px)`,
              transitionDelay: open ? `${i * 0.08}s` : "0s",
            }}
          >
            <div
              className={cn(
                "w-[50px] h-[50px] rounded-full flex items-center justify-center glass backdrop-blur-[20px] border shadow-lg transition-opacity duration-300",
                open ? "opacity-100" : "opacity-0",
                theme === "dark"
                  ? "border-[rgba(255,255,255,0.25)]"
                  : "border-[rgba(255,255,255,0.4)]"
              )}
            >
              <Icon name={radialIcons[i]} width={22} height={22} />
            </div>
          </span>
        ))}

        {/* CENTER BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "absolute left-1/2 bottom-0 w-12 h-12 rounded-full pointer-events-auto z-10 flex items-center justify-center transition-all duration-300 glass backdrop-blur-[25px] border shadow-[0_8px_25px_rgba(0,0,0,0.25)]",
            theme === "dark"
              ? "border-[rgba(255,255,255,0.3)]"
              : "border-[rgba(255,255,255,0.4)]",
            // open && "scale-105"
          )}
          style={{ transform: "translateX(-50%) translateY(-11px)" }}
        >
          <span className="text-[30px] font-medium transition-transform duration-300 relative bottom-[2px]">
            {open ? "×" : "+"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default CenterRadialButton;