// filepath: backend/src/domain/repositories/IAccountRepository.ts
import { Account } from "../entities/Account";

export interface IAccountRepository {
  findById(userId: string, id: string): Promise<Account | null>;
  findAll(userId: string): Promise<Account[]>;
  findActive(userId: string): Promise<Account[]>;
  save(account: Account): Promise<Account>;
  update(account: Account): Promise<Account>;
  delete(userId: string, id: string): Promise<void>;
}
