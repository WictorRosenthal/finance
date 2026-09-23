// filepath: backend/src/presentation/controllers/AccountController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../infrastructure/container/Container';
import { CreateAccountUseCase } from '../../application/use-cases/accounts/CreateAccountUseCase';
import { GetAccountsUseCase } from '../../application/use-cases/accounts/GetAccountsUseCase';
import { GetAccountByIdUseCase } from '../../application/use-cases/accounts/GetAccountByIdUseCase';
import { UpdateAccountUseCase } from '../../application/use-cases/accounts/UpdateAccountUseCase';
import { DeleteAccountUseCase } from '../../application/use-cases/accounts/DeleteAccountUseCase';
import { CreateAccountDTO, UpdateAccountDTO } from '../../application/dto/AccountDTO';
import { getAuthenticatedUserId } from '../middleware/authMiddleware';

export class AccountController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(CreateAccountUseCase);
    const dto = request.body as CreateAccountDTO;
    const result = await useCase.execute(getAuthenticatedUserId(request), dto);
    return reply.status(201).send(result);
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(GetAccountsUseCase);
    const includeInactive = (request.query as Record<string, unknown>)?.includeInactive === 'true';
    const result = await useCase.execute(getAuthenticatedUserId(request), includeInactive);
    return reply.send(result);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(GetAccountByIdUseCase);
    const result = await useCase.execute(getAuthenticatedUserId(request), id);
    return reply.send(result);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(UpdateAccountUseCase);
    const dto = request.body as UpdateAccountDTO;
    const result = await useCase.execute(getAuthenticatedUserId(request), id, dto);
    return reply.send(result);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(DeleteAccountUseCase);
    await useCase.execute(getAuthenticatedUserId(request), id);
    return reply.status(204).send();
  }
}