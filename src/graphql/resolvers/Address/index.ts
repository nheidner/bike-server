import { IResolvers } from 'apollo-server-express';
import { CheckAddressArgs } from './types';
import { Request, Response } from 'express';
import { Database, Address } from '../../../lib/types';

export const addressResolver: IResolvers = {
    Query: {
        checkAddress: (
            _root: undefined,
            { input }: CheckAddressArgs,
            { db, req, res }: { db: Database; req: Request; res: Response }
        ): Address => {
            return input;
        },
    },
};
