import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { injectable, inject } from "tsyringe";

@injectable()
export class MarkTransactionAsPaidUseCase {
  constructor(@inject('ITransactionRepository') 
  private transactionRepository: ITransactionRepository
  ) {}

  async execute(id: string) {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if ((transaction as any).paymentDate) {
      throw new Error('Transaction already paid');
    }

    transaction.markAsPaid();

    await this.transactionRepository.update(transaction);

    return transaction;
  }
}