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
                const logout = useAuthStore.getState().logout;
                logout();
            }

            // 🔥 Yahan hum Axios error ki jagah API ka custom error nikal rahe hain
            // Backend se mostly error 'error.response.data' mein aata hai
            const apiError = error.response?.data || error.message || "Something went wrong";

            // Ab try/catch block mein direct backend ka error milega
            return Promise.reject(apiError);
        }
    );
}

export default http;