import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { JwtService } from '../../../infrastructure/auth/JwtService';
import { LoginMapper } from '../../mappers/LoginMapper';
import bcrypt from 'bcrypt';
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const userDTO = LoginMapper.toDTO(user);
    const isPasswordValid = await bcrypt.compare(password, userDTO.passwordHash);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    return this.jwtService.generateToken({ userId: userDTO.id });
  }
}