// filepath: backend/src/application/use-cases/accounts/GetAccountByIdUseCase.ts
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { AccountMapper } from '../../mappers/AccountMapper';
import { AccountDTO } from '../../dto/AccountDTO';
import { NotFoundError } from '../../../shared/errors';

@injectable()
export class GetAccountByIdUseCase {
  constructor(
    @inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(id: string): Promise<AccountDTO> {
    const account = await this.accountRepository.findById(id);

    if (!account) {
      throw new NotFoundError('Account', id);
    }

    return AccountMapper.toDTO(account);
  }
}