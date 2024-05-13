import { RequestHandler } from 'express';
import { pick } from 'lodash';
import { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject, replace: boolean = true): RequestHandler => {
    return async (req, res, next): Promise<void> => {
        try {
            const data = await schema.parseAsync({
                body: pick(req.body, Object.keys(schema.shape?.body?.shape ?? {})),
                query: req.query,
                params: req.params,
                cookies: req.cookies
            });
            if (replace) {
                req.body = data.body;
                req.query = data.query;
                req.params = data.params;
                req.cookies = data.cookies;
            }
            return next();
        } catch (error) {
            next(error);
        }
    };
};
