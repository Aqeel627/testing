// // src/app/test-sound2/page.tsx
// 'use client';

// import { useAudioFeedback } from '@/lib/hooks/useAudioFeedback';
// import { useState } from 'react';

// export default function TestSound2Page() {
//   const { playSuccess, playError, volume, setVolume, enabled, setEnabled } = useAudioFeedback();
//   const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
//   const [pressed, setPressed] = useState<string | null>(null);

//   const handleSuccess = () => {
//     playSuccess();
//     setNotification({ type: 'success', msg: '✅ Bet placed successfully! #BET-00472 confirmed.' });
//     setPressed('success');
//     setTimeout(() => {
//       setNotification(null);
//       setPressed(null);
//     }, 3000);
//   };

//   const handleError = () => {
//     playError();
//     setNotification({ type: 'error', msg: '❌ Bet failed. Insufficient balance or odds changed.' });
//     setPressed('error');
//     setTimeout(() => {
//       setNotification(null);
//       setPressed(null);
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen bg-slate-900 text-slate-100 p-6 flex items-center justify-center">
//       <div className="w-full max-w-xl">
        
//         {/* Header */}
//         <header className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-2">
//             <span className="text-5xl">🎰</span>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
//               BetSound Test
//             </h1>
//           </div>
//           <p className="text-slate-400 text-sm">Audio Feedback Testing Panel</p>
//         </header>

//         {/* Card */}
//         <main className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl space-y-6">
          
//           {/* Mock Bet Slip */}
//           <div className="bg-slate-950 border border-slate-700 rounded-lg overflow-hidden">
//             <div className="flex justify-between items-center px-4 py-3 bg-slate-800/50 border-b border-slate-700">
//               <span className="text-xs font-semibold uppercase tracking-wide text-amber-400">Test Bet</span>
//               <span className="text-xs text-slate-500 font-mono">#BET-00472</span>
//             </div>
//             <div className="p-4 space-y-2.5">
//               <div className="flex items-center justify-center gap-3 pb-3 border-b border-slate-700">
//                 <span className="font-semibold">Man United</span>
//                 <span className="text-xs text-slate-500 uppercase">vs</span>
//                 <span className="font-semibold">Liverpool</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Selection</span>
//                 <span className="text-amber-400 font-medium">Man United</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Odds</span>
//                 <span className="text-cyan-400 font-bold">2.45</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Stake</span>
//                 <span className="font-semibold">$25.00</span>
//               </div>
//               <div className="flex justify-between text-sm">
//                 <span className="text-slate-400">Potential Return</span>
//                 <span className="text-green-400 font-bold">$61.25</span>
//               </div>
//             </div>
//           </div>

//           {/* Test Buttons */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <button
//               onClick={handleSuccess}
//               className={`
//                 relative flex items-center gap-3 px-4 py-3.5 rounded-lg border-2
//                 bg-gradient-to-br from-green-500/15 to-green-500/5 border-green-500 text-green-400
//                 transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 hover:bg-green-500/20
//                 ${pressed === 'success' ? 'scale-95' : 'hover:scale-[1.02]'}
//               `}
//             >
//               <span className="text-2xl">✅</span>
//               <div className="flex flex-col items-start text-left">
//                 <strong className="text-sm">Success</strong>
//                 <small className="text-xs opacity-70">Confirmed bet</small>
//               </div>
//             </button>

//             <button
//               onClick={handleError}
//               className={`
//                 relative flex items-center gap-3 px-4 py-3.5 rounded-lg border-2
//                 bg-gradient-to-br from-red-500/15 to-red-500/5 border-red-500 text-red-400
//                 transition-all duration-200 hover:shadow-lg hover:shadow-red-500/25 hover:bg-red-500/20
//                 ${pressed === 'error' ? 'scale-95' : 'hover:scale-[1.02]'}
//               `}
//             >
//               <span className="text-2xl">❌</span>
//               <div className="flex flex-col items-start text-left">
//                 <strong className="text-sm">Error</strong>
//                 <small className="text-xs opacity-70">Failed bet</small>
//               </div>
//             </button>
//           </div>

