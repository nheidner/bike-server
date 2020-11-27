import { ObjectId } from 'mongodb';
import { connectDatabase } from '../db';
import dotenv from 'dotenv';
import { User } from '../lib/types';
dotenv.config();

const users: User[] = [
    {
        _id: new ObjectId(),
        firstName: 'Maurice',
        lastName: 'Moss',
        email: 'maurice@moss.com',
        password: 'abcdefg',
    },
    {
        _id: new ObjectId(),
        firstName: 'Roy',
        lastName: 'Trenneman',
        email: 'roy@trenneman.com',
        password: 'imroy',
    },
];

const seed = async () => {
    console.log('started');
    try {
        const db = await connectDatabase();
        for (const user of users) {
            db.users.insertOne(user);
        }
        console.log('success');
    } catch (error) {
        console.log('There is an error:', error);
    }
    process.exit(0);
};

seed();
