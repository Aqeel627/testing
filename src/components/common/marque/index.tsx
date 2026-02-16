// "use client";

// import { useAppStore } from "@/lib/store/store";
// import { useEffect } from "react";

// export default function Marque() {
//   const { exchangeNews } = useAppStore();  

//   useEffect(() => {
//     if (exchangeNews && exchangeNews.length > 0) {
//       console.log("Exchange News:", exchangeNews);
//     }
//   }, [exchangeNews]);

//   if (!exchangeNews || exchangeNews.length === 0) return null;  

//   return (
//     <div className="announcement-root">
//       <div className="announcement-icon">
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           aria-hidden="true"
//           role="img"
//           viewBox="0 0 24 24"
//           className="announcement-svg"
//         >
//           <g fill="none" fillRule="evenodd">
//             <path
//               fill="currentColor"
//               d="M15.992 3.013C17.326 2.236 19 3.197 19 4.741V8a3 3 0 1 1 0 6v3c0 1.648-1.881 2.589-3.2 1.6l-2.06-1.546A8.66 8.66 0 0 0 10 15.446v2.844a2.71 2.71 0 0 1-5.316.744l-1.57-5.496a4.7 4.7 0 0 1 3.326-7.73l3.018-.168a9.34 9.34 0 0 0 4.19-1.259zM5.634 15.078l.973 3.407A.71.71 0 0 0 8 18.29v-3.01l-1.56-.087a5 5 0 0 1-.806-.115M20 11a1 1 0 0 0-1-1v2a1 1 0 0 0 1-1"
//             />
//           </g>
//         </svg>
//       </div>

//       <div className="announcement-message">
//         {exchangeNews[0]?.message || "First in Live Casino, Try our Real Time Chat in our casino and chat with Dealer in Real Time. Live Casino Launched! Bet Now and Chase Unlimited Wins!"}
//       </div>
//     </div>
//   );
// }

"use client";
import Icon from "@/icons/icons";

export default function Marque() {
  return (
    <div className="announcement-root flex items-center gap-3 px-4 py-[1px]  bg-[rgba(var(--palette-primary-mainChannel)_/_16%)] rounded">
      <div className="announcement-icon flex-shrink-0">
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          viewBox="0 0 24 24"
          className="w-6 h-6 text-[#098DEE]"
        >
          <g fill="none" fillRule="evenodd">
            <path
              fill="currentColor"
              d="M15.992 3.013C17.326 2.236 19 3.197 19 4.741V8a3 3 0 1 1 0 6v3c0 1.648-1.881 2.589-3.2 1.6l-2.06-1.546A8.66 8.66 0 0 0 10 15.446v2.844a2.71 2.71 0 0 1-5.316.744l-1.57-5.496a4.7 4.7 0 0 1 3.326-7.73l3.018-.168a9.34 9.34 0 0 0 4.19-1.259zM5.634 15.078l.973 3.407A.71.71 0 0 0 8 18.29v-3.01l-1.56-.087a5 5 0 0 1-.806-.115M20 11a1 1 0 0 0-1-1v2a1 1 0 0 0 1-1"
            />
          </g>
        </svg> */}
        <Icon name="marque" className="h-5 w-5" />
      </div>

      <div className="announcement-message text-sm text-[rgb(7,141,238)]">
        First in Live Casino, Try our Real Time Chat in our casino and chat with
        Dealer in Real Time. Live Casino Launched! Bet Now and Chase Unlimited
        Wins!
      </div>
    </div>
  );
}
