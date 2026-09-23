import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { JwtService } from "../../../infrastructure/auth/JwtService";
import { OAuthService } from "../../../infrastructure/auth/OAuthService";
import { User } from "../../../domain/entities/User";
import { randomUUID } from "crypto";

export class OAuthCallbackUseCase {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: JwtService,
    private oauthService: OAuthService,
  ) {}

  async execute(provider: string, oauthToken: string): Promise<string> {
    const payload = await this.oauthService.verify(provider, oauthToken);

    if (!payload) {
      throw new Error("OAuth payload is undefined");
    }

    let user = await this.userRepository.findByOAuth(provider, payload.sub);

    if (!user) {
      user = new User({
        id: randomUUID(),
        email: payload.email || "",
        name: payload.name || "",
        oauthProvider: provider,
        oauthId: payload.sub,
        role: "read-only",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await this.userRepository.save(user);
    }

    return this.jwtService.generateToken({ userId: user.id, role: user.role });
  }
}
