import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ProfileDTO } from "../../dto/ProfileDTO";
import { NotFoundError } from "../../../shared/errors";

@injectable()
export class GetProfileUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<ProfileDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
    };
  }
}
