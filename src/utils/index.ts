import { User, Database } from '../lib/types';
import { Request } from 'express';

export const authorize = async (
    req: Request,
    db: Database
): Promise<User | null> => {
    const token = req.get('X-CSRF-TOKEN');
    const user = db.users.findOne({
        _id: req.signedCookies.viewer,
        token,
    });
    console.log('token: ', token);
    console.log('user: ', user);

    return user;
};
