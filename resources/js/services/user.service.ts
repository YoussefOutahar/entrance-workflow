// src/services/user.service.ts
import axiosInstance from "../config/axios.config";
import { API_ROUTES } from "../config/api.config";

export const userService = {
    async getUserProfile() {
        return await axiosInstance.get(API_ROUTES.USER.PROFILE);
    },

    async updateUserProfile(userId: number, data: any) {
        return await axiosInstance.put(
            API_ROUTES.USER.UPDATE_PROFILE(userId),
            data
        );
    },

    async changePassword(userId: number, data: any) {
        return await axiosInstance.put(
            API_ROUTES.USER.CHANGE_PASSWORD(userId),
            data
        );
    },

    async toggleTwoFactorAuth(enable: boolean) {
        if (enable) {
            return await axiosInstance.post(API_ROUTES.AUTH.TWO_FACTOR.ENABLE);
        } else {
            return await axiosInstance.post(API_ROUTES.AUTH.TWO_FACTOR.DISABLE);
        }
    },

    async confirmTwoFactorAuth(code: string) {
        return await axiosInstance.post(API_ROUTES.AUTH.TWO_FACTOR.CONFIRM, {
            code,
        });
    },
};
