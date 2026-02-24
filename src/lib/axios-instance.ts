import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { BASE_URL_API } from "./config";
import { useAuthStore } from "./useAuthStore";
import Router from "next/router";

export const http = axios.create({
  baseURL: BASE_URL_API ,
  headers: {
    "x-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// -----------------------
// 🔥 Request Interceptor
// -----------------------
// http.interceptors.request.use(
//   (config) => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");

//       if (token) {
//         config.headers["Authorization"] = `Bearer ${token}`;
//       }
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
            if (error.response?.status === 401) {
                // toast.error("Please log in again.", {
                //     position: "top-right",
                //     autoClose: 700,
                // });

                // Logout from Zustand store
                const logout = useAuthStore.getState().logout;
                logout();

                const isDesktop = window.innerWidth > 1024;
                Router.push(isDesktop ? "/" : "/authentication/login");
            }

            return Promise.reject(error);
        }
    );
}

export default http;
