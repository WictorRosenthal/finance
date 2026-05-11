// filepath: backend/src/domain/repositories/IAgreementRepository.ts
import { Agreement } from '../entities/Agreement';

export interface IAgreementRepository {
  findById(id: string): Promise<Agreement | null>;
  findAll(): Promise<Agreement[]>;
  findActive(): Promise<Agreement[]>;
  save(agreement: Agreement): Promise<Agreement>;
  update(agreement: Agreement): Promise<Agreement>;
  delete(id: string): Promise<void>;
}