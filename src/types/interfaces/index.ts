interface Event {
    id: string;
    title: string;
    time: string;
    image: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface AuthData {
    id: string;
    username: string;
    email: string;
    accessToken: string;
}

interface AuthPayload {
    username: string;
    password: string;
}

interface AuthState {
    isLoading: boolean;
    errorMessage: string;
    authData: AuthData | null;
    userInfo: User | null;
    OTP: OTP | null;
}

interface OTP {
    email: string;
    otp: string;
    expiredIn: number;
    done: boolean;
}

interface User {
    id: string;
    username: string;
    fullName: string;
    email: string;
    avatar: string;
    role: string;
}
