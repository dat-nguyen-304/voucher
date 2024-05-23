import mongoose, { Schema } from 'mongoose';
import { IEvent, eventModel } from '../types/event.type';

const eventSchema = new mongoose.Schema<IEvent>(
  {
    name: {
      type: String,
      required: true
    },
    maxQuantity: {
      type: Number,
      required: true,
      default: 0
    },
    editableBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    editableUntil: { type: Date, default: null }
  },
  {
    timestamps: true
  }
);

export const Event = mongoose.model<IEvent, eventModel>('Event', eventSchema);
