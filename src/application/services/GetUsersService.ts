import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class GetUsersService {
  constructor(private repo: IUserRepository) {}

  async execute(): Promise<User[]> {
    return this.repo.findAll();
  }
}
