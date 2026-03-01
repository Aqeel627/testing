// // src/hooks/useAudioFeedback.ts
// 'use client';

// import { useState, useCallback, useEffect } from 'react';
// import { getAudioFeedback } from '@/lib/audioFeedback';

// export const useAudioFeedback = () => {
//   const [audio] = useState(() => getAudioFeedback());
//   const [volume, setVolumeState] = useState(50);
//   const [enabled, setEnabledState] = useState(true);

//   const playSuccess = useCallback(() => audio.playSuccess(), [audio]);
//   const playError = useCallback(() => audio.playError(), [audio]);

//   const setVolume = useCallback((val: number) => {
//     const normalized = Math.max(0, Math.min(100, val));
//     setVolumeState(normalized);
//     audio.setVolume(normalized / 100);
//   }, [audio]);

//   const setEnabled = useCallback((val: boolean) => {
//     setEnabledState(val);
//     audio.setEnabled(val);
//   }, [audio]);

//   useEffect(() => () => audio.destroy(), [audio]);

//   return { playSuccess, playError, volume, setVolume, enabled, setEnabled };
// };






// src/hooks/useAudioFeedback.ts
'use client';

import { useState, useCallback, useEffect } from 'react';
import { getAudioFeedback } from '@/lib/audioFeedback';

export const useAudioFeedback = () => {
  const [audio] = useState(() => getAudioFeedback());
  const [volume, setVolumeState] = useState(50);
  const [enabled, setEnabledState] = useState(true);

  const playSuccess1 = useCallback(() => audio.playSuccess1(), [audio]);
  const playSuccess2 = useCallback(() => audio.playSuccess2(), [audio]);
  const playSuccess3 = useCallback(() => audio.playSuccess3(), [audio]);
  const playSuccess4 = useCallback(() => audio.playSuccess4(), [audio]);
  const playSuccess5 = useCallback(() => audio.playSuccess5(), [audio]);

  const playError1 = useCallback(() => audio.playError1(), [audio]);
  const playError2 = useCallback(() => audio.playError2(), [audio]);
  const playError3 = useCallback(() => audio.playError3(), [audio]);
  const playError4 = useCallback(() => audio.playError4(), [audio]);
  const playError5 = useCallback(() => audio.playError5(), [audio]);

  const setVolume = useCallback((val: number) => {
    const normalized = Math.max(0, Math.min(100, val));
    setVolumeState(normalized);
    audio.setVolume(normalized / 100);
  }, [audio]);

  const setEnabled = useCallback((val: boolean) => {
    setEnabledState(val);
    audio.setEnabled(val);
  }, [audio]);

  useEffect(() => () => audio.destroy(), [audio]);

  return {
    playSuccess1,
    playSuccess2,
    playSuccess3,
    playSuccess4,
    playSuccess5,
    playError1,
    playError2,
    playError3,
    playError4,
    playError5,
    volume,
    setVolume,
    enabled,
    setEnabled,
  };
};