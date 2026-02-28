"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 👇 Yahan 'inplay' prop add kiya hai
export function AnimatedNumber({
    value,
    inplay
}: {
    value: number | string | null | undefined;
    inplay?: boolean;
}) {
    const initialValue = Number(value) || 0;
    const [currentVal, setCurrentVal] = useState(initialValue);

    // 1. External socket ya API update aaye toh usko sync karein
    useEffect(() => {
        setCurrentVal(Number(value) || 0);
    }, [value]);

    // 2. Auto Increment (Fake Ticker)
    useEffect(() => {
        // 🛑 AGAR MATCH IN-PLAY NAHI HAI, TO YAHI SE WAPAS CHALEY JAO (AUTO UPDATE MAT KARO)
        if (!inplay) return;

        let timeoutId: NodeJS.Timeout;

        const autoUpdate = () => {
            const randomAdd = Math.floor(Math.random() * 2000) + 500;
            setCurrentVal((prev) => prev + randomAdd);

            const randomDelay = Math.floor(Math.random() * 2000) + 2000;
            timeoutId = setTimeout(autoUpdate, randomDelay);
        };

        timeoutId = setTimeout(autoUpdate, 2000);

        return () => clearTimeout(timeoutId);
    }, [inplay]); // 👈 Dependency array main 'inplay' daal diya

    // 3. Format Number (Remove Decimals)
    const formattedArr = Math.floor(currentVal).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).split('');

    return (
        <span id="animatedNumber.tsx">
            <span className="inline-flex items-center overflow-hidden tabular-nums">
                {formattedArr.map((char, i) => {
                    const place = formattedArr.length - i;

                    return (
                        <span key={place} className="relative inline-flex justify-center">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.span
                                    key={char}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{
                                        duration: 0.4,
                                        ease: "easeOut",
                                        delay: i * 0.08
                                    }}
                                    className="inline-block"
                                >
                                    {char}
                                </motion.span>
                            </AnimatePresence>
                        </span>
                    );
                })}
            </span>
        </span>
    );
}