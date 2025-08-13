import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserService {
  constructor(private repo: IUserRepository) {}

  async execute(name: string, email: string): Promise<User> {
    const user = new User(uuidv4(), name, email);
    // simple domain validation example:
    if (!email.includes('@')) throw new Error('Invalid email');
    return this.repo.create(user);
  }
}