//           {/* Notification */}
//           {notification && (
//             <div
//               className={`
//                 flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium
//                 animate-in fade-in slide-in-from-top-2 duration-300
//                 ${notification.type === 'success' 
//                   ? 'bg-green-500/10 border-green-500/30 text-green-400' 
//                   : 'bg-red-500/10 border-red-500/30 text-red-400'}
//               `}
//             >
//               <span>{notification.msg}</span>
//             </div>
//           )}

//           {/* Controls */}
//           <div className="pt-4 border-t border-slate-700 space-y-3">
            
//             {/* Volume Slider */}
//             <div className="flex items-center gap-3">
//               <label className="text-sm text-slate-400 min-w-[90px]">🔊 Volume</label>
//               <input
//                 type="range"
//                 min="0"
//                 max="100"
//                 value={volume}
//                 onChange={(e) => setVolume(parseInt(e.target.value))}
//                 className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer
//                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
//                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
//                   [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-lg 
//                   [&::-webkit-slider-thumb]:shadow-amber-400/40 [&::-webkit-slider-thumb]:hover:scale-110
//                   [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
//                   [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-0"
//               />
//               <span className="text-sm text-amber-400 font-mono min-w-[36px] text-right font-semibold">
//                 {volume}%
//               </span>
//             </div>

//             {/* Toggle */}
//             <label className="flex items-center gap-3 cursor-pointer select-none">
//               <span className="text-sm text-slate-400 min-w-[90px]">Enabled</span>
//               <input
//                 type="checkbox"
//                 checked={enabled}
//                 onChange={(e) => setEnabled(e.target.checked)}
//                 className="sr-only peer"
//               />
//               <div className="relative w-10 h-5 bg-slate-700 rounded-full peer-checked:bg-green-500/30
//                 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 
//                 after:bg-slate-400 after:rounded-full after:transition-all peer-checked:after:translate-x-5 
//                 peer-checked:after:bg-green-400 peer-checked:after:shadow-lg peer-checked:after:shadow-green-400/40"
//               />
//             </label>
//           </div>

//         </main>

//         {/* Footer */}
//         <footer className="text-center mt-6 text-xs text-slate-500">
//           Web Audio API • No external files • TypeScript + Tailwind
//         </footer>
//       </div>
//     </div>
//   );
// }








// src/app/test-sound2/page.tsx
'use client';

import { useAudioFeedback } from '@/lib/hooks/useAudioFeedback';
import { useState } from 'react';

type SoundType = 'success' | 'error';

