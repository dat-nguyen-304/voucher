import mongoose from 'mongoose';
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
        }
    },
    {
        timestamps: true
    }
);

export const Event = mongoose.model<IEvent, eventModel>('Event', eventSchema);
