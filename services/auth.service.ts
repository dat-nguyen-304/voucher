import { pick } from 'lodash';
import { NotFoundError } from '../errors/error.response';
import { User } from '../models';
import { ILoginUserPayload } from '../types/auth.type';
import { IUser } from '../types/user.type';
import { createTokenPair, hashPassword } from '../utils/common';

const registerUser = async (payload: IUser) => {
    let user;
    user = await User.findOne({ username: payload.username });
    if (user) {
        throw new NotFoundError('Username is already taken');
    }

    const hashedPassword = await hashPassword(payload.password);
    user = await User.create({
        ...payload,
        password: hashedPassword
    });

    const tokens = await createTokenPair({
        id: user.id,
        username: payload.username,
        name: payload.name
    });

    console.log({ tokens });

    return {
        user: pick(user, ['username', 'name']),
        tokens
    };
};

const loginUser = async (args: ILoginUserPayload) => {
    return {};
};

export const AuthService = {
    registerUser,
    loginUser
};
