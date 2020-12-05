import { Database, User } from '../../../lib/types';
import { RegisterUserInput } from './types';
import bcrypt from 'bcrypt';
import { IResolvers } from 'apollo-server-express';

export const userResolver: IResolvers = {
    Mutation: {
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
    User: {
        id: (user: User): string | undefined => {
            return user._id ? user._id.toString() : undefined;
        },
    },
};
