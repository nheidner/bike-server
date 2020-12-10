import { MongoClient } from 'mongodb';
import { Database } from '../lib/types';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}.mongodb.net/main?retryWrites=true&w=majority`;

export const connectDatabase = async (): Promise<Database> => {
    const client = await MongoClient.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    const db = client.db('main');
    return {
        services: db.collection('services'),
        users: db.collection('users'),
        newBookings: db.collection('newBookings'),
        availableCities: db.collection('availableCities'),
        calendar: db.collection('calendar'),
    };
};
