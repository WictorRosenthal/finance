// filepath: backend/src/domain/repositories/IAgreementRepository.ts
import { Agreement } from "../entities/Agreement";

export interface IAgreementRepository {
  findById(userId: string, id: string): Promise<Agreement | null>;
  findAll(userId: string): Promise<Agreement[]>;
  findActive(userId: string): Promise<Agreement[]>;
  save(agreement: Agreement): Promise<Agreement>;
  update(agreement: Agreement): Promise<Agreement>;
  delete(userId: string, id: string): Promise<void>;
}
