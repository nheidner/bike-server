import { Collection, ObjectId } from 'mongodb';

export interface User {
    _id?: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token?: string;
}

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
}
