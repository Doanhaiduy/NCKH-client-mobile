export const API_URL = Object.freeze({
    auth: {
        login: '/login',
        sendOTP: '/send-reset-password-email',
        resetPassword: '/reset-password',
        changePassword: '/change-password',
        register: '/register',
        refreshToken: '/refresh-token',
    },
    post: {
        getPosts: '/get-all',
    },
    event: {
        getEvents: '/get-all',
    },
});
