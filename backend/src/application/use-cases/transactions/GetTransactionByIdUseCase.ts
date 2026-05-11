// filepath: backend/src/application/use-cases/transactions/GetTransactionByIdUseCase.ts
import { inject, injectable } from 'tsyringe';
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { TransactionMapper } from '../../mappers/TransactionMapper';
import { TransactionDTO } from '../../dto/TransactionDTO';
import { NotFoundError } from '../../../shared/errors';

@injectable()
export class GetTransactionByIdUseCase {
  constructor(
    @inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(id: string): Promise<TransactionDTO> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new NotFoundError('Transaction', id);
    }

    return TransactionMapper.toDTO(transaction);
  }
}