export interface TransactionDTO {
  id: string;
  description: string;
  amount: number;
  currency: string;
  type: string;
  category: string;
  accountId: string;
  agreementId?: string;
  date: string;
  paymentDate?: string | null; // ADICIONADO: payment date (ISO) opcional
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category: string;
  accountId: string;
  agreementId?: string;
  date: string;
  paymentDate?: string | null; // ADICIONADO: permitir criar já com paymentDate (opcional)
}

export interface UpdateTransactionDTO {
  description?: string;
  amount?: number;
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  category?: string;
  agreementId?: string;
  date?: string;
  paymentDate?: string | null; // ADICIONADO: permitir atualizar paymentDate
}

export interface TransactionFiltersDTO {
  accountId?: string;
  agreementId?: string;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedTransactionsDTO {
  data: TransactionDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}