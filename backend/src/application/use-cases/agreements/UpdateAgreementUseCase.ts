// filepath: backend/src/application/use-cases/agreements/UpdateAgreementUseCase.ts
import { inject, injectable } from "tsyringe";
import { IAgreementRepository } from "../../../domain/repositories/IAgreementRepository";
import { Agreement } from "../../../domain/entities/Agreement";
import { AgreementMapper } from "../../mappers/AgreementMapper";
import { UpdateAgreementDTO, AgreementDTO } from "../../dto/AgreementDTO";
import { NotFoundError } from "../../../shared/errors";
import { Money } from "../../../domain/value-objects";

@injectable()
export class UpdateAgreementUseCase {
  constructor(
    @inject("IAgreementRepository")
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(userId: string, id: string, dto: UpdateAgreementDTO): Promise<AgreementDTO> {
    const existingAgreement = await this.agreementRepository.findById(userId, id);

    if (!existingAgreement) {
      throw new NotFoundError("Agreement", id);
    }

    if (dto.name !== undefined) {
      existingAgreement.updateName(dto.name);
    }
    if (dto.monthlyFee !== undefined) {
      existingAgreement.updateMonthlyFee(new Money(dto.monthlyFee));
    }
    if (dto.isActive !== undefined) {
      if (dto.isActive) {
        existingAgreement.activate();
      } else {
        existingAgreement.deactivate();
      }
    }

    const updatedAgreement = await this.agreementRepository.update(existingAgreement);
    return AgreementMapper.toDTO(updatedAgreement);
  }
}
