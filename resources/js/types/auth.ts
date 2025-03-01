export interface User {
    id: number;
    username: string;
    email: string;
    display_name: string;
    is_active: boolean;

    // Security information
    email_verified_at?: string;
    two_factor_enabled?: boolean;
    password_last_set?: string;
    account_expires_at?: string;

    // Relationships
    roles?: Role[];
    groups?: Group[];

    created_at: string;
    updated_at: string;
}

export interface Role {
    id: number;
    name: string;
    slug: string;
    created_at?: string;
    updated_at?: string;
}

export interface Group {
    id: number;
    name: string;
    slug: string;
    description?: string;
    permissions?: Permission[];
    created_at?: string;
    updated_at?: string;
}

export interface Permission {
    id: number;
    name: string;
    slug: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

export interface AuthResponse {
    status: string;
    message: string;
    data: {
        user: User;
        token: string;
        refreshToken: string;
    };
}

export interface AuthError {
    message: string;
    errors?: Record<string, string[]>;
}
