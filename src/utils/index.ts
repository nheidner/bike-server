import { User, Database } from '../lib/types';
import { Request } from 'express';
import { ObjectID } from 'mongodb';

export const authorize = async (
    req: Request,
    db: Database
): Promise<User | null> => {
    const token = req.get('X-CSRF-TOKEN');
    const user = await db.users.findOne({
        _id: new ObjectID(req.signedCookies.viewer),
        token,
    });
    return user;
};
