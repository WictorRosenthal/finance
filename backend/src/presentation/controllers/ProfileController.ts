import { FastifyReply, FastifyRequest } from "fastify";
import { container } from "../../infrastructure/container/Container";
import { UpdateProfileDTO } from "../../application/dto/ProfileDTO";
import { getAuthenticatedUserId } from "../middleware/authMiddleware";
import { GetProfileUseCase } from "../../application/use-cases/profile/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../application/use-cases/profile/UpdateProfileUseCase";

export class ProfileController {
  async get(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(GetProfileUseCase);
    const profile = await useCase.execute(getAuthenticatedUserId(request));
    return reply.send(profile);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(UpdateProfileUseCase);
    const profile = await useCase.execute(
      getAuthenticatedUserId(request),
      request.body as UpdateProfileDTO,
    );
    return reply.send(profile);
  }
}
