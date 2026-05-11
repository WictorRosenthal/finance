// filepath: backend/src/application/dto/AgreementDTO.ts
export interface AgreementDTO {
  id: string;
  name: string;
  category: string;
  monthlyFee?: number;
  currency?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgreementDTO {
  name: string;
  category: string;
  monthlyFee?: number;
}

export interface UpdateAgreementDTO {
  name?: string;
  category?: string;
  monthlyFee?: number;
  isActive?: boolean;
}