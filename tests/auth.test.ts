import request from 'supertest';
import express from 'express';
import { setup, teardown } from './setupTests';
import routes from '../routes';
import globalErrorHandler from '../middleware/globalErrorHandler';
import { User } from '../models';
require('dotenv').config();
export const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

routes(app);
app.use(globalErrorHandler);

beforeAll(async () => {
  await setup();
});

afterAll(async () => {
  await teardown();
});

describe('Auth API', () => {
  afterAll(async () => {
    await User.deleteMany({});
  });

  const newUser = {
    username: 'newuser',
    password: '1',
    name: 'new user'
  };

  it('Register user', async () => {
    const response = await request(app).post('/api/auth/register').send(newUser).expect(201);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('tokens');
  });

  it('Login with wrong password', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ username: newUser.username, password: 'dumppassword' })
      .expect(401);
  });

  it('Login successfully', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: newUser.username, password: newUser.password })
      .expect(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('accessToken');
    expect(response.body.data).toHaveProperty('refreshToken');
  });
});
