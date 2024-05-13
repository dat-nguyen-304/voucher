import { Model } from 'mongoose';
import { IDocument } from './common.type';

export interface IUser extends IDocument {
    username: string;
    password: string;
    name: string;
}

export type userModel = Model<IUser>;
