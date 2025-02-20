import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    signUp as signUpService,
    signIn as signInService,
} from "../services/auth.service";
import { UserData, AuthError } from "../types/auth";
import { authStorage } from "../services/LocalStorage/AuthStorage";

const useAuth = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<AuthError | null>(null);

    const handleAuthError = (error: unknown) => {
        let errorMessage = "An unexpected error occurred";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        setError({ message: errorMessage });
        setLoading(false);
    };

    const signUp = async (
        userData: Partial<UserData> & { password: string }
    ): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await signUpService(userData);
            authStorage.setToken(response.token);
            authStorage.setRefreshToken(response.refreshToken);
            authStorage.setUser(response.user);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await signInService(email, password);
            authStorage.setToken(response.token);
            authStorage.setRefreshToken(response.refreshToken);
            authStorage.setUser(response.user);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await authStorage.clearAuth();
            navigate("/auth/signin", { replace: true });
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const isAuthenticated = (): boolean => {
        const token = authStorage.getToken();
        const user = authStorage.getUser();
        return !!token && !!user;
    };

    return {
        user: authStorage.getUser(),
        token: authStorage.getToken(),
        loading,
        error,
        isAuthenticated: isAuthenticated(),
        signUp,
        signIn,
        signOut,
    };
};

export default useAuth;
