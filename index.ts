import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import globalErrorHandler from './middleware/globalErrorHandler';
import routes from './routes';
import './dbs/init.mongodb';

export const app = express();
const PORT = 3000;

app.use(helmet()); //hide important info such as api tech
app.use(compression()); //reduce size of data
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

routes(app);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
