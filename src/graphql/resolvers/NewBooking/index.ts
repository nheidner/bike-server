import { ApolloError, IResolvers } from 'apollo-server-express';
import { NewBooking, Database, Service, Address } from '../../../lib/types';
import { NewBookingInput, UpdateAddressInput, UpdateDateInput } from './types';
import { Request, Response } from 'express';
import { authorize } from '../../../utils';
import { ObjectId } from 'mongodb';
import yup from 'yup';

const cookieOptions = {
    httpOnly: true,
    sameSite: true,
    signed: true,
    secure: process.env.NODE_ENV === 'development' ? false : true,
};

export const newBookingResolver: IResolvers = {
    Query: {
        /**
         * authorizes
         *
         * looks for booking with _id (from booking cookie), userId (from authorize), services ids (from services)
         *
         * if booking not exists creates new booking
         *
         * creates or renews booking cookie
         */
        newBooking: async (
            _root: undefined,
            { input }: NewBookingInput,
            { db, req, res }: { db: Database; req: Request; res: Response }
        ): Promise<NewBooking> => {
            try {
                const user = await authorize(req, db);

                if (!user || !user._id) {
                    throw new ApolloError('not authorized', '401');
                }

                // maybe not secure enough
                let newBooking = await db.newBookings.findOne({
                    _id: new ObjectId(req.signedCookies.newBooking),
                    userId: user._id,
                    services: { $in: [new ObjectId(input.serviceId)] },
                });

                if (!newBooking) {
                    const resInsert = await db.newBookings.insertOne({
                        isMade: false,
                        userId: user._id,
                        services: [new ObjectId(input.serviceId)],
                    });
                    newBooking = resInsert.ops[0];
                }

                if (!newBooking) {
                    throw new ApolloError('internal error', '500');
                }

                res.cookie('newBooking', newBooking._id, {
                    ...cookieOptions,
                    maxAge: 1000 * 60 * 30,
                });

                return newBooking;
            } catch (error) {
                throw new ApolloError(error, '500');
            }
        },
    },
    Mutation: {
        updateNewBookingAddress: async (
            _root: undefined,
            { input }: UpdateAddressInput,
            { db, req }: { db: Database; req: Request }
        ): Promise<NewBooking | null> => {
            try {
                const user = await authorize(req, db);

                if (!user || !user._id) {
                    throw new ApolloError('not authorized', '401');
                }

                /* yup schema validation */

                const address: Address = {
                    fullName: input.fullName,
                    firstLine: input.firstLine,
                    secondLine: input.secondLine ? input.secondLine : '',
                    postalCode: input.postalCode,
                    city: input.city,
                    utcZone: undefined,
                };

                // check if postal code exists in DB
                const res = (await db.availableCities
                    .find(
                        {
                            postalCodes: { $in: [parseInt(input.postalCode)] },
                        },
                        { projection: { _id: 0, name: 1, utcZone: 1 } }
                    )
                    .toArray()) as { name: string; utcZone: number }[];
                if (!res || res.length < 1) {
                    throw new ApolloError(
                        'we are yet not available at this place',
                        '500'
                    );
                }

                // check if city field fits to DB result
                let cityExists = false;
                for (const { name, utcZone } of res) {
                    const reg = new RegExp(`\\b${name}\\b`);
                    cityExists = reg.test(input.city);
                    if (cityExists) {
                        address.utcZone = utcZone;
                        break;
                    }
                }
                if (!cityExists) {
                    throw new ApolloError(
                        'city does not fit to postal code',
                        '400'
                    );
                }

                const { ok, value } = await db.newBookings.findOneAndUpdate(
                    {
                        _id: new ObjectId(req.signedCookies.newBooking),
                        userId: user._id,
                    },
                    {
                        $set: {
                            address,
                        },
                    },
                    { returnOriginal: false }
                );
                if (!ok || ok !== 1 || !value) {
                    throw new ApolloError('failed to update newBooking', '500');
                }

                return value || null;
            } catch (error) {
                throw new ApolloError(error, '500');
            }
        },
        updateNewBookingDate: async (
            _root: undefined,
            { input }: UpdateDateInput,
            { db, req }: { db: Database; req: Request }
        ): Promise<NewBooking | null> => {
            try {
                const user = await authorize(req, db);

                if (!user || !user._id) {
                    throw new ApolloError('not authorized', '401');
                }

                const { ok, value } = await db.newBookings.findOneAndUpdate(
                    {
                        _id: new ObjectId(req.signedCookies.newBooking),
                        userId: user._id,
                    },
                    {
                        $set: { date: { from: input.from, to: input.to } },
                    },
                    { returnOriginal: false }
                );
                if (ok !== 1 || !value) {
                    throw new ApolloError('failed to update newBooking', '500');
                }

                return value || null;
            } catch (error) {
                throw new ApolloError(error, '500');
            }
        },
    },
    NewBooking: {
        id: (newBooking: NewBooking): string | undefined => {
            return newBooking._id ? newBooking._id.toString() : undefined;
        },
        services: async (
            newBooking: NewBooking,
            _args: undefined,
            { db }: { db: Database }
        ): Promise<Service[]> => {
            try {
                const servicesRes = db.services.find({
                    _id: { $in: newBooking.services },
                });
                return servicesRes.toArray();
            } catch (error) {
                throw new ApolloError(error, '500');
            }
        },
    },
    // Address: {
    //     utcZone: (address: Address): number | null => {
    //         return address.utcZone || null;
    //     },
    // },
};
