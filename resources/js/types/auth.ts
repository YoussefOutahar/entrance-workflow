export interface UserData {
    username: string;
    email: string;
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
    is_active: boolean;
}

export interface AuthResponse {
    token: string;
    refreshToken: string;
    user: UserData;
}

export interface AuthError {
    message: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}
