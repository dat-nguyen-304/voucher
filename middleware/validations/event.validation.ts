import { z } from 'zod';

export const username_regex = /^[a-zA-Z0-9]+$/;

const createEvent = z.object({
  body: z
    .object({
      name: z.string({ required_error: 'Name is required' }),
      maxQuantity: z.number({
        required_error: 'Max voucher quantity is required',
        invalid_type_error: 'Max voucher quantity is a number'
      })
    })
    .strict()
});

const requestVoucher = z.object({
  params: z
    .object({
      eventId: z.string({ required_error: 'Event id is required' })
    })
    .strict()
});

export const EventValidation = {
  createEvent,
  requestVoucher
};
