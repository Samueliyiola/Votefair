import { userResolvers } from './user.resolver';
import { pollResolvers } from './poll.resolver';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...pollResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...pollResolvers.Mutation,
  },
};
