import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { UserData, AuthError } from "../types/auth";
import { useAuth as useAuthContext } from "../contexts/AuthContext";

const useAuth = () => {
    const navigate = useNavigate();
    const { setAuthState, clearAuth } = useAuthContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AuthError | null>(null);

    const handleAuthError = (error: any) => {
        setError({
            message:
                error.response?.data?.message || "An unexpected error occurred",
            errors: error.response?.data?.errors,
        });
        setLoading(false);
    };

    const signUp = async (userData: Partial<UserData>): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.signUp(userData);
            setAuthState(
                response.data.user,
                response.data.token,
                response.data.refreshToken
            );
            navigate("/dashboard");
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (
        email: string,
        password: string,
        remember: boolean = false
    ): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await authService.signIn(
                email,
                password,
                remember
            );
            setAuthState(
                response.data.user,
                response.data.token,
                response.data.refreshToken
            );
            navigate("/dashboard");
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async (): Promise<void> => {
        setLoading(true);
        try {
            await authService.logout();
            clearAuth();
            navigate("/auth/login");
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        signUp,
        signIn,
        signOut,
    };
};

export default useAuth;
