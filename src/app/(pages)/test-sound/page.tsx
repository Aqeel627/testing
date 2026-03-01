// "use client"

// import { useRef } from "react"

// export default function TestSoundPage() {
//   const successRef = useRef<HTMLAudioElement | null>(null)
//   const errorRef = useRef<HTMLAudioElement | null>(null)

//   const playSuccess = () => {
//     if (!successRef.current) return
//     successRef.current.currentTime = 0
//     successRef.current.play()
//   }

//   const playError = () => {
//     if (!errorRef.current) return
//     errorRef.current.currentTime = 0
//     errorRef.current.play()
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-black flex items-center justify-center p-6">

//       {/* Glass Card */}
//       <div className="w-full max-w-xl backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">

//         {/* Glow Background */}
//         <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500/20 blur-3xl rounded-full"></div>
//         <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-red-500/20 blur-3xl rounded-full"></div>

//         <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-wide">
//           Betting Sound Test
//         </h1>

//         <p className="text-gray-400 text-sm mb-10">
//           Experience premium audio feedback for bet placement.
//         </p>

//         <div className="flex flex-col md:flex-row gap-6 justify-center">

//           {/* Success Button */}
//           <button
//             onClick={playSuccess}
//             className="relative group px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
//           >
//             <span className="relative z-10">Bet Successful</span>
//             <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-white/10"></span>
//           </button>

//           {/* Error Button */}
//           <button
//             onClick={playError}
//             className="relative group px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/30"
//           >
//             <span className="relative z-10">Bet Failed</span>
//             <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-white/10"></span>
//           </button>

//         </div>

//         {/* Footer */}
//         <div className="mt-12 text-xs text-gray-500 tracking-widest uppercase">
//           Premium Betting UX Audio Feedback
//         </div>

//         {/* Audio Elements */}
//         <audio
//           ref={successRef}
//           src="/sounds/bet-success.mp3"
//           preload="auto"
//         />
//         <audio
//           ref={errorRef}
//           src="/sounds/bet-error.mp3"
//           preload="auto"
//         />

//       </div>
//     </div>
//   )
// }





"use client";

import { useState, useEffect } from "react";
import {
  playSuccessSound,
  playErrorSound,
  toggleBetSound,
  isBetSoundEnabled,
} from "@/lib/betSound";

export default function TestSoundPage() {
  const [stake, setStake] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Load sound state from your lib
  useEffect(() => {
    setSoundOn(isBetSoundEnabled());
  }, []);

  const handlePlaceBet = () => {
    if (stake < 2) {
      playErrorSound();
      return;
    }

    setPlacing(true);

    // Fake success after 1 second
    setTimeout(() => {
      playSuccessSound();
      setPulse(true);

      setTimeout(() => setPulse(false), 1000);
      setStake(0);
      setPlacing(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-6 text-white">
      <div className="w-full max-w-md bg-[#111827] p-8 rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden">

        <h1 className="text-2xl font-bold text-green-400 text-center mb-2">
          🎰 Betting Sound Test
        </h1>

        <p className="text-gray-400 text-center text-sm mb-6">
          Testing real sound system from /lib/betSound
        </p>

        {/* Stake Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[25, 50, 75, 100].map((value) => (
            <button
              key={value}
              onClick={() => setStake((prev) => prev + value)}
              className="py-2 rounded-full bg-gray-700 hover:bg-gray-600 transition text-sm font-semibold"
            >
              +{value}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-lg font-semibold">
            Stake: <span className="text-green-400">${stake}</span>
          </p>
        </div>

        {/* Place Bet */}
        <button
          onClick={handlePlaceBet}
          disabled={placing}
          className={`w-full py-3 rounded-full font-bold transition-all ${
            pulse
              ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
              : "bg-green-600 hover:bg-green-500"
          } ${placing ? "opacity-50" : ""}`}
        >
          {placing ? "Placing..." : "Place Bet"}
        </button>

        {/* Force Error */}
        <button
          onClick={playErrorSound}
          className="w-full mt-4 py-3 rounded-full bg-red-600 hover:bg-red-500 font-semibold transition-all shadow-lg shadow-red-600/40"
        >
          Trigger Error Sound
        </button>

        {/* Sound Toggle */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-400">Sound Enabled</span>

          <button
            onClick={() => setSoundOn(toggleBetSound())}
            className={`relative w-14 h-7 rounded-full transition ${
              soundOn ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                soundOn ? "left-8" : "left-1"
              }`}
            />
          </button>
        </div>

        {/* Chip Animation */}
        {pulse && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 bg-yellow-400 rounded-full animate-bounce shadow-lg" />
          </div>
        )}
      </div>
    </div>
  );
}