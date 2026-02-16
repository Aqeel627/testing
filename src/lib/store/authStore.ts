import { create } from "zustand";
import { loginRequest, splitMsg } from "../functions";
import { CONFIG } from "../config";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  userDetail: any | null;
  error: string | null;
  showModal: boolean;

  checkLogin: (accessToken: string | null) => void;
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
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: getStoredToken(),
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
  checkLogin: (accessToken: string | null) => {
    set({
      accessToken,
      isLoggedIn: !!accessToken,
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
    if (result?.success && result?.data?.accessToken) {
      const token = result.data.accessToken;
      const user = result.data.user || null;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("userDetail", JSON.stringify(user));
      }

      // Update Zustand store
      set({
        accessToken: token,
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
      localStorage.removeItem("accessToken"); // ✅ space removed
      localStorage.removeItem("userDetail");
      localStorage.removeItem("intCasino");
      localStorage.removeItem("newLogin");
    }

    set({
      isLoggedIn: false,
      accessToken: null,
      userDetail: null,
      error: null,
    });
  },

  // ---------------------------------------------
  // ERROR SETTER
  // ---------------------------------------------
  setError: (msg: string | null) => set({ error: msg }),
}));
