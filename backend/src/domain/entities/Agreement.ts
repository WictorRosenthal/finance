// filepath: backend/src/domain/entities/Agreement.ts
import { Money } from '../value-objects';

export interface AgreementProps {
  id: string;
  name: string;
  category: string;
  monthlyFee?: Money;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Agreement {
  private readonly props: AgreementProps;

  constructor(props: AgreementProps) {
    this.props = props;
  }

  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): string {
    return this.props.category;
  }

  get monthlyFee(): Money | undefined {
    return this.props.monthlyFee;
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

  updateName(name: string): void {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty');
    }
    this.props.name = name.trim();
    this.props.updatedAt = new Date();
  }

  updateMonthlyFee(fee: Money | undefined): void {
    this.props.monthlyFee = fee;
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

  toPlainObject(): AgreementProps {
    return { ...this.props };
  }
}