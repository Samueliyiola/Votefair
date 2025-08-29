import { SignupService } from "../../../application/services/auth/signUp.service";
import { LoginService } from "../../../application/services/auth/login.service";
import { UserRepositorySequelize } from "../../repositories/UserRepositorySequelize";

const userRepository = new UserRepositorySequelize();
const signupService = new SignupService(userRepository);
const loginService = new LoginService(userRepository);

export const userResolvers = {
  Query: {
    users: async () => userRepository.findAll(),
  },
  Mutation: {
    signup: async (_: any, { email, password, firstName, lastName, isAdmin }: any) => {
      return signupService.execute(email, password, firstName, lastName, isAdmin);
    },
    login: async (_: any, { email, password }: any) => {
      return loginService.execute(email, password);
    },
  },
};


// import { GetUsersService } from '../../../application/services/GetUsersService';
// import { CreateUserService } from '../../../application/services/CreateUserService';
// import { UserRepositorySequelize } from '../../repositories/UserRepositorySequelize';

// const repo = new UserRepositorySequelize();
// const getUsers = new GetUsersService(repo);
// const createUser = new CreateUserService(repo);

// export const userResolvers = {
//   Query: {
//     users: async () => getUsers.execute(),
//     user: async (_: any, { id }: { id: string }) => repo.findById(id),
//   },
//   Mutation: {
//     createUser: async (_: any, { name, email }: { name: string; email: string }) =>
//       createUser.execute(name, email),
//   },
// };
