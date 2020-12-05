import { ObjectId } from 'mongodb';

export interface NewBookingArgs {
    serviceId: string;
}

export interface UpdateBookingInput {
    input: {
        date?: string;
        time?: string;
        services: string[];
        isMade: boolean;
        wallet: string;
    };
}
