// filepath: backend/src/infrastructure/orm/repositories/DrizzleTransactionRepository.ts
import { inject, injectable } from 'tsyringe';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { ITransactionRepository, TransactionFilters } from '../../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../../domain/entities/Transaction';
import { Money, TransactionType } from '../../../domain/value-objects';
import { db } from '../../database/connection';
import { transactions, TransactionDb } from '../schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';


type TransactionInsert = InferInsertModel<typeof transactions>;
type TransactionSelect = InferSelectModel<typeof transactions>;

@injectable()
export class DrizzleTransactionRepository implements ITransactionRepository {
  async findById(userId: string, id: string): Promise<Transaction | null> {
    const result = await db.select().from(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findAll(userId: string, filters?: TransactionFilters): Promise<Transaction[]> {
    let query = db.select().from(transactions);
    
    const conditions = [eq(transactions.userId, userId)];
    
    if (filters?.accountId) {
      conditions.push(eq(transactions.accountId, filters.accountId));
    }
    if (filters?.agreementId) {
      conditions.push(eq(transactions.agreementId, filters.agreementId));
    }
    if (filters?.type) {
      conditions.push(eq(transactions.type, filters.type));
    }
    if (filters?.category) {
      conditions.push(eq(transactions.category, filters.category));
    }
    if (filters?.startDate) {
      conditions.push(gte(transactions.date, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(transactions.date, filters.endDate));
    }

    if (conditions.length > 0) {
      const result = await db.select().from(transactions).where(and(...conditions));
      return result.map(this.mapToEntity);
    }

    const result = await db.select().from(transactions);
    return result.map(this.mapToEntity);
  }

  async findByAccountId(userId: string, accountId: string): Promise<Transaction[]> {
    const result = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, userId), eq(transactions.accountId, accountId)));
    return result.map(this.mapToEntity);
  }

  async findByDateRange(userId: string, startDate: Date, endDate: Date): Promise<Transaction[]> {
    const result = await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, userId), gte(transactions.date, startDate), lte(transactions.date, endDate)));
    return result.map(this.mapToEntity);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const data = this.mapToDb(transaction);
    const [saved] = await db.insert(transactions).values(data).returning();
    return this.mapToEntity(saved);
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const data = this.mapToDb(transaction);
    const [updated] = await db
      .update(transactions)
      .set(data)
      .where(and(eq(transactions.id, transaction.id), eq(transactions.userId, transaction.userId)))
      .returning();
    return this.mapToEntity(updated);
  }

  async delete(userId: string, id: string): Promise<void> {
    await db.delete(transactions).where(and(eq(transactions.id, id), eq(transactions.userId, userId)));
  }

  async count(userId: string, filters?: TransactionFilters): Promise<number> {
    const conditions = [eq(transactions.userId, userId)];
    
    if (filters?.accountId) {
      conditions.push(eq(transactions.accountId, filters.accountId));
    }
    if (filters?.agreementId) {
      conditions.push(eq(transactions.agreementId, filters.agreementId));
    }
    if (filters?.type) {
      conditions.push(eq(transactions.type, filters.type));
    }
    if (filters?.category) {
      conditions.push(eq(transactions.category, filters.category));
    }
    if (filters?.startDate) {
      conditions.push(gte(transactions.date, filters.startDate));
    }
    if (filters?.endDate) {
      conditions.push(lte(transactions.date, filters.endDate));
    }

    const countQuery = db.select({ count: sql<number>`count(*)`.as('count') }).from(transactions);
    
    if (conditions.length > 0) {
      const result = await db.select({ count: sql<number>`count(*)`.as('count') })
        .from(transactions)
        .where(and(...conditions));
      return result[0]?.count ?? 0;
    }

    const result = await db.select({ count: sql<number>`count(*)`.as('count') }).from(transactions);
    return result[0]?.count ?? 0;
  }

  private mapToEntity(dbRecord: TransactionDb): Transaction {
    const paymentDateValue = (dbRecord as any).paymentDate;
    const props = {
      id: dbRecord.id,
      userId: dbRecord.userId,
      description: dbRecord.description,
      amount: new Money(parseFloat(dbRecord.amount), 'BRL'),
      type: dbRecord.type as TransactionType,
      category: dbRecord.category,
      accountId: dbRecord.accountId,
      agreementId: dbRecord.agreementId ?? undefined,
      date: new Date(dbRecord.date),
      paymentDate: paymentDateValue
        ? new Date(paymentDateValue)
        : undefined,
      createdAt: new Date(dbRecord.createdAt),
      updatedAt: new Date(dbRecord.updatedAt)
    };
    return new Transaction(props);
  }

  private mapToDb(transaction: Transaction): TransactionInsert {
    const dbObj = {
      id: transaction.id,
      userId: transaction.userId,
      description: transaction.description,
      amount: transaction.amount.amount.toFixed(2),
      type: transaction.type,
      category: transaction.category,
      accountId: transaction.accountId,
      agreementId: transaction.agreementId ?? null,
      date: transaction.date,
      paymentDate: transaction.paymentDate ?? null,
      createdAt: transaction.createdAt ?? new Date(),
      updatedAt: transaction.updatedAt ?? new Date()
    };
    return dbObj as unknown as TransactionInsert;
  }
}