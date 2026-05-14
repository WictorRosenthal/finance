// filepath: backend/src/application/use-cases/agreements/CreateAgreementUseCase.ts
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
import { IAgreementRepository } from '../../../domain/repositories/IAgreementRepository';
import { Agreement, AgreementProps } from '../../../domain/entities/Agreement';
import { AgreementMapper } from '../../mappers/AgreementMapper';
import { CreateAgreementDTO, AgreementDTO } from '../../dto/AgreementDTO';
import { Money } from '../../../domain/value-objects';

@injectable()
export class CreateAgreementUseCase {
  constructor(
    @inject('IAgreementRepository')
    private readonly agreementRepository: IAgreementRepository
  ) {}

  async execute(dto: CreateAgreementDTO): Promise<AgreementDTO> {
    const props = AgreementMapper.toCreateProps(dto);

    const now = new Date();

    const agreementProps: AgreementProps = {
      id: uuidv4(),
      name: props.name,
      category: props.category,
      monthlyFee: props.monthlyFee
        ? new Money(props.monthlyFee)
        : undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };

    const agreement = new Agreement(agreementProps);

    // ✅ aplica desconto usando regra da entidade
    if (dto.discountPercentage !== undefined) {
      agreement.applyDiscount(dto.discountPercentage);
    }

    const savedAgreement = await this.agreementRepository.save(agreement);

    return AgreementMapper.toDTO(savedAgreement);
  }
}
