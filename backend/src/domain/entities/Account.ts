// filepath: backend/src/domain/entities/Account.ts
import { Money, AccountType } from '../value-objects';

export interface AccountProps {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: Money;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Account {
  private readonly props: AccountProps;

  constructor(props: AccountProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): AccountType {
    return this.props.type;
  }

  get balance(): Money {
    return this.props.balance;
  }

  get color(): string {
    return this.props.color;
  }

  get icon(): string {
    return this.props.icon;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  updateBalance(newBalance: Money): void {
    this.props.balance = newBalance;
    this.props.updatedAt = new Date();
  }

  updateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty');
    }
    this.props.name = name.trim();
    this.props.updatedAt = new Date();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  toPlainObject(): AccountProps {
    return { ...this.props };
  }
}