// filepath: backend/src/application/use-cases/agreements/DeleteAgreementUseCase.ts
import { inject, injectable } from "tsyringe";
import { IAgreementRepository } from "../../../domain/repositories/IAgreementRepository";
import { NotFoundError } from "../../../shared/errors";

@injectable()
export class DeleteAgreementUseCase {
  constructor(
    @inject("IAgreementRepository")
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(userId: string, id: string): Promise<void> {
    const agreement = await this.agreementRepository.findById(userId, id);

    if (!agreement) {
      throw new NotFoundError("Agreement", id);
    }

    await this.agreementRepository.delete(userId, id);
  }
}
