import { RequestHandler } from 'express';
import { sendSuccessResponse } from '../utils/common';
import { EventService } from '../services/event.service';
import { IUser } from '../types/user.type';

const createEvent: RequestHandler = async (req, res, next) => {
  try {
    const data = await EventService.createEvent(req.body);
    sendSuccessResponse(res, data, 201);
  } catch (error) {
    next(error);
  }
};

const handleRequestVoucher: RequestHandler = async (req, res, next) => {
  try {
    const data = await EventService.handleRequestVoucher(req.params.eventId);
    sendSuccessResponse(res, data, 201);
  } catch (error) {
    next(error);
  }
};

const handleEditRequest: RequestHandler = async (req, res, next) => {
  try {
    // @ts-expect-error only intended to use in specific need
    const data = await EventService.handleEditRequest(req.user as IUser, req.params.eventId);
    sendSuccessResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const handleReleaseEditRequest: RequestHandler = async (req, res, next) => {
  try {
    // @ts-expect-error only intended to use in specific need
    const data = await EventService.handleReleaseEditRequest(req.user as IUser, req.params.eventId);
    sendSuccessResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
};

const handleFindUserIsEditing: RequestHandler = async (req, res, next) => {
  try {
    const data = await EventService.handleFindUserIsEditing(req.params.eventId);
    sendSuccessResponse(res, data, 200);
  } catch (error) {}
};

const handleEditSomething: RequestHandler = async (req, res, next) => {
  try {
    // @ts-expect-error only intended to use in specific need
    const data = await EventService.handleEditSomething(req.user as IUser, req.params.eventId);
    sendSuccessResponse(res, data, 200);
  } catch (error) {
    next(error);
  }
};

export const EventController = {
  createEvent,
  handleRequestVoucher,
  handleEditRequest,
  handleReleaseEditRequest,
  handleFindUserIsEditing,
  handleEditSomething
};
