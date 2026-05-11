// filepath: backend/src/application/mappers/AgreementMapper.ts
import { Agreement } from '../../domain/entities/Agreement';
import { AgreementDTO, CreateAgreementDTO } from '../dto/AgreementDTO';

export class AgreementMapper {
  static toDTO(agreement: Agreement): AgreementDTO {
    return {
      id: agreement.id,
      name: agreement.name,
      category: agreement.category,
      monthlyFee: agreement.monthlyFee?.amount,
      currency: agreement.monthlyFee?.currency,
      isActive: agreement.isActive,
      createdAt: agreement.createdAt.toISOString(),
      updatedAt: agreement.updatedAt.toISOString()
    };
  }

  static toDTOList(agreements: Agreement[]): AgreementDTO[] {
    return agreements.map(this.toDTO);
  }

  static toCreateProps(dto: CreateAgreementDTO): {
    name: string;
    category: string;
    monthlyFee?: number;
  } {
    return {
      name: dto.name,
      category: dto.category,
      monthlyFee: dto.monthlyFee
    };
  }
}