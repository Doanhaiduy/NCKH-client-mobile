type AuthData = {
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    role: string;
    accessToken: string;
    refreshToken: string;
    sclassName: string;
};

type AuthState = {
    authData: AuthData | null;
    OTP: OTP | null;
};

type OTP = {
    email: string;
    otp: string;
    expiredIn: number;
    done: boolean;
};

type FormLogin = {
    username: string;
    password: string;
    expoPushToken?: string;
};

type FormResetPassword = {
    email: string;
    newPassword: string;
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
