import { Types } from 'mongoose';

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
