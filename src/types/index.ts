type FormLogin = {
    username: string;
    password: string;
};

type FormChangePassword = {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
};

type CardItemData = {
    id: number;
    title: string;
    time: string;
    image: string;
    description?: string;
    type?: string;
};