export default function TestSound2Page() {
  const {
    playSuccess1, playSuccess2, playSuccess3, playSuccess4, playSuccess5,
    playError1, playError2, playError3, playError4, playError5,
    volume, setVolume, enabled, setEnabled
  } = useAudioFeedback();

  const [notification, setNotification] = useState<{ type: SoundType; msg: string } | null>(null);
  const [pressed, setPressed] = useState<string | null>(null);

  const handleSound = (type: SoundType, variant: number, callback: () => void, name: string) => {
    callback();
    const icon = type === 'success' ? '✅' : '❌';
    setNotification({ type, msg: `${icon} ${name} played` });
    setPressed(`${type}-${variant}`);
    setTimeout(() => {
      setNotification(null);
      setPressed(null);
    }, 2000);
  };

  const successSounds = [
    { id: 1, name: 'Classic Triad', desc: 'C-E-G ascending', fn: playSuccess1 },
    { id: 2, name: 'Bell Chime', desc: 'Bright shimmer', fn: playSuccess2 },
    { id: 3, name: 'Arpeggio', desc: 'Uplifting flow', fn: playSuccess3 },
    { id: 4, name: 'Dreamy Glide', desc: 'Frequency sweep', fn: playSuccess4 },
    { id: 5, name: 'Jackpot', desc: 'Rapid cascade', fn: playSuccess5 },
  ];

  const errorSounds = [
    { id: 1, name: 'Tritone', desc: 'Descending buzz', fn: playError1 },
    { id: 2, name: 'Sharp Alarm', desc: 'High frequency', fn: playError2 },
    { id: 3, name: 'Low Warning', desc: 'Deep pulse', fn: playError3 },
    { id: 4, name: 'Mechanical', desc: 'Sweep + noise', fn: playError4 },
    { id: 5, name: 'Digital Glitch', desc: 'Staccato chaos', fn: playError5 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🎵</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Audio Variants
            </h1>
          </div>
          <p className="text-slate-400 text-sm">10 Unique Success & Error Sounds</p>
        </header>

        {/* Main Card */}
        <main className="bg-slate-800 border border-slate-700 rounded-xl p-8 shadow-2xl space-y-8">
          
          {/* Notification */}
          {notification && (
            <div
              className={`
                flex items-center justify-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium
                animate-in fade-in slide-in-from-top-2 duration-300
                ${notification.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'}
              `}
            >
              <span>{notification.msg}</span>
            </div>
          )}

          {/* Success Sounds */}
          <section>
            <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>✅</span> Success Sounds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {successSounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleSound('success', sound.id, sound.fn, sound.name)}
                  className={`
                    relative flex flex-col items-start gap-1 px-4 py-3 rounded-lg border-2
                    bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/50 
                    text-green-400 transition-all duration-200 
                    hover:border-green-500 hover:bg-green-500/15 hover:shadow-lg hover:shadow-green-500/20
                    ${pressed === `success-${sound.id}` ? 'scale-95' : 'hover:scale-[1.02]'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔊</span>
                    <strong className="text-sm">{sound.name}</strong>
                  </div>
                  <small className="text-xs opacity-70">{sound.desc}</small>
                  <div className="absolute top-2 right-2 text-xs font-mono opacity-50">S{sound.id}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Error Sounds */}
          <section>
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>❌</span> Error Sounds
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {errorSounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => handleSound('error', sound.id, sound.fn, sound.name)}
                  className={`
                    relative flex flex-col items-start gap-1 px-4 py-3 rounded-lg border-2
                    bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/50 
                    text-red-400 transition-all duration-200 
                    hover:border-red-500 hover:bg-red-500/15 hover:shadow-lg hover:shadow-red-500/20
                    ${pressed === `error-${sound.id}` ? 'scale-95' : 'hover:scale-[1.02]'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🔊</span>
                    <strong className="text-sm">{sound.name}</strong>
                  </div>
                  <small className="text-xs opacity-70">{sound.desc}</small>
                  <div className="absolute top-2 right-2 text-xs font-mono opacity-50">E{sound.id}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Controls */}
          <section className="pt-6 border-t border-slate-700 space-y-4">
            <h3 className="text-lg font-semibold text-slate-300">Controls</h3>
            
            {/* Volume */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-slate-400 min-w-[90px]">🔊 Volume</label>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-lg 
                  [&::-webkit-slider-thumb]:shadow-amber-400/40 [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-amber-400 [&::-moz-range-thumb]:border-0"
              />
              <span className="text-sm text-amber-400 font-mono min-w-[42px] text-right font-semibold">
                {volume}%
              </span>
            </div>

            {/* Toggle */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <span className="text-sm text-slate-400 min-w-[90px]">Enabled</span>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="relative w-10 h-5 bg-slate-700 rounded-full peer-checked:bg-green-500/30
                after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 
                after:bg-slate-400 after:rounded-full after:transition-all peer-checked:after:translate-x-5 
                peer-checked:after:bg-green-400 peer-checked:after:shadow-lg peer-checked:after:shadow-green-400/40"
              />
            </label>
          </section>

        </main>

        {/* Footer */}
        <footer className="text-center mt-6 text-xs text-slate-500 space-y-1">
          <p>Web Audio API • 10 Synthesized Sounds • No External Files</p>
          <p className="text-slate-600">
            Success: Classic, Bell, Arpeggio, Glide, Jackpot • Error: Tritone, Alarm, Warning, Mechanical, Glitch
          </p>
        </footer>
      </div>
    </div>
  );
}