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
eventRouter.post('/:eventId/editable/release', authenticate, EventController.handleReleaseEditRequest);
eventRouter.post('/:eventId/editable/maintain', EventController.handleFindUserIsEditing);
eventRouter.post('/:eventId/edit', authenticate, EventController.handleEditSomething);

eventRouter.post('/', validateRequest(EventValidation.createEvent), EventController.createEvent);
