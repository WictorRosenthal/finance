// filepath: backend/src/application/use-cases/agreements/GetAgreementsUseCase.ts
import { inject, injectable } from "tsyringe";
import { IAgreementRepository } from "../../../domain/repositories/IAgreementRepository";
import { AgreementMapper } from "../../mappers/AgreementMapper";
import { AgreementDTO } from "../../dto/AgreementDTO";

@injectable()
export class GetAgreementsUseCase {
  constructor(
    @inject("IAgreementRepository")
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(userId: string, includeInactive: boolean = false): Promise<AgreementDTO[]> {
    const agreements = includeInactive
      ? await this.agreementRepository.findAll(userId)
      : await this.agreementRepository.findActive(userId);

    return AgreementMapper.toDTOList(agreements);
  }
}
