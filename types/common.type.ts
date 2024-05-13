import { Types } from 'mongoose';
import { IGenericErrorMessage } from './error.type';

export interface IDocument {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface ITokenPayload {
    id: string;
    username: string;
    name: string;
}
