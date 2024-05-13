import { pick } from 'lodash';
import { NotFoundError, UnauthorizedError } from '../errors/error.response';
import { User } from '../models';
import { ILoginUserPayload } from '../types/auth.type';
import { IUser } from '../types/user.type';
import { createTokenPair, hashPassword } from '../utils/common';
import bcrypt from 'bcrypt';

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

    return {
        user: pick(user, ['username', 'name']),
        tokens
    };
};

const loginUser = async (payload: ILoginUserPayload) => {
    let user;
    user = await User.findOne({ username: payload.username });
    if (!user) throw new NotFoundError('User does not exist');
    const isMatchedPassword = await bcrypt.compare(payload.password, user.password);
    if (!isMatchedPassword) throw new UnauthorizedError('Invalid Credentials');
    const tokens = await createTokenPair({
        id: user.id,
        username: user.username,
        name: user.name
    });
    return tokens;
};

export const AuthService = {
    registerUser,
    loginUser
};
