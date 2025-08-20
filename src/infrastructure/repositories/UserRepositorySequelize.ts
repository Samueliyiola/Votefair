import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../database/models/UserModel";

export class UserRepositorySequelize implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email } });
    return user;
  }

  async save(user: User): Promise<User> {
    const created = await UserModel.create({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      isVerified: user.isVerified
    });
    return new User(created.id, created.firstName, created.lastName, created.email, created.password, created.isVerified);
  }

  async findAll(): Promise<User[]> {
    const users = await UserModel.findAll();
    return users.map(u => new User(u.id, u.firstName, u.lastName, u.email, u.password, u.isVerified));
  }
}
