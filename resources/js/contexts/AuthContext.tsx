import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserData } from '../types/auth';
import { authStorage } from '../services/LocalStorage/AuthStorage';

interface AuthContextType {
    user: UserData | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuthState: (user: UserData, token: string, refreshToken: string) => void;
    clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserData | null>(authStorage.getUser());
    const [token, setToken] = useState<string | null>(authStorage.getToken());
    const [refreshToken, setRefreshToken] = useState<string | null>(authStorage.getRefreshToken());
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token && !!user);

    const setAuthState = (user: UserData, token: string, refreshToken: string) => {
        setUser(user);
        setToken(token);
        setRefreshToken(refreshToken);
        setIsAuthenticated(true);
        authStorage.setUser(user);
        authStorage.setToken(token);
        authStorage.setRefreshToken(refreshToken);
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        authStorage.clearAuth();
    };

    useEffect(() => {
        setIsAuthenticated(!!token && !!user);
    }, [token, user]);

    return (
        <AuthContext.Provider value={{
            user,
            token,
            refreshToken,
            isAuthenticated,
            setAuthState,
            clearAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};