import mongoose, { ClientSession } from 'mongoose';
import { Event, Voucher } from '../models';
import { ICreateEventPayload } from '../types/event.type';
import { BadRequestError, TransactionError, NotFoundError } from '../errors/error.response';
import { commitWithRetry, initializeSession, runTransactionWithRetry } from '../utils/transaction';

const requestVoucher = async (eventId: string) => {
    const session = await initializeSession();
    try {
        return await runTransactionWithRetry(() => issueVoucher(eventId, session), session);
    } catch (error) {
        await session.abortTransaction();
        throw new TransactionError();
    } finally {
        session.endSession();
    }
};

const issueVoucher = async (eventId: string, session: ClientSession) => {
    const event = await Event.findById(eventId).session(session);
    if (!event) {
        throw new NotFoundError('Event not found');
    }

    const existingVouchers = await Voucher.countDocuments({ eventId }).session(session);
    if (existingVouchers >= event.maxQuantity) {
        throw new BadRequestError('Max quantity reached');
    }

    const voucher = await Voucher.create([{ eventId, code: Math.random().toString(36).substring(2, 8) }], { session });

    try {
        await commitWithRetry(session);
        return voucher;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
};

const createEvent = async (payload: ICreateEventPayload) => {
    const event = await Event.create(payload);
    return event;
};

export const EventService = { requestVoucher, createEvent };
