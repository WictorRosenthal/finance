import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export class RegisterUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password, name }: { email: string; password: string; name: string }): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('E-mail já cadastrado');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      id: randomUUID(),
      email,
      passwordHash,
      name,
      role: 'read-only',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return await this.userRepository.save(user);
  }
}