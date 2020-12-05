import { ApolloError, IResolvers } from 'apollo-server-express';
import { Booking, Database, Service } from '../../../lib/types';
import { NewBookingArgs, UpdateBookingInput } from './types';
import { Request, Response } from 'express';
import { authorize } from '../../../utils';
import { ObjectId } from 'mongodb';

const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
};

export const bookingResolver: IResolvers = {
    Query: {
        booking: async (
            _root: undefined,
            { serviceId }: NewBookingArgs,
            { db, req, res }: { db: Database; req: Request; res: Response }
        ): Promise<Booking> => {
            try {
                const user = await authorize(req, db);

                if (!user || !user._id) {
                    throw new ApolloError('not authorized', '401');
                }

                // maybe not secure enough
                let booking = await db.bookings.findOne({
                    _id: new ObjectId(req.signedCookies.booking),
                    userId: user._id,
                    services: { $in: [new ObjectId(serviceId)] },
                });

                if (!booking) {
                    const resInsert = await db.bookings.insertOne({
                        isMade: false,
                        userId: user._id,
                        services: [new ObjectId(serviceId)],
                    });
                    booking = resInsert.ops[0];
                }

                if (!booking) {
                    throw new ApolloError('internal error', '500');
                }

                res.cookie('booking', booking._id, {
                    ...cookieOptions,
                    maxAge: 1000 * 60 * 30,
                });

                return booking;
            } catch (error) {
                throw new ApolloError(error, '500');
            }
        },
    },
    Mutation: {
        updateBooking: async (
            _root: undefined,
            { input }: UpdateBookingInput,
            { db, req, res }: { db: Database; req: Request; res: Response }
        ): Promise<Booking> => {
            try {
                // console.log('input: ', input);

                const user = await authorize(req, db);

                if (!user || !user._id) {
                    throw new ApolloError('not authorized', '401');
                }

                const {
                    ok,
                    value,
                    lastErrorObject,
                } = await db.bookings.findOneAndUpdate(
                    {
                        _id: new ObjectId(req.signedCookies.booking),
                        userId: user._id,
                    },
                    {
                        $set: {
                            date: input.date,
                            services: input.services.map(
                                (elem) => new ObjectId(elem)
                            ),
                        },
                    },
                    { returnOriginal: false }
                );

                // console.log('value: ', value);

                if (!value || ok !== 1) {
                    throw new ApolloError(lastErrorObject, '500');
                }

                res.cookie('booking', req.signedCookies.booking, {
                    ...cookieOptions,
                    maxAge: 1000 * 60 * 30,
                });

                return value;
            } catch (error) {
                throw new ApolloError(error, '500');
            }
        },
    },
    Booking: {
        id: (booking: Booking): string | undefined => {
            return booking._id ? booking._id.toString() : undefined;
        },
        services: async (
            booking: Booking,
            _args: undefined,
            { db }: { db: Database; req: Request; res: Response }
        ): Promise<Service[]> => {
            try {
                const servicesRes = db.services.find({
                    _id: { $in: booking.services },
                });
                return servicesRes.toArray();
            } catch (error) {
                throw new ApolloError(error, '500');
            }
        },
    },
};
