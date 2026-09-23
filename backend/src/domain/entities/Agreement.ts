import { Money } from '../value-objects';

export interface AgreementProps {
  id: string;
  userId: string;
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

  get userId(): string {
    return this.props.userId;
  }

  get name(): string {
    return this.props.name;
  }

  get category(): string {
    return this.props.category;
  }

  // ✅ Opção 1 (melhor): expor o Value Object
  get monthlyFee(): Money | undefined {
    return this.props.monthlyFee;
  }

  // ✅ Opção 2 (se precisar número simples)
  get monthlyFeeAmount(): number | undefined {
    return this.props.monthlyFee?.amount;
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
    this.touch();
  }

  updateMonthlyFee(fee: Money | undefined): void {
    this.props.monthlyFee = fee;
    this.touch();
  }

  // ✅ NOVO: regra de negócio dentro da entidade
  applyDiscount(percent: number): void {
    if (!this.props.monthlyFee) return;

    this.props.monthlyFee = this.props.monthlyFee.applyDiscount(percent);
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toPlainObject(): AgreementProps {
    return { ...this.props };
  }
}