import request from 'supertest';
import express from 'express';
import { setup, teardown } from './setupTests';
const JWT = require('jsonwebtoken');
import routes from '../routes';
import globalErrorHandler from '../middleware/globalErrorHandler';
import { Event, User } from '../models';
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

describe('Events API', () => {
  beforeAll(async () => {
    // Add test data to the database
    await Event.create([
      { name: 'Event 1', maxQuantity: 50 },
      { name: 'Event 2', maxQuantity: 100 }
    ]);
    await User.create([{ username: 'user_1', password: '1', name: 'User 1' }]);
    await User.create([{ username: 'user_2', password: '1', name: 'User 2' }]);
  });

  afterAll(async () => {
    await Event.deleteMany({});
    await User.deleteMany({});
  });

  it('should create and return created event', async () => {
    const newEvent = {
      name: 'Test Event',
      maxQuantity: 100
    };

    const response = await request(app).post('/api/event').send(newEvent).expect(201);

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toEqual(
      expect.objectContaining({
        name: 'Test Event',
        maxQuantity: 100
      })
    );
  });

  describe('Mark you are editing an event', () => {
    let eventId: string, token1: string, token2: string;

    beforeAll(async () => {
      const user1 = await User.findOne({ username: 'user_1' });
      const user2 = await User.findOne({ username: 'user_2' });
      const event = await Event.findOne({ name: 'Event 1' });
      if (user1 === null || user2 === null || event === null) {
        return 'Something is wrong';
      }
      eventId = event.id;
      token1 = await JWT.sign(
        { id: user1.id, username: user1.username, name: user1.name },
        process.env.PRIVATE_KEY as string,
        {
          expiresIn: '2 days'
        }
      );
      token2 = await JWT.sign(
        { id: user2.id, username: user2.username, name: user2.name },
        process.env.PRIVATE_KEY as string,
        {
          expiresIn: '2 days'
        }
      );
    });

    it('Register editing an event', async () => {
      await request(app).post(`/api/event/${eventId}/editable/me`).set('Authorization', `Bearer ${token1}`).expect(200);
    });

    it('Mark user1 are editing an event', async () => {
      console.log({ eventId });
      await request(app).post(`/api/event/${eventId}/edit`).set('Authorization', `Bearer ${token1}`).expect(200);
    });

    it('Can not mark user2 with event that user1 is marking', async () => {
      const response = await request(app)
        .post(`/api/event/${eventId}/editable/me`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(409);
      expect(response.body).toEqual(
        expect.objectContaining({
          message: 'Event is currently being edited by another user'
        })
      );
    });

    it('Release event', async () => {
      await request(app)
        .post(`/api/event/${eventId}/editable/release`)
        .set('Authorization', `Bearer ${token1}`)
        .expect(200);
    });

    it('Re-mark for user2', async () => {
      await request(app).post(`/api/event/${eventId}/editable/me`).set('Authorization', `Bearer ${token2}`).expect(200);
    });

    it('Show current user is editing event', async () => {
      const response = await request(app).post(`/api/event/${eventId}/editable/maintain`).expect(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(
        expect.objectContaining({
          message: `This event is editing by User 2`
        })
      );
    });
  });
});
