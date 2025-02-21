import axios from "axios";
import { authStorage } from "../services/LocalStorage/AuthStorage";

const axiosInstance = axios.create({
    // baseURL: import.meta.env.VITE_API_URL || "/api",
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
    const token = authStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor for token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = authStorage.getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post("/auth/refresh-token", {}, {
                        headers: { Authorization: `Bearer ${refreshToken}` }
                    });
                    const { token, refreshToken: newRefreshToken } = response.data;
                    authStorage.setToken(token);
                    authStorage.setRefreshToken(newRefreshToken);
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                authStorage.clearAuth();
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;