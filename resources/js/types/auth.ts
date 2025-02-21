export interface UserData {
    username: string;
    email: string;
    password: string;
    display_name: string;
    given_name: string;
    surname: string;
    initials?: string;
    employee_id?: string;
    company?: string;
    department?: string;
    title?: string;
    manager_id?: number;
    office_phone?: string;
    mobile_phone?: string;
    office_location?: string;
    street_address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    two_factor_enabled?: boolean;
    email_verified_at?: string;
}

export interface AuthResponse {
    status: string;
    message: string;
    data: {
        user: UserData;
        token: string;
        refreshToken: string;
    };
}

export interface AuthError {
    message: string;
    errors?: Record<string, string[]>;
}