// filepath: backend/src/domain/value-objects/Money.ts
export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  constructor(amount: number, currency: string = 'BRL') {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    this._amount = Math.round(amount * 100) / 100;
    this._currency = currency;
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount + other._amount, this._currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount - other._amount, this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount * factor, this._currency);
  }

  isPositive(): boolean {
    return this._amount > 0;
  }

  isNegative(): boolean {
    return this._amount < 0;
  }

  isZero(): boolean {
    return this._amount === 0;
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && this._currency === other._currency;
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('Currency mismatch');
    }
  }

  toString(): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: this._currency
    }).format(this._amount);
  }

  static zero(currency: string = 'BRL'): Money {
    return new Money(0, currency);
  }
}