import { Collection, ObjectId } from 'mongodb';

export interface Address {
    fullName: string;
    firstLine: string;
    secondLine?: string;
    postalCode: string;
    city: string;
    utcZone?: number;
}

export interface User {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token?: string;
    hasWallet?: ObjectId | false;
    addresses?: Address[];
}

export interface TimeFrame {
    from: Date;
    to: Date;
}

export interface NewBooking {
    _id?: ObjectId;
    date?: TimeFrame;
    time?: string;
    services?: ObjectId[];
    address?: Address;
    userId?: ObjectId;
    isMade?: boolean;
}

// _id of type string and not ObjectId because _id can also be returned from third-party auth provider (Google, Facebook...)
export interface Viewer {
    _id?: string;
    token?: string;
    firstName?: string;
    lastName?: string;
    didRequest: boolean;
    email?: string;
}

export interface Service {
    _id: ObjectId;
    name: string;
    description: string;
    image: string;
    price: number;
}

export interface AvailableCity {
    _id: ObjectId;
    name: string;
    utcZone: number;
    postalCodes: number[];
    // availableSince?:
}

export type Calendar = number[][][][];

export interface Database {
    services: Collection<Service>;
    users: Collection<User>;
    newBookings: Collection<NewBooking>;
    availableCities: Collection<AvailableCity>;
    calendar: Collection<Calendar>;
}
