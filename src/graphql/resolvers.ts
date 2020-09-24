import { Database, User, Viewer } from '../lib/types';
import { IResolvers } from 'apollo-server-express';
import { Request, Response, response } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ObjectID } from 'mongodb';

interface LogInInput {
    input: {
        email?: string;
        password?: string;
        service?: string;
        code?: string;
    };
}

interface RegisterUserInput {
    input: User;
}

const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
};

/**
 * updates user found by id from "viewer" cookie
 * @returns user
 */
const logInViaCookie = async (
    db: Database,
    token: string,
    req: Request,
    res: Response
): Promise<User | undefined> => {
    const resValue = await db.users.findOneAndUpdate(
        { _id: new ObjectID(req.signedCookies.viewer) },
        { $set: { token } },
        { returnOriginal: false }
    );

    const user = resValue.value;
    if (!user) {
        res.clearCookie('viewer', { ...cookieOptions });
        return user;
    }

    return user;
};

/**
 * looks for user in DB by "input.email" and if found compares "input.password" with password from user entry
 * @returns user
 */
const logInViaEmail = async (
    db: Database,
    input: LogInInput['input'],
    token: string,
    res: Response
): Promise<User | undefined> => {
    // look up email
    let user = await db.users.findOne({ email: input.email });
    if (!user) {
        throw new Error('email address not found');
    }
    const passwordCorrect = await bcrypt.compare(input.password, user.password);
    if (!passwordCorrect) {
        throw new Error('password not correct');
    }

    // update user with token
    const updateRes = await db.users.findOneAndUpdate(
        { _id: user._id },
        { $set: { token } },
        { returnOriginal: false }
    );
    if (!updateRes.value) {
        throw new Error('error while updating');
    }

    user = updateRes.value;

    // add cookie
    res.cookie('viewer', user._id, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return user;
};

export const resolvers: IResolvers = {
    Query: {},

    User: {
        id: (user: User): string | undefined => {
            return user._id?.toString();
        },
    },

    Viewer: {
        id: (viewer: Viewer): string | undefined => {
            return viewer._id;
        },
    },

    Mutation: {
        logInUser: async (
            _root: undefined,
            { input }: LogInInput,
            { db, req, res }: { db: Database; req: Request; res: Response }
        ): Promise<Viewer> => {
            try {
                const token = crypto.randomBytes(16).toString('hex');

                let user: User | undefined;
                if (input && input.service) {
                    switch (input.service) {
                        case 'EMAIL':
                            user = await logInViaEmail(db, input, token, res);
                            break;
                        // case 'FACEBOOK':
                        // case 'GOOGLE':
                        // case 'APPLE':
                        default:
                            user = undefined;
                            break;
                    }
                } else {
                    const viewerCookieValue = req.signedCookies.viewer;
                    if (!viewerCookieValue) {
                        user = undefined;
                    }

                    user = await logInViaCookie(db, token, req, res);
                }

                if (!user) {
                    return { didRequest: true };
                }

                return {
                    _id: user._id?.toString(),
                    token: user.token,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    didRequest: true,
                    email: user.email,
                };
            } catch (error) {
                throw new Error(`failed to query user: ${error}`);
            }
        },
        logOutUser: (
            _root: undefined,
            _args: undefined,
            { req, res }: { req: Request; res: Response }
        ): Viewer => {
            try {
                //const token = req.get('X-CSRF-TOKEN');
                res.clearCookie('viewer', { ...cookieOptions });
                return { didRequest: true };
            } catch (error) {
                throw new Error(`failed to query user: ${error}`);
            }
        },
        registerUser: async (
            _root: undefined,
            { input }: RegisterUserInput,
            { db }: { db: Database }
        ): Promise<User | null> => {
            try {
                const hashedPassword = await bcrypt.hash(input.password, 10);

                const findOneResult = await db.users.findOne({
                    email: input.email,
                });
                if (findOneResult !== null) {
                    throw new Error('email aldready exists');
                }

                const insertResult = await db.users.insertOne({
                    firstName: input.firstName,
                    lastName: input.lastName,
                    email: input.email,
                    password: hashedPassword,
                });
                return insertResult.ops[0];
            } catch (error) {
                throw new Error(`failed to query user: ${error}`);
            }
        },
    },
};
