import { Application, Request, Response } from 'express';
import os from 'os';
import { authRouter } from './auth.route';

const routes = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            message: 'Server is running',
            uptime: os.uptime()
        });
    });
    app.use('/api/auth', authRouter);
};

export default routes;
