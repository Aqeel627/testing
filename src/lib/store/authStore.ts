import { create } from "zustand";
import { loginRequest, splitMsg } from "../functions";
import { CONFIG } from "../config";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  userDetail: any | null;
  error: string | null;
  showModal: boolean;

  checkLogin: (token: string | null) => void;
  loginUser: (
    username: string,
    password: string,
    showToast?: (status: string, title: string, desc: string) => void
  ) => Promise<any>;
  logoutUser: () => void;
  setError: (msg: string | null) => void;
}

// 🔹 Get token from localStorage on load
const getStoredToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getStoredToken(),
  isLoggedIn: !!getStoredToken(),
  userDetail:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userDetail") || "null")
      : null,
  error: null,
  showModal: false,

  // ---------------------------------------------
  // CHECK LOGIN (manual token set)
  // ---------------------------------------------
  checkLogin: (token: string | null) => {
    set({
      token,
      isLoggedIn: !!token,
    });
  },

  // ---------------------------------------------
  // LOGIN ACTION
  // ---------------------------------------------
  loginUser: async (
    username: string,
    password: string,
    showToast?: (status: string, title: string, desc: string) => void
  ) => {
    set({ error: null });

    const result: any = await loginRequest({
      url: CONFIG.playerLogin,
      username,
      password,
      setState: set,
    });

    // ✅ If login successful → update store
    if (result?.success && result?.data?.token) {
      const token = result.data.token;
      const user = result.data.user || null;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("userDetail", JSON.stringify(user));
      }

      // Update Zustand store
      set({
        token: token,
        isLoggedIn: true,
        userDetail: user,
        error: null,
      });
    }

    // ---- Toast
    if (showToast) {
      if (typeof result?.meta?.message === "string") {
        const msg = splitMsg(result.meta.message);
        showToast(msg.status, msg.title, msg.desc);
      } else {
        showToast(
          result?.success ? "success" : "error",
          result?.success ? "Successfully" : "Failed",
          result?.meta?.message || "Unknown error"
        );
      }
    }

    return result;
  },

  // ---------------------------------------------
  // LOGOUT ACTION
  // ---------------------------------------------
  logoutUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // ✅ space removed
      localStorage.removeItem("userDetail");
      localStorage.removeItem("intCasino");
      localStorage.removeItem("newLogin");
    }

    set({
      isLoggedIn: false,
      token: null,
      userDetail: null,
      error: null,
    });
  },

  // ---------------------------------------------
  // ERROR SETTER
  // ---------------------------------------------
  setError: (msg: string | null) => set({ error: msg }),
}));
