import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { JwtService } from '../../../infrastructure/auth/JwtService';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    // Aqui você deve comparar o hash da senha (exemplo simplificado)
    if (user.passwordHash !== password) throw new Error('Invalid credentials');
    return this.jwtService.generateToken({ userId: user.id });
  }
}