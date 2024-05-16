import { Model, Schema, Types } from 'mongoose';
import { IDocument } from './common.type';

export interface IEvent extends IDocument {
    name: string;
    maxQuantity: number;
    editableBy: Types.ObjectId | null;
    editableUntil: Date | null;
}

export type eventModel = Model<IEvent>;

export interface ICreateEventPayload {
    name: string;
    maxQuantity: number;
}
