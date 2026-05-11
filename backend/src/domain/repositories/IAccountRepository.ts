// filepath: backend/src/domain/repositories/IAccountRepository.ts
import { Account } from '../entities/Account';

export interface IAccountRepository {
  findById(id: string): Promise<Account | null>;
  findAll(): Promise<Account[]>;
  findActive(): Promise<Account[]>;
  save(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  delete(id: string): Promise<void>;
}