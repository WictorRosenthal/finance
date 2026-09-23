// filepath: backend/src/application/use-cases/transactions/UpdateTransactionUseCase.ts
import { inject, injectable } from 'tsyringe';
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { TransactionAggregate } from '../../../domain/aggregates/TransactionAggregate';
import { TransactionMapper } from '../../mappers/TransactionMapper';
import { UpdateTransactionDTO, TransactionDTO } from '../../dto/TransactionDTO';
import { NotFoundError, ValidationError } from '../../../shared/errors';
import { TransactionType } from '../../../domain/value-objects';
import { Money } from '../../../domain/value-objects';

@injectable()
export class UpdateTransactionUseCase {
  constructor(
    @inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(userId: string, id: string, dto: UpdateTransactionDTO): Promise<TransactionDTO> {
    const existingTransaction = await this.transactionRepository.findById(userId, id);

    if (!existingTransaction) {
      throw new NotFoundError('Transaction', id);
    }

    const aggregate = TransactionAggregate.fromEntity(existingTransaction);

    const updateProps: {
      description?: string;
      amount?: number;
      type?: TransactionType;
      category?: string;
      agreementId?: string;
      date?: Date;
      paymentDate?: Date | null;
    } = {};

    if (dto.description !== undefined) {
      updateProps.description = dto.description;
    }
    if (dto.amount !== undefined) {
      updateProps.amount = dto.amount;
    }
    if (dto.type !== undefined) {
      updateProps.type = dto.type as TransactionType;
    }
    if (dto.category !== undefined) {
      updateProps.category = dto.category;
    }
    if (dto.agreementId !== undefined) {
      updateProps.agreementId = dto.agreementId;
    }
    if (dto.date !== undefined) {
      updateProps.date = new Date(dto.date);
    }
    if ((dto as any).paymentDate !== undefined) {
      updateProps.paymentDate =
        (dto as any).paymentDate === null ? null : new Date((dto as any).paymentDate);
    }

    aggregate.update(updateProps);

    const updatedTransaction = await this.transactionRepository.update(
      aggregate.getTransaction()
    );

    return TransactionMapper.toDTO(updatedTransaction);
  }
}