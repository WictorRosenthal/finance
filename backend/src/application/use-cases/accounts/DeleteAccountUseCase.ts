// filepath: backend/src/application/use-cases/accounts/DeleteAccountUseCase.ts
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { NotFoundError } from '../../../shared/errors';

@injectable()
export class DeleteAccountUseCase {
  constructor(
    @inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(id: string): Promise<void> {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new NotFoundError('Account', id);
    }

    await this.accountRepository.delete(id);
  }
}