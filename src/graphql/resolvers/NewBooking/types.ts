import { Address } from '../../../lib/types';

export interface NewBookingInput {
    input: { serviceId: string };
}

export interface UpdateAddressInput {
    input: Address & { newBookingId?: string };
}

export interface UpdateDateInput {
    input: { newBookingId?: string; from: Date; to: Date };
}
