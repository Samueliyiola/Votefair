import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { typeDefs } from '../../infrastructure/graphql/schema';
import { resolvers } from '../../infrastructure/graphql/resolvers';
import { authenticateToken, AuthenticatedRequest } from '../middlewares/auth';
import { GraphQLContext } from '../../shared';

export async function createServer() {
    //const app = express();
    const app : express.Application = express();
    app.use(bodyParser.json());

    app.use('/graphql', authenticateToken);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req }: { req: AuthenticatedRequest }): GraphQLContext => {
            // console.log('Context content:', req.user);
            return { user: req.user };
        },
    });

    await server.start();
    server.applyMiddleware({ app : app as any, path: '/graphql' });

    return app;
}
