import { ClientSession, Schema, Types } from 'mongoose';
import { Event, Voucher } from '../models';
import { ICreateEventPayload } from '../types/event.type';
import {
    BadRequestError,
    TransactionError,
    NotFoundError,
    EditEventError,
    ErrorResponse
} from '../errors/error.response';
import { commitWithRetry, initializeSession, runTransactionWithRetry } from '../utils/transaction';
import myQueue from '../myQueue';
import { IUser } from '../types/user.type';
import { ITokenPayload } from '../types/common.type';

const handleRequestVoucher = async (eventId: string) => {
    const session = await initializeSession();
    try {
        return await runTransactionWithRetry(() => issueVoucher(eventId, session), session);
    } catch (error) {
        await session.abortTransaction();
        // await myQueue.add('send-email', 'Transaction error');
        if (error instanceof ErrorResponse) throw error;
        else throw new TransactionError();
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
        // await myQueue.add('send-email', voucher[0]);
        return voucher;
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        // await myQueue.add('send-email', 'Transaction error');
        if (error instanceof ErrorResponse) throw error;
        else throw new TransactionError();
    }
};

const createEvent = async (payload: ICreateEventPayload) => {
    const event = await Event.create(payload);
    return event;
};

const handleEditRequest = async (user: ITokenPayload, eventId: string) => {
    const session = await initializeSession();
    try {
        return await runTransactionWithRetry(() => editRequest(user.id, eventId, session), session);
    } catch (error) {
        await session.abortTransaction();
        // await myQueue.add('send-email', 'Transaction error');
        console.log(error);
        if (error instanceof ErrorResponse) throw error;
        else throw new TransactionError();
    } finally {
        session.endSession();
    }
};

const editRequest = async (userId: string, eventId: string, session: ClientSession) => {
    const event = await Event.findById(eventId).session(session);
    if (!event) {
        throw new NotFoundError('Event not found');
    }

    const now = new Date();

    if (
        event.editableBy &&
        event.editableBy.toString() !== userId &&
        event.editableUntil &&
        event.editableUntil > now
    ) {
        throw new EditEventError('Event is currently being edited by another user');
    }

    event.editableBy = new Types.ObjectId(userId);
    event.editableUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    await event.save({ session });

    try {
        await commitWithRetry(session);
        return event;
    } catch (error) {
        await session.abortTransaction();
        console.log(error);
        if (error instanceof ErrorResponse) throw error;
        else throw new TransactionError();
    }
};

export const EventService = { handleRequestVoucher, createEvent, handleEditRequest };
