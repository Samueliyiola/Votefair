import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { typeDefs } from '../../infrastructure/graphql/schema';
import { resolvers } from '../../infrastructure/graphql/resolvers';

export async function createServer() {
    //const app = express();
    const app : express.Application = express();
    app.use(bodyParser.json());

    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await server.start();
    server.applyMiddleware({ app : app as any, path: '/graphql' });

    return app;
}
