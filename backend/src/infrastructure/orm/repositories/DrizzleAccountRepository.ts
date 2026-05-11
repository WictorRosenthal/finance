// filepath: backend/src/infrastructure/orm/repositories/DrizzleAccountRepository.ts
import { inject, injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
import { IAccountRepository } from '../../../domain/repositories/IAccountRepository.js';
import { Account, AccountProps } from '../../../domain/entities/Account.js';
import { Money } from '../../../domain/value-objects/Money.js';
import { AccountType } from '../../../domain/value-objects/AccountType.js';
import { db } from '../../database/connection.js';
import { accounts, AccountDb } from '../schema.js';

@injectable()
export class DrizzleAccountRepository implements IAccountRepository {
  async findById(id: string): Promise<Account | null> {
    const result = await db.select().from(accounts).where(eq(accounts.id, id));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findAll(): Promise<Account[]> {
    const result = await db.select().from(accounts);
    return result.map(this.mapToEntity);
  }

  async findActive(): Promise<Account[]> {
    const result = await db.select().from(accounts).where(eq(accounts.isActive, true));
    return result.map(this.mapToEntity);
  }

  async save(account: Account): Promise<Account> {
    const data = this.mapToDb(account);
    const [saved] = await db.insert(accounts).values({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance.amount.toFixed(2),
      color: account.color,
      icon: account.icon,
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt
    }).returning();

    return this.mapToEntity(saved);
  }

  async update(account: Account): Promise<Account> {
    const data = this.mapToDb(account);
    const [updated] = await db
      .update(accounts)
      .set(data)
      .where(eq(accounts.id, account.id))
      .returning();
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db.delete(accounts).where(eq(accounts.id, id));
  }

  private mapToEntity(dbRecord: AccountDb): Account {
    const props: AccountProps = {
      id: dbRecord.id,
      name: dbRecord.name,
      type: dbRecord.type as AccountType,
      balance: new Money(parseFloat(dbRecord.balance), 'BRL'),
      color: dbRecord.color,
      icon: dbRecord.icon,
      isActive: dbRecord.isActive,
      createdAt: new Date(dbRecord.createdAt),
      updatedAt: new Date(dbRecord.updatedAt)
    };
    return new Account(props);
  }

  private mapToDb(account: Account): Record<string, unknown> {
    return {
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance.amount.toFixed(2),
      color: account.color,
      icon: account.icon,
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt
    };
  }
}