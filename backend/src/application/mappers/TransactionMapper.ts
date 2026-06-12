import { Transaction } from '../../domain/entities/Transaction';
import { TransactionDTO, CreateTransactionDTO, TransactionFiltersDTO } from '../dto/TransactionDTO';
import { TransactionType } from '../../domain/value-objects';
import { TransactionFilters } from '../../domain/repositories/ITransactionRepository';

export class TransactionMapper {
  static toDTO(transaction: Transaction): TransactionDTO {
    return {
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount.amount,
      currency: transaction.amount.currency,
      type: transaction.type,
      category: transaction.category,
      accountId: transaction.accountId,
      agreementId: transaction.agreementId,
      date: transaction.date.toISOString(),
      paymentDate: (transaction as any).paymentDate ? (transaction as any).paymentDate.toISOString() : null, 
      createdAt: transaction.createdAt.toISOString(),
      updatedAt: transaction.updatedAt.toISOString()
    };
  }

  static toDTOList(transactions: Transaction[]): TransactionDTO[] {
    return transactions.map(this.toDTO);
  }

  static toCreateProps(dto: CreateTransactionDTO): {
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    accountId: string;
    agreementId?: string;
    date: Date;
    paymentDate?: Date | null; 
  } {
    return {
      description: dto.description,
      amount: dto.amount,
      type: dto.type as TransactionType,
      category: dto.category,
      accountId: dto.accountId,
      agreementId: dto.agreementId,
      date: new Date(dto.date),
      paymentDate:
        dto.paymentDate === undefined
          ? undefined
          : dto.paymentDate === null
          ? null
          : new Date(dto.paymentDate),
    };
  }

  static toFilters(dto: TransactionFiltersDTO): TransactionFilters {
    return {
      accountId: dto.accountId,
      agreementId: dto.agreementId,
      type: dto.type,
      category: dto.category,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined
    };
  }
}