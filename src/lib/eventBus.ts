// utils/eventBus.ts

import { EventEmitter } from "events";

const globalAny = global as any;

// prevent multiple instances in Next.js (SSR + CSR)
if (!globalAny.__eventBus__) {
    globalAny.__eventBus__ = new EventEmitter();
}

export const eventBus = {
    emit(event: string, detail?: any) {
        window.dispatchEvent(new CustomEvent(event, { detail }));
    },

    on(event: string, callback: (data?: any) => void) {
        const handler = (e: Event) => callback((e as CustomEvent).detail);
        window.addEventListener(event, handler);
        return () => window.removeEventListener(event, handler);
    },
};
