import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { LoginMapper } from "../../mappers/LoginMapper";
import { UnauthorizedError } from "../../../shared/errors/AppError";
import bcrypt from "bcrypt";
export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService,
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user) throw new UnauthorizedError("Email ou senha inválidos");

    const userDTO = LoginMapper.toDTO(user);
    const isPasswordValid = userDTO.passwordHash
      ? await bcrypt.compare(password, userDTO.passwordHash)
      : false;
    if (!isPasswordValid) throw new UnauthorizedError("Email ou senha inválidos");

    return this.jwtService.generateToken({ userId: userDTO.id });
  }
}
