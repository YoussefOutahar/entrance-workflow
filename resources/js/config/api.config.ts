export const API_ROUTES = {
    AUTH: {
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH_TOKEN: '/auth/refresh-token',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        EMAIL_VERIFICATION: '/auth/email/verification-notification',
        VERIFY_EMAIL: '/auth/email/verify',
        TWO_FACTOR: {
            ENABLE: '/auth/2fa/enable',
            CONFIRM: '/auth/2fa/confirm',
            DISABLE: '/auth/2fa/disable'
        }
    },
    VISITOR_PASSES: {
        BASE: '/api/visitor-passes',
        FILES: '/api/files'
    }
};