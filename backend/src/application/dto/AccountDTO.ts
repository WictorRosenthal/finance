// filepath: backend/src/application/dto/AccountDTO.ts
export interface AccountDTO {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountDTO {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
  balance?: number;
  color: string;
  icon: string;
}

export interface UpdateAccountDTO {
  name?: string;
  type?: 'CHECKING' | 'SAVINGS' | 'CREDIT' | 'INVESTMENT';
  balance?: number;
  color?: string;
  icon?: string;
  isActive?: boolean;
}