// filepath: backend/src/application/use-cases/accounts/UpdateAccountUseCase.ts
import { inject, injectable } from 'tsyringe';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { Account } from '../../../domain/entities/Account';
import { AccountMapper } from '../../mappers/AccountMapper';
import { UpdateAccountDTO, AccountDTO } from '../../dto/AccountDTO';
import { NotFoundError } from '../../../shared/errors';
import { Money, AccountType } from '../../../domain/value-objects';

@injectable()
export class UpdateAccountUseCase {
  constructor(
    @inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(userId: string, id: string, dto: UpdateAccountDTO): Promise<AccountDTO> {
    const existingAccount = await this.accountRepository.findById(userId, id);

    if (!existingAccount) {
      throw new NotFoundError('Account', id);
    }

    if (dto.name !== undefined) {
      existingAccount.updateName(dto.name);
    }
    if (dto.balance !== undefined) {
      existingAccount.updateBalance(new Money(dto.balance));
    }
    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        existingAccount.activate();
      } else {
        existingAccount.deactivate();
      }
    }

    const updatedAccount = await this.accountRepository.update(existingAccount);
    return AccountMapper.toDTO(updatedAccount);
  }
}