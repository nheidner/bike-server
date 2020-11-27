import { ObjectId } from 'mongodb';
import { connectDatabase } from '../db';
import dotenv from 'dotenv';
import { Service } from '../lib/types';
dotenv.config();

const services: Service[] = [
    {
        _id: new ObjectId(),
        name: 'Schlauch austauschen',
        description:
            'Hier bieten wir Ihnen an, den Schlauch eines Rades des Fahrrads austauschen',
        image: 'repair-bike.jpg',
        price: 20,
    },
    {
        _id: new ObjectId(),
        name: 'Neuer Rahmen',
        description: 'Neuer Rahmen Beschreibung',
        image: 'repair-bike.jpg',
        price: 30,
    },
    {
        _id: new ObjectId(),
        name: 'Felgen austauschen',
        description: 'Niegelnagelneue Felgen anbringen',
        image: 'repair-bike.jpg',
        price: 109,
    },
    {
        _id: new ObjectId(),
        name: 'Mantel austauschen',
        description: 'neuen Mantel von Marke Wumms ins Fahrrad einbauen',
        image: 'repair-bike.jpg',
        price: 199,
    },
];

const seed = async () => {
    console.log('started');
    try {
        const db = await connectDatabase();
        for (const service of services) {
            db.services.insertOne(service);
        }
        console.log('success');
    } catch (error) {
        console.log('There is an error:', error);
    }
};

seed();
