import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { BASE_URL } from "./config";
import { useAuthStore } from "./useAuthStore";
import Router from "next/router";

export const http = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

if (typeof window !== "undefined") {
    // Request Interceptor
    http.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem("token");
            if (token) {
                if (!config.headers) {
                    config.headers = new AxiosHeaders();
                }
                (config.headers as AxiosHeaders).set(
                    "Authorization",
                    `Bearer ${token}`
                );
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    // Response Interceptor
    http.interceptors.response.use(
        (response) => response,
        (error: AxiosError) => {
            // 401 Unauthorized Handling
            if (error.response?.status === 401) {
                // 1. Clear Zustand state
                const logout = useAuthStore.getState().logout;
                logout();

                // 2. 🔥 Fire a custom event instead of reloading the window
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("auth-unauthorized"));
                }
            }
            const apiError = error.response?.data || error.message || "Something went wrong";
            return Promise.reject(apiError);
        }
    );
}

export default http;