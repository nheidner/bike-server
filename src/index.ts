import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { connectDatabase } from './db';
import { resolvers, typeDefs } from './graphql';
import cookieParser from 'cookie-parser';

import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Pass schema definition and resolvers to the
// ApolloServer constructor

const mount = async (app: express.Application) => {
    app.use(cookieParser(process.env.SECRET));
    app.use(express.static('public'));

    const db = await connectDatabase();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ db, req, res }),
    });
    server.applyMiddleware({ app, path: '/api' });

    app.listen(process.env.PORT);
    console.log(`[app] : http://localhost:${process.env.PORT}`);
};

mount(app);
