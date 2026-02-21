"use client";

import { create } from "zustand";
import { CONFIG } from "./config";
import { CryptoService } from "./crypto-service";
import { safeParse } from "./functions";
import { subscribeWithSelector } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  error: string | null;
  userDetail: any | null;
  showModal: boolean;

  setError: (error: string | null) => void;
  setToken: (token: string | null) => void;
  setUserDetail: (user: any | null) => void;
  setShowModal: (show: boolean) => void;

  login: (username: string, password: string) => Promise<any>; // ✅ changed to return full object
  logout: () => void;

  checkLogin: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set) => ({
    isLoggedIn:
      typeof window !== "undefined" && !!localStorage.getItem("token"),
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    error: null,
    showModal: false,
    userDetail: typeof window !== "undefined" ? safeParse("userDetail") : null,

    setError: (error) => set({ error }),
    setToken: (token) => set({ token }),
    setUserDetail: (user) => set({ userDetail: user }),
    setShowModal: (show) => set({ showModal: show }),

    checkLogin: (token: string | null) => {
      set({
        token,
        isLoggedIn: !!token,
      });
    },

    // ✅ Updated login method
    login: async (username: string, password: string) => {
      set({ error: null });

      username = username.trim().toLowerCase();

      try {
        // -----------------------------------------
        // 1) CREATE LOGIN PAYLOAD
        // -----------------------------------------
        const req = {
          userName: username,
          password: password,
          ts: Date.now(),
        };

        // -----------------------------------------
        // 2) ENCRYPT → AES-GCM (Angular Compatible)
        // -----------------------------------------
        const encrypted = await CryptoService.encryptJSON1(req);

        const requestBody = {
          data: encrypted.iv + "###" + encrypted.payload,
        };

        // -----------------------------------------
        // 3) API CALL (POST)
        // -----------------------------------------
        const response = await fetch(CONFIG.playerLogin, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        // Backend returns: "iv###payload"
        const encryptedResponse = await response.text();

        // -----------------------------------------
        // 4) DECRYPT BACKEND RESPONSE
        // -----------------------------------------
        const result =
          await CryptoService.decryptApiResponse(encryptedResponse);
        console.log("🔵 Decrypted Login Response:", result);

        // -----------------------------------------
        // 5) SUCCESS ✔
        // -----------------------------------------
        if (result?.meta?.status_code === 200) {
          const token =
            result?.data?.token ||
            result?.data?.accessToken ||
            result?.token ||
            null;
          if (typeof window !== "undefined") {
            // localStorage.setItem("token", result.data.token);
            localStorage.setItem("token", result.data.accessToken);
            console.log(result);
            localStorage.setItem("intCasino", result.data.intCasino);
            localStorage.setItem(
              "userDetail",
              JSON.stringify(result.data.userDetail),
            );
            localStorage.setItem("newLogin", "true");
          }

          // Save main state
          set({
            isLoggedIn: true,
            token,
            userDetail: result.data.userDetail,
            error: null,
            showModal: false,
          });

          // Fetch initial data (Angular style)
          // mainService.getDataFromServices(CONFIG.getUserBetStake, 0);
          // mainService.getDataFromServices(CONFIG.casinoTableList, -1);

          return {
            success: true,
            meta: result.meta,
            data: result.data,
          };
        }

        // -----------------------------------------
        // 6) FAILURE ❌
        // -----------------------------------------
        const errMsg = result?.meta?.message || "Login failed";

        set({
          isLoggedIn: false,
          token: null,
          userDetail: null,
          error: errMsg,
        });

        return {
          success: false,
          meta: result.meta,
          data: null,
        };
      } catch (err: any) {
        // console.log("🔴 Login Error:", err);

        let errorMsg = "Something went wrong";

        try {
          const decryptedErr = await CryptoService.decryptApiResponse(
            err?.response?.data,
          );
          errorMsg =
            decryptedErr?.meta?.message ||
            decryptedErr?.message ||
            decryptedErr?.error ||
            errorMsg;
        } catch {
          // ignore decrypt error
        }

        set({
          isLoggedIn: false,
          token: null,
          userDetail: null,
          error: errorMsg,
        });

        return {
          success: false,
          meta: { message: errorMsg, status_code: 500 },
        };
      }
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userDetail");
        localStorage.removeItem("intCasino");
        localStorage.removeItem("one-click-storage");
      }

      set({
        isLoggedIn: false,
        token: null,
        error: null,
        userDetail: null,
      });
    },
  })),
);
