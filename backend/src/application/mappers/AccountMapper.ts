// filepath: backend/src/application/mappers/AccountMapper.ts
import { Account } from '../../domain/entities/Account';
import { AccountDTO, CreateAccountDTO } from '../dto/AccountDTO';
import { AccountType } from '../../domain/value-objects';

export class AccountMapper {
  static toDTO(account: Account): AccountDTO {
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance.amount,
      currency: account.balance.currency,
      color: account.color,
      icon: account.icon,
      isActive: account.isActive,
      createdAt: account.createdAt.toISOString(),
      updatedAt: account.updatedAt.toISOString()
    };
  }

  static toDTOList(accounts: Account[]): AccountDTO[] {
    return accounts.map(this.toDTO);
  }

  static toCreateProps(dto: CreateAccountDTO): {
    name: string;
    type: AccountType;
    balance: number;
    color: string;
    icon: string;
  } {
    return {
      name: dto.name,
      type: dto.type as AccountType,
      balance: dto.balance ?? 0,
      color: dto.color ?? '',
      icon: dto.icon ?? ''
    };
  }
}