import { gql } from 'apollo-server-express';
import fs from 'fs';
import path from 'path';

const userSDL = fs.readFileSync(path.join(__dirname, 'typeDefs', 'user.graphql'), 'utf8');

export const typeDefs = gql([userSDL] as any);
