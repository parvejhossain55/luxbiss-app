import axios from "axios";
import { resetAllStores } from "@/store/resetAllStores";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";

// main axios instance used everywhere
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // This ensures cookies are sent/received
  headers: { "Content-Type": "application/json" },
});

// Generic API response handler
export const handleApiError = (error) => {
  const message = error.response?.data?.message || error.message || "An unexpected error occurred";
  const errors = error.response?.data?.errors || null;
  return { message, errors };
};

let isRefreshing = false;
let queue = [];

function processQueue(error) {
  queue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve();
  });
  queue = [];
}

// auto refresh on 401, then retry original request
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and not already retried
    const isAuthRequest = originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/google") ||
      originalRequest.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRequest) {
      originalRequest._retry = true;

      // If refresh already in progress, queue subsequent requests
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        // Since backend uses HTTP-only cookies, we can call /auth/refresh without payload
        // The browser will automatically send the 'refresh_token' cookie because it's scoped 
        // to this path in the backend.
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        processQueue(null);
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr);

        // Clear user data from local storage (not tokens, they are HttpOnly cookies)
        if (typeof window !== "undefined") {
          resetAllStores();
          // Dispatch a custom event so the UI can respond to forced logout if needed
          window.dispatchEvent(new Event("auth:logout"));
        }

        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
