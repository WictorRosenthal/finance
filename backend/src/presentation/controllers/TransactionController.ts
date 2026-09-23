import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "../../infrastructure/container/Container";
import { CreateTransactionUseCase } from "../../application/use-cases/transactions/CreateTransactionUseCase";
import { GetTransactionsUseCase } from "../../application/use-cases/transactions/GetTransactionsUseCase";
import { GetTransactionByIdUseCase } from "../../application/use-cases/transactions/GetTransactionByIdUseCase";
import { UpdateTransactionUseCase } from "../../application/use-cases/transactions/UpdateTransactionUseCase";
import { DeleteTransactionUseCase } from "../../application/use-cases/transactions/DeleteTransactionUseCase";
import {
  CreateTransactionDTO,
  TransactionFiltersDTO,
  UpdateTransactionDTO,
} from "../../application/dto/TransactionDTO";
import { MarkTransactionAsPaidUseCase } from "../../application/use-cases/transactions/MarkTransactionAsPaidUseCase";
import { getAuthenticatedUserId } from "../middleware/authMiddleware";
export class TransactionController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(CreateTransactionUseCase);
    const dto = request.body as CreateTransactionDTO;
    const result = await useCase.execute(getAuthenticatedUserId(request), dto);
    return reply.status(201).send(result);
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve(GetTransactionsUseCase);
    const filters = request.query as TransactionFiltersDTO;
    const result = await useCase.execute(getAuthenticatedUserId(request), filters);
    return reply.send(result);
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(GetTransactionByIdUseCase);
    const result = await useCase.execute(getAuthenticatedUserId(request), id);
    return reply.send(result);
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(UpdateTransactionUseCase);
    const dto = request.body as UpdateTransactionDTO;
    const result = await useCase.execute(getAuthenticatedUserId(request), id, dto);
    return reply.send(result);
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(DeleteTransactionUseCase);
    await useCase.execute(getAuthenticatedUserId(request), id);
    return reply.status(204).send();
  }
  async markAsPaid(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const useCase = container.resolve(MarkTransactionAsPaidUseCase);
    const result = await useCase.execute(getAuthenticatedUserId(request), id);
    return reply.send(result);
  }
}
