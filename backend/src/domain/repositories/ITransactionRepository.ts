import { Transaction } from "../entities/Transaction";

export interface TransactionFilters {
  accountId?: string;
  agreementId?: string;
  type?: string;
  category?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface ITransactionRepository {
  findById(userId: string, id: string): Promise<Transaction | null>;
  findAll(userId: string, filters?: TransactionFilters): Promise<Transaction[]>;
  findByAccountId(userId: string, accountId: string): Promise<Transaction[]>;
  findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(userId: string, id: string): Promise<void>;
  count(userId: string, filters?: TransactionFilters): Promise<number>;
}
