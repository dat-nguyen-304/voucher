import { ILoginUserPayload } from '../types/auth.type';

const registerUser = async (args: ILoginUserPayload) => {
    return {};
};

const loginUser = async (args: ILoginUserPayload) => {
    return {};
};

export const AuthService = {
    registerUser,
    loginUser
};
