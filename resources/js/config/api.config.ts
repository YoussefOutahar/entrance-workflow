// src/config/api.config.ts
export const API_ROUTES = {
    AUTH: {
        REGISTER: "/auth/register",
        LOGIN: "/auth/login",
        LOGOUT: "/auth/logout",
        REFRESH_TOKEN: "/auth/refresh-token",
        FORGOT_PASSWORD: "/auth/forgot-password",
        RESET_PASSWORD: "/auth/reset-password",
        EMAIL_VERIFICATION: "/auth/email/verification-notification",
        VERIFY_EMAIL: "/auth/email/verify",
        TWO_FACTOR: {
            ENABLE: "/auth/2fa/enable",
            CONFIRM: "/auth/2fa/confirm",
            DISABLE: "/auth/2fa/disable",
        },
    },
    VISITOR_PASSES: {
        BASE: "/api/visitor-passes",
        FILES: "/api/files",
        STATUS: (id: number) => `/api/visitor-passes/${id}/status`,
        AVAILABLE_ACTIONS: (id: number) =>
            `/api/visitor-passes/${id}/available-actions`,
        WORKFLOW_HISTORY: (id: number) =>
            `/api/visitor-passes/${id}/workflow-history`,
        TIMELINE: (id: number) => `/api/visitor-passes/${id}/timeline`,
        COMMENTS: (id: number) => `/api/visitor-passes/${id}/comments`,
        ADD_FILES: (id: number) => `/api/visitor-passes/${id}/files`,
        DELETE_FILE: (fileId: number) => `/api/files/${fileId}`,
    },
    ACTIVITIES: {
        BASE: "/api/activities",
        FILTERS: {
            BY_TYPE: (type: string) => `/api/activities?type=${type}`,
            BY_SUBJECT: (type: string, id: number) =>
                `/api/activities?subject_type=${type}&subject_id=${id}`,
        },
    },
    USER: {
        PROFILE: "/auth/user",
        USER_PROFILE: "/users/profile",
        UPDATE_PROFILE: (id: number) => `/users/${id}/profile`,
        CHANGE_PASSWORD: (id: number) => `/users/${id}/password`,
        GROUPS: "/groups",
        ROLES: "/roles",
        PERMISSIONS: "/permissions",
    },
};
