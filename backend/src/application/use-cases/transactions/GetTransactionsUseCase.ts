// filepath: backend/src/application/use-cases/transactions/GetTransactionsUseCase.ts
import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { TransactionMapper } from "../../mappers/TransactionMapper";
import {
  TransactionFiltersDTO,
  TransactionDTO,
  PaginatedTransactionsDTO,
} from "../../dto/TransactionDTO";

@injectable()
export class GetTransactionsUseCase {
  constructor(
    @inject("ITransactionRepository")
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string, filters: TransactionFiltersDTO): Promise<PaginatedTransactionsDTO> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 20;
    const offset = (page - 1) * limit;

    // Converter filtros DTO para domínio
    const domainFilters = TransactionMapper.toFilters(filters);

    // Buscar transações
    const [transactions, total] = await Promise.all([
      this.transactionRepository.findAll(userId, {
        ...domainFilters,
        // Adicionar suporte a paginação se necessário
      }),
      this.transactionRepository.count(userId, domainFilters),
    ]);

    return {
      data: TransactionMapper.toDTOList(transactions),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
