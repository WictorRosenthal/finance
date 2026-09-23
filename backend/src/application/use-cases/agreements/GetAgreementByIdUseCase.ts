// filepath: backend/src/application/use-cases/agreements/GetAgreementByIdUseCase.ts
import { inject, injectable } from "tsyringe";
import { IAgreementRepository } from "../../../domain/repositories/IAgreementRepository";
import { AgreementMapper } from "../../mappers/AgreementMapper";
import { AgreementDTO } from "../../dto/AgreementDTO";
import { NotFoundError } from "../../../shared/errors";

@injectable()
export class GetAgreementByIdUseCase {
  constructor(
    @inject("IAgreementRepository")
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(userId: string, id: string): Promise<AgreementDTO> {
    const agreement = await this.agreementRepository.findById(userId, id);

    if (!agreement) {
      throw new NotFoundError("Agreement", id);
    }

    return AgreementMapper.toDTO(agreement);
  }
}
