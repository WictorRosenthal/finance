import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ProfileDTO, UpdateProfileDTO } from "../../dto/ProfileDTO";
import { ConflictError, NotFoundError } from "../../../shared/errors";

@injectable()
export class UpdateProfileUseCase {
  constructor(
    @inject("IUserRepository")
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: UpdateProfileDTO): Promise<ProfileDTO> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User", userId);
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser && existingUser.id !== userId) {
      throw new ConflictError("E-mail já cadastrado");
    }

    user.updateProfile(dto);
    const updatedUser = await this.userRepository.save(user);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
      avatarUrl: updatedUser.avatarUrl,
    };
  }
}
