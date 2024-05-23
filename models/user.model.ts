import mongoose from 'mongoose';
import { IUser, userModel } from '../types/user.type';

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const User = mongoose.model<IUser, userModel>('User', userSchema);
