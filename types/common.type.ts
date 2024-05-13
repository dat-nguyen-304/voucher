import { Types } from 'mongoose';
import { IGenericErrorMessage } from './error.type';

export interface IDocument {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
