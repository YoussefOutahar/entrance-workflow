// src/services/user.service.ts
import axiosInstance from "../config/axios.config";
import { API_ROUTES } from "../config/api.config";
import { User } from "@/types/auth";

interface UserResponse {
    status: string;
    data: {
        user: User;
    };
}

export const userService = {
    async getUserProfile(): Promise<UserResponse> {
        // This endpoint should include roles and groups
        const response = await axiosInstance.get<UserResponse>(
            API_ROUTES.USER.PROFILE
        );
        return response.data;
    },

    async updateUserProfile(
        id: number,
        userData: Partial<User>
    ): Promise<UserResponse> {
        const response = await axiosInstance.put<UserResponse>(
            API_ROUTES.USER.UPDATE_PROFILE(id),
            userData
        );
        return response.data;
    },

    async changePassword(
        id: number,
        passwordData: {
            current_password: string;
            password: string;
            password_confirmation: string;
        }
    ): Promise<any> {
        const response = await axiosInstance.put(
            API_ROUTES.USER.CHANGE_PASSWORD(id),
            passwordData
        );
        return response.data;
    },

    async toggleTwoFactorAuth(enable: boolean): Promise<any> {
        const endpoint = enable
            ? API_ROUTES.AUTH.TWO_FACTOR.ENABLE
            : API_ROUTES.AUTH.TWO_FACTOR.DISABLE;
        const response = await axiosInstance.post(endpoint);
        return response.data;
    },

    async confirmTwoFactorAuth(code: string): Promise<any> {
        const response = await axiosInstance.post(
            API_ROUTES.AUTH.TWO_FACTOR.CONFIRM,
            { code }
        );
        return response.data;
    },
};
