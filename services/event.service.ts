import { ClientSession, Types } from 'mongoose';
import { Event, Voucher } from '../models';
import { ICreateEventPayload, IEvent } from '../types/event.type';
import {
  BadRequestError,
  TransactionError,
  NotFoundError,
  EditEventError,
  ErrorResponse,
  UnauthorizedError
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
    return await runTransactionWithRetry(() => markEditUser(user.id, eventId, session), session);
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

const markEditUser = async (userId: string, eventId: string, session: ClientSession) => {
  const event = await Event.findById(eventId).session(session);
  if (!event) {
    throw new NotFoundError('Event not found');
  }

  const now = new Date();
  let message = '';

  if (!event.editableBy || !event.editableUntil || (event.editableUntil && event.editableUntil <= now)) {
    event.editableBy = new Types.ObjectId(userId);
    event.editableUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    await event.save({ session });
    message = 'Register your session successfully';
  } else if (event.editableBy.toString() !== userId) {
    throw new EditEventError('Event is currently being edited by another user');
  } else {
    throw new EditEventError('You are already editing this event');
  }

  try {
    await commitWithRetry(session);
    return {
      event,
      message
    };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    if (error instanceof ErrorResponse) throw error;
    else throw new TransactionError();
  }
};

const handleReleaseEditRequest = async (user: ITokenPayload, eventId: string) => {
  const session = await initializeSession();
  try {
    return await runTransactionWithRetry(() => releaseEditRequest(user.id, eventId, session), session);
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

const releaseEditRequest = async (userId: string, eventId: string, session: ClientSession) => {
  const event = await Event.findById(eventId).session(session);
  if (!event) {
    throw new NotFoundError('Event not found');
  }

  const now = new Date();

  if (!event.editableBy || !event.editableUntil) throw new BadRequestError('This event is not edited by anyone now');

  if (event.editableBy.toString() === userId) {
    if (event.editableUntil <= now) {
      event.editableBy = null;
      event.editableUntil = null;
      await event.save({ session });
      throw new BadRequestError('This event already release by default');
    }
    event.editableBy = null;
    event.editableUntil = null;
    await event.save({ session });
    await event.save({ session });
  } else throw new UnauthorizedError('You do not have right to release this session');

  try {
    await commitWithRetry(session);
    return {
      message: 'Release successfully!'
    };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    if (error instanceof ErrorResponse) throw error;
    else throw new TransactionError();
  }
};

const handleFindUserIsEditing = async (eventId: string) => {
  const session = await initializeSession();
  try {
    return await runTransactionWithRetry(() => findUserIsEditing(eventId, session), session);
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

const findUserIsEditing = async (eventId: string, session: ClientSession) => {
  const event = await Event.findById(eventId).populate<{ editableBy: Pick<IUser, 'name'> }>('editableBy', 'name');
  if (!event) {
    throw new NotFoundError('Event not found');
  }
  const now = new Date();
  let message = '';
  if (!event.editableBy || !event.editableUntil || event.editableUntil <= now)
    message = 'This event is not edited by anyone now';
  else message = `This event is editing by ${event.editableBy.name}`;

  try {
    await commitWithRetry(session);
    return { message, expiredTime: event.editableUntil };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    if (error instanceof ErrorResponse) throw error;
    else throw new TransactionError();
  }
};

const handleEditSomething = async (user: ITokenPayload, eventId: string) => {
  const session = await initializeSession();
  try {
    return await runTransactionWithRetry(() => editSomething(user.id, eventId, session), session);
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

const editSomething = async (userId: string, eventId: string, session: ClientSession) => {
  const event = await Event.findById(eventId).session(session);
  if (!event) {
    throw new NotFoundError('Event not found');
  }

  const now = new Date();
  let message = '';

  if (!event.editableBy || !event.editableUntil || event.editableUntil <= now) {
    throw new UnauthorizedError('You have not registered this event yet');
  } else if (event.editableBy.toString() !== userId) {
    throw new EditEventError('You do not have right to edit this event');
  } else {
    event.editableUntil = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes
    await event.save({ session });
    message = 'Edit successfully';
  }

  try {
    await commitWithRetry(session);
    return {
      event,
      message
    };
  } catch (error) {
    await session.abortTransaction();
    console.log(error);
    if (error instanceof ErrorResponse) throw error;
    else throw new TransactionError();
  }
};

export const EventService = {
  handleRequestVoucher,
  createEvent,
  handleEditRequest,
  handleReleaseEditRequest,
  handleFindUserIsEditing,
  handleEditSomething
};
