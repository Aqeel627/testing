"use client";

import { io, Socket } from "socket.io-client";
// import { CONFIG } from "@/config";
import { BASE_URL_API } from "./config";

type SubscribePayload = any;
const SOCKET_PATH = "/market-based-sports";

class WebSocketService {
    private static _instance: WebSocketService;

    private socket: Socket | null = null;
    private coreListenersBound = false;
    private lastPayloads?: SubscribePayload;
    private lastSubscribeKey = "";
    private isLoggedIn = false;

    private constructor() {
        // Initial login state (simple localStorage check, like Angular)
        if (typeof window !== "undefined") {
            this.isLoggedIn = !!localStorage.getItem("token");
        }
    }

    // 🧊 Singleton instance
    static getInstance(): WebSocketService {
        if (!WebSocketService._instance) {
            WebSocketService._instance = new WebSocketService();
        }
        return WebSocketService._instance;
    }

    /** Create socket (singleton) */
    private createSocket() {
        if (this.socket) return; // already exists
        if (typeof window === "undefined") return; // SSR guard

        this.socket = io(BASE_URL_API, {
            path: SOCKET_PATH,
            transports: ["websocket"],
            autoConnect: false,
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 2000,
        });

        this.bindCoreListeners();
        this.socket.connect();
    }

    /** Bind connect / disconnect etc once */
    private bindCoreListeners() {
        if (!this.socket || this.coreListenersBound) return;
        this.coreListenersBound = true;

        this.socket.on("connect", () => {
            // console.log("[SOCKET connected]", this.socket?.id);
            this.resubscribeIfNeeded();
        });

        this.socket.on("disconnect", (reason) => {
            // console.warn("[SOCKET disconnected]", reason);
        });

        this.socket.on("reconnect_attempt", (attempt) => {
            // console.log("[SOCKET reconnect_attempt]", attempt);
        });

        this.socket.on("connect_error", (err) => {
            // console.error("[SOCKET connect_error]", (err as any)?.message || err);
        });
    }

    /** Auto-resubscribe when reconnecting / refreshing */
    private resubscribeIfNeeded() {
        if (this.lastPayloads && this.socket) {
            // console.log("[SOCKET] Resubscribing with last payload");
            this.socket.emit("subscribeMarket", this.lastPayloads);
        }
    }

    /** External login hook (optional) */
    setLoggedIn(flag: boolean) {
        this.isLoggedIn = flag;
        if (flag) {
            this.connect();
        } else {
            this.disconnect();
        }
    }

    /** Connect manually if needed */
    connect(): void {
        if (typeof window !== "undefined") {
            this.isLoggedIn = !!localStorage.getItem("token");
        }

        if (!this.isLoggedIn) {
            // console.warn("[SOCKET] not logged in; skipping connect");
            return;
        }

        this.createSocket();
        if (this.socket && !this.socket.connected) {
            this.socket.connect();
        }
    }

    /** Subscribe (deduplicated & reconnect-safe) */
    subscribeMarket(
        payload: SubscribePayload,
        source: string = "unknown"
    ): void {
        if (!payload) return;

        const key = JSON.stringify(payload);
        if (key === this.lastSubscribeKey) {
            console.warn("⛔ Duplicate subscribe ignored from", source);
            return;
        }

        this.lastSubscribeKey = key;
        this.lastPayloads = payload;

        if (!this.socket) {
            this.connect();
            return;
        }

        if (this.socket.connected) {
            // console.log("[SOCKET emit] subscribeMarket from", source, payload);
            this.socket.emit("subscribeMarket", payload, (ack: any) => {
                if (ack?.status === "ok") {
                    // console.log("[subscribeMarket ack OK]");
                } else {
                    // console.log("[subscribeMarket ack]", ack);
                }
            });
        } else {
            // console.log("[SOCKET not connected yet — will auto resubscribe]");
            this.connect();
        }
    }

    /** Unsubscribe with same duplicate guard */
    unsubscribeMarket(payload: SubscribePayload): void {
        const key = JSON.stringify(payload);
        if (key !== this.lastSubscribeKey) {
            console.warn("⛔ Unsubscribe ignored (different payload)");
            return;
        }

        this.lastSubscribeKey = "";

        if (this.socket?.connected) {
            // console.log("[SOCKET emit] unsubscribeMarket", payload);
            this.socket.emit("unsubscribeMarket", payload);
        }
    }

    /** Simple event listener – returns cleanup fn */
    onEvent<T = any>(
        eventName: string,
        handler: (data: T) => void
    ): () => void {
        if (!this.socket) return () => {};

        const wrapped = (data: any) => handler(data as T);
        this.socket.on(eventName, wrapped);

        return () => {
            this.socket?.off(eventName, wrapped);
        };
    }

    /** Listen to every socket event (onAny) – returns cleanup fn */
    listenForMessages(handler: (event: string, data: any) => void): () => void {
        if (!this.socket) return () => {};

        const wrapped = (eventName: string, ...args: any[]) => {
            const data = args.length > 1 ? args : args[0];
            handler(eventName, data);
        };

        this.socket.onAny(wrapped);

        return () => {
            this.socket?.offAny(wrapped);
        };
    }

    sendMessage(eventName: string, data: any): void {
        // console.log("[SOCKET sendMessage]", eventName, data);
        this.socket?.emit(eventName, data);
    }

    /** Disconnect and cleanup fully */
    disconnect(): void {
        if (this.socket) {
            // console.log("[SOCKET] disconnecting...");
            this.socket.removeAllListeners();
            this.socket.disconnect();
            this.socket = null;
            this.coreListenersBound = false;
            this.lastPayloads = undefined;
            this.lastSubscribeKey = "";
        }
    }
}

export const webSocketService = WebSocketService.getInstance();
