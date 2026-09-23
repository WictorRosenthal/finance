// filepath: backend/src/application/use-cases/transactions/CreateTransactionUseCase.ts
import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../../../domain/repositories/ITransactionRepository";
import { IAccountRepository } from "../../../domain/repositories/IAccountRepository";
import { IAgreementRepository } from "../../../domain/repositories/IAgreementRepository";
import { TransactionAggregate } from "../../../domain/aggregates/TransactionAggregate";
import { TransactionMapper } from "../../mappers/TransactionMapper";
import { CreateTransactionDTO, TransactionDTO } from "../../dto/TransactionDTO";
import { NotFoundError } from "../../../shared/errors";

@injectable()
export class CreateTransactionUseCase {
  constructor(
    @inject("ITransactionRepository")
    private readonly transactionRepository: ITransactionRepository,
    @inject("IAccountRepository")
    private readonly accountRepository: IAccountRepository,
    @inject("IAgreementRepository")
    private readonly agreementRepository: IAgreementRepository,
  ) {}

  async execute(userId: string, dto: CreateTransactionDTO): Promise<TransactionDTO> {
    if (!(await this.accountRepository.findById(userId, dto.accountId))) {
      throw new NotFoundError("Account", dto.accountId);
    }
    if (dto.agreementId && !(await this.agreementRepository.findById(userId, dto.agreementId))) {
      throw new NotFoundError("Agreement", dto.agreementId);
    }

    // Converter DTO para props do domínio
    const props = { ...TransactionMapper.toCreateProps(dto), userId };

    // Criar aggregate (valida regras de domínio)
    const aggregate = TransactionAggregate.create(props);

    // Persistir via repository
    const savedTransaction = await this.transactionRepository.save(aggregate.getTransaction());

    // Mapear para DTO de resposta
    return TransactionMapper.toDTO(savedTransaction);
  }
}
