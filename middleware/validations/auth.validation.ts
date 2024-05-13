import { z } from 'zod';

export const username_regex = /^[a-zA-Z0-9]+$/;

const registerUser = z.object({
    body: z
        .object({
            username: z
                .string({ required_error: 'Username is required' })
                .regex(username_regex, { message: 'Invalid username' }),
            password: z.string({ required_error: 'Password is required' }),
            name: z.string({ required_error: 'Name is required' })
        })
        .strict()
});

const loginUser = z.object({
    body: z
        .object({
            username: z
                .string({ required_error: 'Username is required' })
                .regex(username_regex, { message: 'Invalid username' }),
            password: z.string({ required_error: 'Password is required' })
        })
        .strict()
});

export const AuthValidation = {
    loginUser,
    registerUser
};
