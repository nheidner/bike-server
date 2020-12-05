import { IResolvers } from 'apollo-server-express';
import { Database, Service } from '../../../lib/types';
import { ServicesData, ServiceArgs } from './types';
import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server-express';

export const serviceResolvers: IResolvers = {
    Query: {
        services: async (
            _root: undefined,
            { limit, offset }: { limit: number; offset: number },
            { db }: { db: Database }
        ): Promise<ServicesData> => {
            try {
                const data: ServicesData = {
                    total: 0,
                    result: [],
                };
                let cursor = db.services.find({});
                cursor = cursor.skip(offset);
                cursor = cursor.limit(limit);

                data.total = await cursor.count();
                data.result = await cursor.toArray();

                return data;
            } catch (error) {
                throw new Error(`failed to query services: ${error}`);
            }
        },
        service: async (
            _root: undefined,
            { id }: ServiceArgs,
            { db }: { db: Database }
        ): Promise<Service> => {
            try {
                const service = await db.services.findOne({
                    _id: new ObjectId(id),
                });

                if (!service) {
                    throw new ApolloError(
                        'service cannot be found',
                        'DB_ERROR'
                    );
                }

                return service;
            } catch (error) {
                throw new ApolloError(error, 'INTERNAL_ERROR');
            }
        },
    },

    // map ObjectID from MongoDB database to string when returned (to client)
    Service: {
        id: (service: Service): string | undefined => {
            return service._id ? service._id.toString() : undefined;
        },
    },
};
