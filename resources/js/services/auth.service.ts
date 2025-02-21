import axiosInstance from "../config/axios.config";
import { API_ROUTES } from "../config/api.config";
import { AuthResponse, UserData } from "../types/auth";

export const authService = {
    async signUp(userData: Partial<UserData>): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>(
            API_ROUTES.AUTH.REGISTER, 
            userData
        );
        return response.data;
    },

    async signIn(email: string, password: string, remember: boolean = false): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>(
            API_ROUTES.AUTH.LOGIN, 
            { email, password, remember }
        );
        return response.data;
    },

    async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>(
            API_ROUTES.AUTH.REFRESH_TOKEN, 
            {}, 
            {
                headers: { Authorization: `Bearer ${refreshToken}` }
            }
        );
        return response.data;
    },

    async logout(): Promise<void> {
        await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
    },

    async requestPasswordReset(email: string): Promise<void> {
        await axiosInstance.post(API_ROUTES.AUTH.FORGOT_PASSWORD, { email });
    },

    async resetPassword(token: string, email: string, password: string): Promise<void> {
        await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, {
            token,
            email,
            password,
            password_confirmation: password
        });
    },

    async resendVerificationEmail(): Promise<void> {
        await axiosInstance.post(API_ROUTES.AUTH.EMAIL_VERIFICATION);
    },

    async enable2FA(): Promise<{ secret: string; qr_code: string }> {
        const response = await axiosInstance.post(API_ROUTES.AUTH.TWO_FACTOR.ENABLE);
        return response.data;
    },

    async confirm2FA(code: string): Promise<void> {
        await axiosInstance.post(API_ROUTES.AUTH.TWO_FACTOR.CONFIRM, { code });
    },

    async disable2FA(): Promise<void> {
        await axiosInstance.post(API_ROUTES.AUTH.TWO_FACTOR.DISABLE);
    }
};