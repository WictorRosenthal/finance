import { Money, TransactionType } from '../value-objects';

export interface TransactionProps {
  id: string;
  userId: string;
  description: string;
  amount: Money;
  type: TransactionType;
  category: string;
  accountId: string;
  agreementId?: string;
  date: Date;
  paymentDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}


export class Transaction {
  private readonly props: TransactionProps;

  constructor(props: TransactionProps) {
    this.props = props;
  }

  get paymentDate(): Date | undefined {
    return this.props.paymentDate ?? undefined;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get description(): string {
    return this.props.description;
  }

  get amount(): Money {
    return this.props.amount;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get category(): string {
    return this.props.category;
  }

  get accountId(): string {
    return this.props.accountId;
  }

  get agreementId(): string | undefined {
    return this.props.agreementId;
  }

  get date(): Date {
    return this.props.date;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateDescription(description: string): void {
    if (!description || description.trim() === '') {
      throw new Error('Description cannot be empty');
    }
    this.props.description = description.trim();
    this.props.updatedAt = new Date();
  }

  updateAmount(amount: Money): void {
    this.props.amount = amount;
    this.props.updatedAt = new Date();
  }

  updateCategory(category: string): void {
    this.props.category = category;
    this.props.updatedAt = new Date();
  }

  markAsPaid(): void {
    if (this.props.paymentDate) {
      throw new Error("Transaction already paid");
    }

    this.props.paymentDate = new Date();
    this.props.updatedAt = new Date();
  }


  toPlainObject(): TransactionProps {
    return { ...this.props };
  }
}