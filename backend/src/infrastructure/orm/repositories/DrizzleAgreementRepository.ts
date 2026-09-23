// filepath: backend/src/infrastructure/orm/repositories/DrizzleAgreementRepository.ts
import { inject, injectable } from 'tsyringe';
import { and, eq } from 'drizzle-orm';
import { IAgreementRepository } from '../../../domain/repositories/IAgreementRepository';
import { Agreement, AgreementProps } from '../../../domain/entities/Agreement';
import { Money } from '../../../domain/value-objects';
import { db } from '../../database/connection';
import { agreements, AgreementDb } from '../schema';
import { InferInsertModel, InferSelectModel } from 'drizzle-orm';


type AgreementInsert = InferInsertModel<typeof agreements>;
type AgreementSelect = InferSelectModel<typeof agreements>;


@injectable()
export class DrizzleAgreementRepository implements IAgreementRepository {
  async findById(userId: string, id: string): Promise<Agreement | null> {
    const result = await db.select().from(agreements).where(and(eq(agreements.id, id), eq(agreements.userId, userId)));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findAll(userId: string): Promise<Agreement[]> {
    const result = await db.select().from(agreements).where(eq(agreements.userId, userId));
    return result.map(this.mapToEntity);
  }

  async findActive(userId: string): Promise<Agreement[]> {
    const result = await db.select().from(agreements).where(and(eq(agreements.userId, userId), eq(agreements.isActive, true)));
    return result.map(this.mapToEntity);
  }

  async save(agreement: Agreement): Promise<Agreement> {
    const data = this.mapToDb(agreement);
    const [saved] = await db.insert(agreements).values(data).returning();
    return this.mapToEntity(saved);
  }

  async update(agreement: Agreement): Promise<Agreement> {
    const data = this.mapToDb(agreement);
    const [updated] = await db
      .update(agreements)
      .set(data)
      .where(and(eq(agreements.id, agreement.id), eq(agreements.userId, agreement.userId)))
      .returning();
    return this.mapToEntity(updated);
  }

  async delete(userId: string, id: string): Promise<void> {
    await db.delete(agreements).where(and(eq(agreements.id, id), eq(agreements.userId, userId)));
  }

  private mapToEntity(dbRecord: AgreementDb): Agreement {
    const props: AgreementProps = {
      id: dbRecord.id,
      userId: dbRecord.userId,
      name: dbRecord.name,
      category: dbRecord.category,
      monthlyFee: dbRecord.monthlyFee != null? new Money(Number(dbRecord.monthlyFee), 'BRL') : undefined,
      isActive: dbRecord.isActive,
      createdAt: new Date(dbRecord.createdAt),
      updatedAt: new Date(dbRecord.updatedAt)
    };
    return new Agreement(props);
  }

  
  private mapToDb(agreement: Agreement): AgreementInsert {
    return {
      id: agreement.id,
      userId: agreement.userId,
      name: agreement.name,
      category: agreement.category,
      monthlyFee: agreement.monthlyFee
        ? agreement.monthlyFee.amount.toString() // ✅
        : null,
      isActive: agreement.isActive,
      createdAt: agreement.createdAt,
      updatedAt: agreement.updatedAt
    };
  }
}