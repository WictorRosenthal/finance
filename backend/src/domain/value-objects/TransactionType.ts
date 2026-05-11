// filepath: backend/src/domain/value-objects/TransactionType.ts
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

export function isTransactionType(value: string): value is TransactionType {
  return Object.values(TransactionType).includes(value as TransactionType);
}