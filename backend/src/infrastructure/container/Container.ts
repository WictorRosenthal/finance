import "reflect-metadata";
import { container } from "tsyringe";

// Repositories
import { ITransactionRepository } from "../../domain/repositories/ITransactionRepository.js";
import { IAccountRepository } from "../../domain/repositories/IAccountRepository.js";
import { IAgreementRepository } from "../../domain/repositories/IAgreementRepository.js";
import { DrizzleTransactionRepository } from "../orm/repositories/DrizzleTransactionRepository.js";
import { DrizzleAccountRepository } from "../orm/repositories/DrizzleAccountRepository.js";
import { DrizzleAgreementRepository } from "../orm/repositories/DrizzleAgreementRepository.js";

// Use Cases - Transactions
import { CreateTransactionUseCase } from "../../application/use-cases/transactions/CreateTransactionUseCase.js";
import { GetTransactionsUseCase } from "../../application/use-cases/transactions/GetTransactionsUseCase.js";
import { GetTransactionByIdUseCase } from "../../application/use-cases/transactions/GetTransactionByIdUseCase.js";
import { UpdateTransactionUseCase } from "../../application/use-cases/transactions/UpdateTransactionUseCase.js";
import { DeleteTransactionUseCase } from "../../application/use-cases/transactions/DeleteTransactionUseCase.js";
import { MarkTransactionAsPaidUseCase } from "../../application/use-cases/transactions/MarkTransactionAsPaidUseCase.js";
// Use Cases - Accounts
import { CreateAccountUseCase } from "../../application/use-cases/accounts/CreateAccountUseCase.js";
import { GetAccountsUseCase } from "../../application/use-cases/accounts/GetAccountsUseCase.js";
import { GetAccountByIdUseCase } from "../../application/use-cases/accounts/GetAccountByIdUseCase.js";
import { UpdateAccountUseCase } from "../../application/use-cases/accounts/UpdateAccountUseCase.js";
import { DeleteAccountUseCase } from "../../application/use-cases/accounts/DeleteAccountUseCase.js";

// Use Cases - Agreements
import { CreateAgreementUseCase } from "../../application/use-cases/agreements/CreateAgreementUseCase.js";
import { GetAgreementsUseCase } from "../../application/use-cases/agreements/GetAgreementsUseCase.js";
import { GetAgreementByIdUseCase } from "../../application/use-cases/agreements/GetAgreementByIdUseCase.js";
import { UpdateAgreementUseCase } from "../../application/use-cases/agreements/UpdateAgreementUseCase.js";
import { DeleteAgreementUseCase } from "../../application/use-cases/agreements/DeleteAgreementUseCase.js";

// Oauth - Users
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { DrizzleUserRepository } from "../orm/repositories/DrizzleUserRepository";
import { LoginUseCase } from "../../application/use-cases/auth/LoginUseCase";
import { OAuthCallbackUseCase } from "../../application/use-cases/auth/OAuthCallbackUseCase";
import { JwtService } from "../auth/JwtService";
import { OAuthService } from "../auth/OAuthService";
import { RegisterUserUseCase } from "../../application/use-cases/auth/RegisterUserUseCase";

// ---------------------
// Repositories
// ---------------------
container.register<ITransactionRepository>("ITransactionRepository", {
  useClass: DrizzleTransactionRepository,
});

container.register<IAccountRepository>("IAccountRepository", {
  useClass: DrizzleAccountRepository,
});

container.register<IAgreementRepository>("IAgreementRepository", {
  useClass: DrizzleAgreementRepository,
});

container.register<IUserRepository>("IUserRepository", {
  useClass: DrizzleUserRepository,
});

// ---------------------
// Use Cases
// ---------------------
container.registerSingleton(CreateTransactionUseCase);
container.registerSingleton(GetTransactionsUseCase);
container.registerSingleton(GetTransactionByIdUseCase);
container.registerSingleton(UpdateTransactionUseCase);
container.registerSingleton(DeleteTransactionUseCase);
container.registerSingleton(MarkTransactionAsPaidUseCase);

container.registerSingleton(CreateAccountUseCase);
container.registerSingleton(GetAccountsUseCase);
container.registerSingleton(GetAccountByIdUseCase);
container.registerSingleton(UpdateAccountUseCase);
container.registerSingleton(DeleteAccountUseCase);

container.registerSingleton(CreateAgreementUseCase);
container.registerSingleton(GetAgreementsUseCase);
container.registerSingleton(GetAgreementByIdUseCase);
container.registerSingleton(UpdateAgreementUseCase);
container.registerSingleton(DeleteAgreementUseCase);

container.register<RegisterUserUseCase>("RegisterUserUseCase", {
  useFactory: (c) => new RegisterUserUseCase(c.resolve("IUserRepository")),
});
container.register<LoginUseCase>("LoginUseCase", {
  useFactory: (c) => new LoginUseCase(c.resolve("IUserRepository"), c.resolve("JwtService")),
});
container.register<OAuthCallbackUseCase>("OAuthCallbackUseCase", {
  useFactory: (c) =>
    new OAuthCallbackUseCase(
      c.resolve("IUserRepository"),
      c.resolve("JwtService"),
      c.resolve("OAuthService"),
    ),
});

// ---------------------
//services
// ---------------------

container.register<JwtService>("JwtService", {
  useClass: JwtService,
});
container.register<OAuthService>("OAuthService", {
  useClass: OAuthService,
});

export { container };
