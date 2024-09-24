export const API_URL = Object.freeze({
    auth: {
        login: '/login',
        forgotPassword: '/forgot-password',
        resetPassword: '/reset-password',
        verifyOTP: '/verify-otp',
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
