import { http } from "./axios-instance";
import { CryptoService } from "./crypto-service";
import { getData, saveData } from "./index-db";

/* ---------------------------------- */
/* UTIL: SPLIT MESSAGE */
/* ---------------------------------- */
export function splitMsg(text: any) {
  const parts =
    text
      ?.split(/',\s*'/)
      ?.map((p: string) => p.replace(/^'+|'+$/g, "").trim()) || [];

  return {
    status: parts[0] || "",
    title: parts[1] || "",
    desc: parts[2] || "",
  };
}

/* ---------------------------------- */
/* GENERIC FETCH DATA */
/* ---------------------------------- */
export async function fetchData({
  cachedKey,
  url,
  payload,
  setFn,
  showToast,
  headers = {},
  expireIn = 60 * 5,
  forceApiCall,
}: {
  cachedKey?: string | null;
  url: string;
  payload: any;
  setFn?: (value: any) => void;
  showToast?: (
    status: "error" | "info" | "success" | "warning",
    title: string,
    desc: string
  ) => void;
  headers?: Record<string, string>;
  expireIn?: number;
  forceApiCall?: boolean;
}) {
  /* ---------------- CACHE ---------------- */
  if (cachedKey) {
    const cached = await getData(cachedKey);

    if (!forceApiCall && cached) {
      const diff = (Date.now() - cached.timestamp) / 1000;
      if (diff < expireIn) {
        setFn?.(cached.data);
        return;
      }
    }
  }

  /* ---------------- TOKEN ---------------- */
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  /* ---------------- API CALL ---------------- */
  try {
    const response: any = await http.post(url, payload, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        ...headers,
      },
    });

    const apiData = response?.data?.data ?? response?.data;
    setFn?.(apiData);

    /* ------------ TOAST ------------ */
    if (showToast) {
      const message =
        response?.data?.meta?.message || response?.meta?.message;

      if (typeof message === "string") {
        const msg = splitMsg(message);
        showToast(msg.status, msg.title, msg.desc);
      } else {
        showToast("success", "Success", "Request successful");
      }
    }

    /* ------------ CACHE SAVE ------------ */
    if (cachedKey) {
      await saveData(cachedKey, apiData);
    }
  } catch (error: any) {
    console.error("API Error:", error);

    if (showToast) {
      showToast(
        "error",
        "Failed",
        error?.response?.data?.meta?.message || "Unauthorized / API Error"
      );
    }
  }
}

/* ---------------------------------- */
/* LOGIN REQUEST */
/* ---------------------------------- */
export async function loginRequest({
  url,
  username,
  password,
  setState,
}: {
  url: string;
  username: string;
  password: string;
  setState?: (value: any) => void;
}) {
  try {
    username = username.trim().toLowerCase();

    const encrypted = await CryptoService.encryptJSON1({
      userName: username,
      password,
      ts: Date.now(),
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: encrypted.iv + "###" + encrypted.payload,
      }),
    });

    const encryptedResponse = await response.text();
    const result: any = await CryptoService.decryptApiResponse(
      encryptedResponse
    );

    if (result?.meta?.status_code === 200) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", result.data.accessToken);
        localStorage.setItem("intCasino", result.data.intCasino);
        localStorage.setItem(
          "userDetail",
          JSON.stringify(result.data.userDetail)
        );
        localStorage.setItem("newLogin", "true");
      }

      setState?.({
        isLoggedIn: true,
        accessToken: result.data.accessToken,
        userDetail: result.data.userDetail,
        error: null,
        showModal: false,
      });

      return { success: true, data: result.data, meta: result.meta };
    }

    setState?.({
      isLoggedIn: false,
      accessToken: null,
      userDetail: null,
      error: result?.meta?.message,
    });

    return { success: false, meta: result.meta };
  } catch (err) {
    console.error("Login Error:", err);
    return { success: false };
  }
}
