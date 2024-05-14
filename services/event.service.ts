import { ClientSession } from 'mongoose';
import { Event, Voucher } from '../models';
import { ICreateEventPayload } from '../types/event.type';
import { BadRequestError, NotFoundError } from '../errors/error.response';

const commitWithRetry = async (session: ClientSession) => {
    try {
        await session.commitTransaction();
        console.log('Transaction committed.');
    } catch (error) {
        if (error instanceof Error && error.message === 'UnknownTransactionCommitResult') {
            console.log('UnknownTransactionCommitResult, retrying commit operation ...');
            await commitWithRetry(session);
        } else {
            console.log('Error during commit ...');
            throw error;
        }
    }
};

const runTransactionWithRetry = async (txnFunc: () => Promise<any>, session: ClientSession) => {
    try {
        return await txnFunc();
    } catch (error) {
        console.log('Transaction aborted. Caught exception during transaction.');

        // If transient error, retry the whole transaction
        if (error instanceof Error && error.message === 'TransientTransactionError') {
            console.log('TransientTransactionError, retrying transaction ...');
            await runTransactionWithRetry(txnFunc, session);
        } else {
            throw error;
        }
    }
};

const requestVoucher = async (eventId: string) => {
    const session = await Event.startSession();
    session.startTransaction({
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        readPreference: 'primary'
    });

    try {
        return await runTransactionWithRetry(() => issueVoucher(eventId, session), session);
    } catch (error) {
        await session.abortTransaction();
        throw error;
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
