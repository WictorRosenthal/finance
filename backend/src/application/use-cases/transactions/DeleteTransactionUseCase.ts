// filepath: backend/src/application/use-cases/transactions/DeleteTransactionUseCase.ts
import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { NotFoundError } from "../../../shared/errors";

@injectable()
export class DeleteTransactionUseCase {
  constructor(
    @inject("ITransactionRepository")
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(userId: string, id: string): Promise<void> {
    const transaction = await this.transactionRepository.findById(userId, id);

    if (!transaction) {
      throw new NotFoundError("Transaction", id);
    }

    await this.transactionRepository.delete(userId, id);
  }
}
