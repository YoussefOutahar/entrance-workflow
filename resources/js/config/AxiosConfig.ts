import axios from "axios";
import { authStorage } from "../services/LocalStorage/AuthStorage";

const axiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(async (config) => {
    await axios.get("/sanctum/csrf-cookie");

    const token = authStorage.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
