import express from 'express';
import { validateRequest } from '../middleware';
import { EventController } from '../controllers/event.controller';
import { EventValidation } from '../middleware/validations/event.validation';
import { authenticate } from '../middleware/authenticate';

export const eventRouter = express.Router();

eventRouter.post(
    '/:eventId/request-voucher',
    validateRequest(EventValidation.requestVoucher),
    EventController.handleRequestVoucher
);

eventRouter.post('/:eventId/editable/me', authenticate, EventController.handleEditRequest);

eventRouter.post('/', validateRequest(EventValidation.createEvent), EventController.createEvent);
