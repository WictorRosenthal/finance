// filepath: backend/src/application/use-cases/accounts/CreateAccountUseCase.ts
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository';
import { Account, AccountProps } from '../../../domain/entities/Account';
import { AccountMapper } from '../../mappers/AccountMapper';
import { CreateAccountDTO, AccountDTO } from '../../dto/AccountDTO';
import { Money, AccountType } from '../../../domain/value-objects';

@injectable()
export class CreateAccountUseCase {
  constructor(
    @inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(dto: CreateAccountDTO): Promise<AccountDTO> {
    const props = AccountMapper.toCreateProps(dto);

    const now = new Date();
    const accountProps: AccountProps = {
      id: uuidv4(),
      name: props.name,
      type: props.type,
      balance: new Money(props.balance),
      color: props.color,
      icon: props.icon,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const account = new Account(accountProps);
    const savedAccount = await this.accountRepository.save(account);

    return AccountMapper.toDTO(savedAccount);
  }
}