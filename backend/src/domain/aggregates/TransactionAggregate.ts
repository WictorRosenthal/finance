// filepath: backend/src/domain/aggregates/TransactionAggregate.ts
import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionProps } from '../entities/Transaction';
import { Money, TransactionType } from '../value-objects';

export interface CreateTransactionProps {
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  accountId: string;
  agreementId?: string;
  date: Date;
}

export interface UpdateTransactionProps {
  description?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
  agreementId?: string;
  date?: Date;
}

export class TransactionAggregate {
  private transaction: Transaction;

  private constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  static create(props: CreateTransactionProps): TransactionAggregate {
    // Validações de domínio
    if (!props.description || props.description.trim() === '') {
      throw new Error('Description is required');
    }
    if (props.amount <= 0) {
      throw new Error('Amount must be positive');
    }
    if (!props.category || props.category.trim() === '') {
      throw new Error('Category is required');
    }
    if (!props.accountId) {
      throw new Error('Account ID is required');
    }
    if (!Object.values(TransactionType).includes(props.type)) {
      throw new Error('Invalid transaction type');
    }

    const now = new Date();
    const transactionProps: TransactionProps = {
      id: uuidv4(),
      description: props.description.trim(),
      amount: new Money(props.amount),
      type: props.type,
      category: props.category.trim(),
      accountId: props.accountId,
      agreementId: props.agreementId,
      date: props.date,
      createdAt: now,
      updatedAt: now
    };

    const transaction = new Transaction(transactionProps);
    return new TransactionAggregate(transaction);
  }

  static fromEntity(transaction: Transaction): TransactionAggregate {
    return new TransactionAggregate(transaction);
  }

  getTransaction(): Transaction {
    return this.transaction;
  }

  update(props: UpdateTransactionProps): void {
    if (props.description !== undefined) {
      this.transaction.updateDescription(props.description);
    }
    if (props.amount !== undefined) {
      this.transaction.updateAmount(new Money(props.amount));
    }
    if (props.category !== undefined) {
      this.transaction.updateCategory(props.category);
    }
  }

  applyDiscount(discountAmount: number): void {
    if (this.transaction.type === TransactionType.INCOME) {
      throw new Error('Cannot apply discount to income transactions');
    }
    if (discountAmount <= 0) {
      throw new Error('Discount amount must be positive');
    }
    if (discountAmount >= this.transaction.amount.amount) {
      throw new Error('Discount cannot be greater than or equal to transaction amount');
    }

    const currentAmount = this.transaction.amount.amount;
    const newAmount = currentAmount - discountAmount;
    this.transaction.updateAmount(new Money(newAmount));
  }
}