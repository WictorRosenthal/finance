// filepath: backend/src/presentation/controllers/AgreementController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../infrastructure/container/Container';
import { CreateAgreementUseCase } from '../../application/use-cases/agreements/CreateAgreementUseCase';
import { GetAgreementsUseCase } from '../../application/use-cases/agreements/GetAgreementsUseCase';
import { GetAgreementByIdUseCase } from '../../application/use-cases/agreements/GetAgreementByIdUseCase';
import { UpdateAgreementUseCase } from '../../application/use-cases/agreements/UpdateAgreementUseCase';
import { DeleteAgreementUseCase } from '../../application/use-cases/agreements/DeleteAgreementUseCase';
import { CreateAgreementDTO, UpdateAgreementDTO } from '../../application/dto/AgreementDTO';
import { getAuthenticatedUserId } from '../middleware/authMiddleware';

export class AgreementController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(CreateAgreementUseCase);
    const dto = request.body as CreateAgreementDTO;
    const result = await useCase.execute(getAuthenticatedUserId(request), dto);
    return reply.status(201).send(result);
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(GetAgreementsUseCase);
    const includeInactive = (request.query as Record<string, unknown>)?.includeInactive === 'true';
    const result = await useCase.execute(getAuthenticatedUserId(request), includeInactive);
    return reply.send(result);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(GetAgreementByIdUseCase);
    const result = await useCase.execute(getAuthenticatedUserId(request), id);
    return reply.send(result);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(UpdateAgreementUseCase);
    const dto = request.body as UpdateAgreementDTO;
    const result = await useCase.execute(getAuthenticatedUserId(request), id, dto);
    return reply.send(result);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(DeleteAgreementUseCase);
    await useCase.execute(getAuthenticatedUserId(request), id);
    return reply.status(204).send();
  }
}