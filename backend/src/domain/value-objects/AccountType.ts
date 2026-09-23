// filepath: backend/src/domain/value-objects/AccountType.ts
export enum AccountType {
  CHECKING = "CHECKING",
  SAVINGS = "SAVINGS",
  CREDIT = "CREDIT",
  INVESTMENT = "INVESTMENT",
}

export function isAccountType(value: string): value is AccountType {
  return Object.values(AccountType).includes(value as AccountType);
}
