// filepath: backend/src/application/use-cases/agreements/DeleteAgreementUseCase.ts
import { inject, injectable } from 'tsyringe';
import { IAgreementRepository } from '../../../domain/repositories/IAgreementRepository';
import { NotFoundError } from '../../../shared/errors';

@injectable()
export class DeleteAgreementUseCase {
  constructor(
    @inject('IAgreementRepository')
    private readonly agreementRepository: IAgreementRepository
  ) {}

  async execute(id: string): Promise<void> {
    const agreement = await this.agreementRepository.findById(id);

    if (!agreement) {
      throw new NotFoundError('Agreement', id);
    }

    await this.agreementRepository.delete(id);
  }
}