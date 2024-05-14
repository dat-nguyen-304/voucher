import express from 'express';
import { validateRequest } from '../middleware';
import { EventController } from '../controllers/event.controller';
import { EventValidation } from '../middleware/validations/event.validation';

export const eventRouter = express.Router();

eventRouter.post(
    '/:eventId/request-voucher',
    validateRequest(EventValidation.requestVoucher),
    EventController.requestVoucher
);

eventRouter.post('/', validateRequest(EventValidation.createEvent), EventController.createEvent);