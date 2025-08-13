import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserModel } from '../database/models/UserModel';

export class UserRepositorySequelize implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const row = await UserModel.findByPk(id);
    if (!row) return null;
    return new User(row.id, row.name, row.email);
  }

  async findAll(): Promise<User[]> {
    const rows = await UserModel.findAll();
    return rows.map(r => new User(r.id, r.name, r.email));
  }

  async create(user: User): Promise<User> {
    await UserModel.create({ id: user.id, name: user.name, email: user.email });
    return user;
  }
}
