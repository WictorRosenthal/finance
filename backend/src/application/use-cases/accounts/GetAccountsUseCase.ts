// filepath: backend/src/application/use-cases/accounts/GetAccountsUseCase.ts
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { AccountMapper } from '../../mappers/AccountMapper';
import { AccountDTO } from '../../dto/AccountDTO';

@injectable()
export class GetAccountsUseCase {
  constructor(
    @inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(includeInactive: boolean = false): Promise<AccountDTO[]> {
    const accounts = includeInactive 
      ? await this.accountRepository.findAll()
      : await this.accountRepository.findActive();

    return AccountMapper.toDTOList(accounts);
  }
}