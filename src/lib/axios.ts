import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, setAccessToken, removeAccessToken } from "./auth";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1", 
  withCredentials: true, // Sends HTTP-Only cookies (your refreshToken) to the backend
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Check if the response is a 401 (Unauthorized) and has not already been retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // If we are already refreshing the token, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Access token expired. Attempting silent token refresh...");
        
        // Request a new access token using your HTTP-only refresh cookie
        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Capture new access token from your custom ApiResponseBody wrapper
        const { accessToken } = response.data.data;
        
        setAccessToken(accessToken);
        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        console.log("Token refreshed successfully! Retrying original request...");
        return api(originalRequest); // Re-execute the original failed request
      } catch (refreshError) {
        // Refresh token is expired/invalid -> Force logout
        processQueue(refreshError, null);
        removeAccessToken();
        const pathname = window.location.pathname;
        if (pathname.startsWith("/employee") || pathname.startsWith("/teamlead")) {
          if (typeof window !== "undefined") {
            window.location.href = "/"; 
          }
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalizing dynamic error payloads sent by your custom ApiError backend model
    const normalizedError = new Error(
      (error.response?.data as any)?.message || "An unexpected network error occurred."
    );
    (normalizedError as any).statusCode = error.response?.status || 500;
    (normalizedError as any).errors = (error.response?.data as any)?.errors || [];

    return Promise.reject(normalizedError);
  }
);

export default api;