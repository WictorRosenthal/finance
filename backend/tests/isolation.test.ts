import "reflect-metadata";
import { describe, expect, it, vi } from "vitest";
import { GetAccountByIdUseCase } from "../src/application/use-cases/accounts/GetAccountByIdUseCase";
import { CreateTransactionUseCase } from "../src/application/use-cases/transactions/CreateTransactionUseCase";
import { IAccountRepository } from "../src/domain/repositories/IAccountRepository";
import { IAgreementRepository } from "../src/domain/repositories/IAgreementRepository";
import { ITransactionRepository } from "../src/domain/repositories/ITransactionRepository";
import { Account } from "../src/domain/entities/Account";
import { Money } from "../src/domain/value-objects/Money";
import { AccountType } from "../src/domain/value-objects/AccountType";
import { NotFoundError } from "../src/shared/errors";

const userA = "user-a";
const userB = "user-b";
const accountId = "account-1";
const agreementId = "agreement-1";

function makeAccount(userId: string): Account {
  return new Account({
    id: accountId,
    userId,
    name: "Conta principal",
    type: AccountType.CHECKING,
    balance: new Money(100),
    color: "#000000",
    icon: "wallet",
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  });
}

function makeTransactionDto(agreement?: string) {
  return {
    description: "Compra",
    amount: 25,
    type: "EXPENSE" as const,
    category: "Mercado",
    accountId,
    agreementId: agreement,
    date: "2026-09-23T00:00:00.000Z",
  };
}

describe("isolamento por usuário", () => {
  it("consulta uma conta usando o userId autenticado", async () => {
    const findById = vi.fn().mockResolvedValue(makeAccount(userA));
    const repository = { findById } as unknown as IAccountRepository;
    const useCase = new GetAccountByIdUseCase(repository);

    await useCase.execute(userA, accountId);

    expect(findById).toHaveBeenCalledWith(userA, accountId);
  });

  it("trata conta de outro usuário como não encontrada", async () => {
    const findById = vi.fn().mockResolvedValue(null);
    const repository = { findById } as unknown as IAccountRepository;
    const useCase = new GetAccountByIdUseCase(repository);

    await expect(useCase.execute(userB, accountId)).rejects.toBeInstanceOf(NotFoundError);
    expect(findById).toHaveBeenCalledWith(userB, accountId);
  });

  it("não cria transação quando a conta não pertence ao usuário", async () => {
    const accountRepository = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as IAccountRepository;
    const agreementRepository = {
      findById: vi.fn(),
    } as unknown as IAgreementRepository;
    const save = vi.fn();
    const transactionRepository = { save } as unknown as ITransactionRepository;
    const useCase = new CreateTransactionUseCase(
      transactionRepository,
      accountRepository,
      agreementRepository,
    );

    await expect(useCase.execute(userB, makeTransactionDto())).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(accountRepository.findById).toHaveBeenCalledWith(userB, accountId);
    expect(save).not.toHaveBeenCalled();
  });

  it("não cria transação quando o convênio não pertence ao usuário", async () => {
    const accountRepository = {
      findById: vi.fn().mockResolvedValue(makeAccount(userA)),
    } as unknown as IAccountRepository;
    const agreementRepository = {
      findById: vi.fn().mockResolvedValue(null),
    } as unknown as IAgreementRepository;
    const save = vi.fn();
    const transactionRepository = { save } as unknown as ITransactionRepository;
    const useCase = new CreateTransactionUseCase(
      transactionRepository,
      accountRepository,
      agreementRepository,
    );

    await expect(useCase.execute(userA, makeTransactionDto(agreementId))).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(agreementRepository.findById).toHaveBeenCalledWith(userA, agreementId);
    expect(save).not.toHaveBeenCalled();
  });
});
