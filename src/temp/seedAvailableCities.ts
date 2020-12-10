import { connectDatabase } from '../db';
import { availableCities } from './data/availableCities';

const seed = async () => {
    console.log('started');
    try {
        const db = await connectDatabase();
        for (const city of availableCities) {
            db.availableCities.insertOne(city);
        }
        console.log('success');
    } catch (error) {
        console.log('err:', error);
    }
};

seed();
