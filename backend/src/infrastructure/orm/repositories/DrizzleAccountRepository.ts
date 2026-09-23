// filepath: backend/src/infrastructure/orm/repositories/DrizzleAccountRepository.ts
import { inject, injectable } from "tsyringe";
import { and, eq } from "drizzle-orm";
import { IAccountRepository } from "../../../domain/repositories/IAccountRepository.js";
import { Account, AccountProps } from "../../../domain/entities/Account.js";
import { Money } from "../../../domain/value-objects/Money.js";
import { AccountType } from "../../../domain/value-objects/AccountType.js";
import { db } from "../../database/connection.js";
import { accounts, AccountDb } from "../schema.js";

@injectable()
export class DrizzleAccountRepository implements IAccountRepository {
  async findById(userId: string, id: string): Promise<Account | null> {
    const result = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findAll(userId: string): Promise<Account[]> {
    const result = await db.select().from(accounts).where(eq(accounts.userId, userId));
    return result.map(this.mapToEntity);
  }

  async findActive(userId: string): Promise<Account[]> {
    const result = await db
      .select()
      .from(accounts)
      .where(and(eq(accounts.userId, userId), eq(accounts.isActive, true)));
    return result.map(this.mapToEntity);
  }

  async save(account: Account): Promise<Account> {
    const data = this.mapToDb(account);
    const [saved] = await db
      .insert(accounts)
      .values({
        id: account.id,
        userId: account.userId,
        name: account.name,
        type: account.type,
        balance: account.balance.amount.toFixed(2),
        color: account.color,
        icon: account.icon,
        isActive: account.isActive,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })
      .returning();

    return this.mapToEntity(saved);
  }

  async update(account: Account): Promise<Account> {
    const data = this.mapToDb(account);
    const [updated] = await db
      .update(accounts)
      .set(data)
      .where(and(eq(accounts.id, account.id), eq(accounts.userId, account.userId)))
      .returning();
    return this.mapToEntity(updated);
  }

  async delete(userId: string, id: string): Promise<void> {
    await db.delete(accounts).where(and(eq(accounts.id, id), eq(accounts.userId, userId)));
  }

  private mapToEntity(dbRecord: AccountDb): Account {
    const props: AccountProps = {
      id: dbRecord.id,
      userId: dbRecord.userId,
      name: dbRecord.name,
      type: dbRecord.type as AccountType,
      balance: new Money(parseFloat(dbRecord.balance), "BRL"),
      color: dbRecord.color,
      icon: dbRecord.icon,
      isActive: dbRecord.isActive,
      createdAt: new Date(dbRecord.createdAt),
      updatedAt: new Date(dbRecord.updatedAt),
    };
    return new Account(props);
  }

  private mapToDb(account: Account): Record<string, unknown> {
    return {
      id: account.id,
      userId: account.userId,
      name: account.name,
      type: account.type,
      balance: account.balance.amount.toFixed(2),
      color: account.color,
      icon: account.icon,
      isActive: account.isActive,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
