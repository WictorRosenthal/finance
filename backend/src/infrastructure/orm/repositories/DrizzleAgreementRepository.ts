// filepath: backend/src/infrastructure/orm/repositories/DrizzleAgreementRepository.ts
import { inject, injectable } from 'tsyringe';
import { eq } from 'drizzle-orm';
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
  async findById(id: string): Promise<Agreement | null> {
    const result = await db.select().from(agreements).where(eq(agreements.id, id));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async findAll(): Promise<Agreement[]> {
    const result = await db.select().from(agreements);
    return result.map(this.mapToEntity);
  }

  async findActive(): Promise<Agreement[]> {
    const result = await db.select().from(agreements).where(eq(agreements.isActive, true));
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
      .where(eq(agreements.id, agreement.id))
      .returning();
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await db.delete(agreements).where(eq(agreements.id, id));
  }

  private mapToEntity(dbRecord: AgreementDb): Agreement {
    const props: AgreementProps = {
      id: dbRecord.id,
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