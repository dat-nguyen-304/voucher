import { RequestHandler } from 'express';
import { sendSuccessResponse } from '../utils/common';
import { EventService } from '../services/event.service';

const createEvent: RequestHandler = async (req, res, next) => {
    try {
        const data = await EventService.createEvent(req.body);
        sendSuccessResponse(res, data, 201);
    } catch (error) {
        next(error);
    }
};

const requestVoucher: RequestHandler = async (req, res, next) => {
    try {
        const data = await EventService.requestVoucher(req.params.eventId);
        sendSuccessResponse(res, data, 201);
    } catch (error) {
        next(error);
    }
};

export const EventController = {
    createEvent,
    requestVoucher
};
