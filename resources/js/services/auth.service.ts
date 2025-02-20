import axiosInstance from "../config/AxiosConfig";
import { AuthResponse, UserData } from "../types/auth";

export const signUp = async (
    userData: Partial<UserData> & { password: string }
): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>(
            "/auth/register",
            userData
        );
        return response.data;
    } catch (error) {
        console.error("Registration error:", error);
        throw error;
    }
};

export const signIn = async (
    email: string,
    password: string
): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>("/auth/login", {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
};

export const refreshToken = async (
    refreshToken: string
): Promise<AuthResponse> => {
    try {
        const response = await axiosInstance.post<AuthResponse>(
            "/auth/refresh-token",
            {},
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error refreshing token:", error);
        throw error;
    }
};

export const logout = async (): Promise<void> => {
    try {
        await axiosInstance.post("/auth/logout");
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
};
