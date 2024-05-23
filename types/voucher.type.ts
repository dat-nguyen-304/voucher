import { Model } from 'mongoose';
import { IDocument } from './common.type';
import { IEvent } from './event.type';

export interface IVoucher extends IDocument {
  eventId: IEvent['_id'];
  code: string;
}

export type voucherModel = Model<IVoucher>;
