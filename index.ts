import express from 'express';
import compression from 'compression';
import helmet from 'helmet';

const app = express();
const PORT = 3000;

app.use(helmet()); //hide important info such as api tech
app.use(compression()); //reduce size of data
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});