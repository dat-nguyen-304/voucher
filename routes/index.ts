import { Application, Request, Response } from 'express';
import os from 'os';
const routes = (app: Application) => {
    app.get('/', (req: Request, res: Response) => {
        res.status(200).json({
            message: 'Server is running',
            uptime: os.uptime()
        });
    });
    // app.use('/account', accountRouter);
};

export default routes;
