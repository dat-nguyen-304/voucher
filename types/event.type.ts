import { Model } from 'mongoose';
import { IDocument } from './common.type';

export interface IEvent extends IDocument {
    name: string;
    maxQuantity: number;
}

export type eventModel = Model<IEvent>;

export interface ICreateEventPayload {
    name: string;
    maxQuantity: number;
}
