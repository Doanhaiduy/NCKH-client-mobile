export const API_URL = Object.freeze({
    auth: {
        login: '/login',
        sendOTP: '/send-reset-password-email',
        resetPassword: '/reset-password',
        changePassword: '/change-password',
        register: '/register',
    },
    post: {
        getPosts: '/get-all',
        createPost: '/posts',
        updatePost: '/posts',
        deletePost: '/posts',
    },
    user: {
        getUser: '/users',
        updateUser: '/users',
        deleteUser: '/users',
    },
    comment: {
        getComments: '/comments',
        createComment: '/comments',
        updateComment: '/comments',
        deleteComment: '/comments',
    },
});
