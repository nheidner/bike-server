import { Collection, ObjectId } from 'mongodb';

export interface Address {
    firstName: string;
    lastName: string;
    street: string;
    streetNumber: string;
    zip: number;
    city: string;
    country: string;
    // description: string;
}

export interface User {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token?: string;
    hasWallet?: ObjectId | false;
}

export interface Booking {
    _id?: ObjectId;
    date?: string;
    time?: string;
    services?: ObjectId[];
    // address: Address
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

export interface Database {
    services: Collection<Service>;
    users: Collection<User>;
    bookings: Collection<Booking>;
}
