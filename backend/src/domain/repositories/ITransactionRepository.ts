import { Transaction } from '../entities/Transaction';

export interface TransactionFilters {
  accountId?: string;
  agreementId?: string;
  type?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
  count(filters?: TransactionFilters): Promise<number>;
}