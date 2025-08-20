import bcrypt from "bcryptjs";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

export class SignupService {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string, password: string, firstName: string, lastName: string): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User(
      crypto.randomUUID(),
      firstName,
      lastName,
      email,
      hashedPassword
    );

    return this.userRepository.save(newUser);
  }
}
