import mongoose from 'mongoose';
import { IVoucher, voucherModel } from '../types/voucher.type';

const voucherSchema = new mongoose.Schema<IVoucher>(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        },
        code: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

export const Voucher = mongoose.model<IVoucher, voucherModel>('Voucher', voucherSchema);
