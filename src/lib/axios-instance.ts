import axios from "axios";
import { BASE_URL_API} from "./config";

export const http = axios.create({
  baseURL: BASE_URL_API,
  headers: {
    "x-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// -----------------------
// 🔥 Request Interceptor
// -----------------------
http.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
