"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EventTimerProps {
  startTime: string | number | Date;
}

export function EventTimer({ startTime }: EventTimerProps) {
  const [displayTime, setDisplayTime] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const targetDate = new Date(startTime);
      const now = new Date();
      
      const diff = targetDate.getTime() - now.getTime();
      const hours24 = 24 * 60 * 60 * 1000;

      // Agar time valid nahi hai toh kuch na karein
      if (isNaN(diff)) return;

      if (diff > 0 && diff <= hours24) {
        // 24 ghante se kam time ho toh Countdown chalega (HH:mm:ss)
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        setDisplayTime(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
        );
      } else {
        // 24 ghante se zyada time ho (ya event guzar chuka ho) toh Date aur Time dikhega
        const day = String(targetDate.getDate()).padStart(2, "0");
        const month = String(targetDate.getMonth() + 1).padStart(2, "0");
        const year = targetDate.getFullYear();
        const hours = String(targetDate.getHours()).padStart(2, "0");
        const mins = String(targetDate.getMinutes()).padStart(2, "0");
        
        // Yahan space ko proper format mein add kiya gaya hai
        setDisplayTime(`${day}-${month}-${year} ${hours}:${mins}`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const charactersArr = displayTime.split('');

  return (
    <span className="inline-flex items-center overflow-hidden tabular-nums font-mono">
      {charactersArr.map((char, i) => {
        // Space ko check karna zaroori hai
        const isSpace = char === ' ';
        const isNumber = !isNaN(Number(char)) && !isSpace;
        
        return (
          <span 
            key={i} 
            className="relative inline-flex justify-center"
            // Numbers ko fixed width aur baqiyon ko auto taake layout na hile
            style={{ width: isNumber ? '1ch' : 'auto' }} 
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={char} // Jab character change hoga, tabhi yahan animation chalegi
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{
                  duration: 0.3, // Thoda fast kiya hai taake tick feel natural ho
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {/* Agar space hai toh HTML entity use karein, warna character */}
                {isSpace ? "\u00A0" : char}
              </motion.span>
            </AnimatePresence>
          </span>
        );
      })}
    </span>
  );
}