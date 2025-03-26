type AuthData = {
    _id: string;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    sclassName: string;
    lang?: 'vi' | 'en';
};

type AuthState = {
    authData: AuthData | null;
    OTP: OTP | null;
};

type OTP = {
    email: string;
    expiredIn: number;
    done: boolean;
    resetToken: string;
};

type FormLogin = {
    username: string;
    password: string;
    expoPushToken?: string;
};

type FormResetPassword = {
    newPassword: string;
    resetToken: string;
};

type FormChangePassword = {
    email: string;
    oldPassword: string;
    newPassword: string;
};

// post

interface Event {
    id: string;
    title: string;
    time: string;
    image: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}
