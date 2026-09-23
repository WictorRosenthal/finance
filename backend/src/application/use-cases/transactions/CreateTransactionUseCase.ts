// filepath: backend/src/application/use-cases/transactions/CreateTransactionUseCase.ts
import { inject, injectable } from 'tsyringe';
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { TransactionAggregate } from '../../../domain/aggregates/TransactionAggregate';
import { TransactionMapper } from '../../mappers/TransactionMapper';
import { CreateTransactionDTO, TransactionDTO } from '../../dto/TransactionDTO';
import { NotFoundError, ValidationError } from '../../../shared/errors';

@injectable()
export class CreateTransactionUseCase {
  constructor(
    @inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(userId: string, dto: CreateTransactionDTO): Promise<TransactionDTO> {
    // Converter DTO para props do domínio
    const props = { ...TransactionMapper.toCreateProps(dto), userId };

    // Criar aggregate (valida regras de domínio)
    const aggregate = TransactionAggregate.create(props);

    // Persistir via repository
    const savedTransaction = await this.transactionRepository.save(
      aggregate.getTransaction()
    );

    // Mapear para DTO de resposta
    return TransactionMapper.toDTO(savedTransaction);
  }
}