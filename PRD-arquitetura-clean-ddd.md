# PRD - Flow Guardião: Arquitetura Limpa + DDD + DI

## 1. Visão Geral do Projeto

### 1.1 Contexto Atual
O **Flow Guardião** é um sistema de gestão financeira pessoal/desk que utiliza:
- **Frontend**: TanStack Start (React Router), Radix UI, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **Build**: Vite + Bun

### 1.2 Problema
O projeto atual não possui uma arquitetura escalável no backend. A lógica de negócio está misturada com a camada de apresentação e acesso a dados, dificultando:
- Testes unitários
- Manutenção
- Evolução do sistema
- Troca de tecnologias (ex: migrar do Supabase para outro banco)

### 1.3 Objetivo
Implementar uma **arquitetura limpa no backend Node.js** com:
- **Clean Architecture** (Camadas: Domain, Application, Infrastructure, Presentation)
- **DDD** (Domain-Driven Design) com entidades, value objects, aggregates, repositories
- **DI/IOC** (Injeção de Dependências / Inversão de Controle)
- **ORM** para abstração do banco de dados

---

## 2. Arquitetura Proposta

### 2.1 Visão de Camadas (Clean Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│         (API REST / Controllers / Routes)                   │
├─────────────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                         │
│        (Use Cases / Services / DTOs / Mappers)              │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                           │
│   (Entities / Value Objects / Aggregates / Repositories    │
│    Interfaces / Domain Services / Events)                   │
├─────────────────────────────────────────────────────────────┤
│                   INFRASTRUCTURE LAYER                      │
│    (ORM Implementation / External Services / DB Config)    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Estrutura de Diretórios

```
src/
├── domain/                    # Camada de Domínio (independente)
│   ├── entities/              # Entidades do negócio
│   │   ├── Transaction.ts
│   │   ├── Account.ts
│   │   └── Agreement.ts
│   ├── value-objects/         # Value Objects imutáveis
│   │   ├── Money.ts
│   │   └── TransactionType.ts
│   ├── aggregates/            # Aggregates (raiz de agregação)
│   │   └── TransactionAggregate.ts
│   ├── repositories/          # Interfaces de repositórios
│   │   ├── ITransactionRepository.ts
│   │   ├── IAccountRepository.ts
│   │   └── IAgreementRepository.ts
│   ├── services/              # Domain Services
│   │   └── TransactionDomainService.ts
│   └── events/                # Domain Events
│       └── TransactionCreatedEvent.ts
│
├── application/               # Camada de Aplicação
│   ├── use-cases/             # Casos de uso
│   │   ├── transactions/
│   │   │   ├── CreateTransactionUseCase.ts
│   │   │   ├── UpdateTransactionUseCase.ts
│   │   │   ├── DeleteTransactionUseCase.ts
│   │   │   └── GetTransactionsUseCase.ts
│   │   ├── accounts/
│   │   │   └── ManageAccountUseCase.ts
│   │   └── agreements/
│   │       └── ManageAgreementUseCase.ts
│   ├── dto/                   # Data Transfer Objects
│   │   ├── TransactionDTO.ts
│   │   └── CreateTransactionDTO.ts
│   ├── mappers/               # Mappers entre entidades e DTOs
│   │   └── TransactionMapper.ts
│   └── ports/                 # Portas de entrada/saída
│       └── INotificationService.ts
│
├── infrastructure/            # Camada de Infraestrutura
│   ├── orm/                   # Implementação do ORM
│   │   ├── PrismaORM.ts       # ou DrizzleORM
│   │   ├── repositories/
│   │   │   ├── PrismaTransactionRepository.ts
│   │   │   ├── PrismaAccountRepository.ts
│   │   │   └── PrismaAgreementRepository.ts
│   │   └── migrations/        # Migrações do banco
│   ├── database/              # Configuração do banco
│   │   └── connection.ts
│   ├── external/              # Serviços externos
│   │   └── SupabaseService.ts
│   └── container/             # Container de DI
│       └── Container.ts
│
├── presentation/              # Camada de Apresentação
│   ├── controllers/           # Controllers REST
│   │   ├── TransactionController.ts
│   │   ├── AccountController.ts
│   │   └── AgreementController.ts
│   ├── routes/                # Definição de rotas
│   │   └── api.routes.ts
│   ├── middleware/            # Middlewares
│   │   ├── auth.middleware.ts
│   │   └── validation.middleware.ts
│   └── responses/             # Respostas padronizadas
│       └── ApiResponse.ts
│
├── shared/                    # Código compartilhado
│   ├── errors/                # Erros customizados
│   │   ├── AppError.ts
│   │   ├── NotFoundError.ts
│   │   └── ValidationError.ts
│   ├── types/                 # Tipos globais
│   └── utils/                 # Utilitários
│
└── main.ts                    # Entry point da aplicação
```

### 2.3 Stack Tecnológico do Backend

| Componente | Tecnologia | Justificativa |
|------------|------------|---------------|
| **Runtime** | Node.js 20+ | LTS, ecossistema maduro |
| **Framework** | Fastify | Performático, baixo overhead |
| **ORM** | Drizzle ORM | Leve, type-safe, compatível com Supabase |
| **DI** | tsyringe ou inversify | Inversão de controle madura |
| **Validação** | Zod | Schema validation, integração com Fastify |
| **Documentação** | Swagger/OpenAPI | Documentação automática |
| **Testes** | Vitest + Jest | Cobertura de testes unitários |

---

## 3. Domain-Driven Design (DDD)

### 3.1 Entidades Principais

#### Transaction (Transação)
```typescript
// domain/entities/Transaction.ts
interface Transaction {
  id: string;
  description: string;
  amount: Money;           // Value Object
  type: TransactionType;   // Value Object (INCOME/EXPENSE)
  category: string;
  accountId: string;
  agreementId?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Account (Conta)
```typescript
// domain/entities/Account.ts
interface Account {
  id: string;
  name: string;
  type: AccountType;       // Value Object (CHECKING/SAVINGS/CREDIT)
  balance: Money;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Agreement (Convênio)
```typescript
// domain/entities/Agreement.ts
interface Agreement {
  id: string;
  name: string;
  category: string;
  monthlyFee?: Money;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Value Objects

```typescript
// domain/value-objects/Money.ts
class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'BRL'
  ) {
    if (amount < 0) throw new Error('Amount cannot be negative');
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount - other.amount, this.currency);
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Currency mismatch');
    }
  }
}

// domain/value-objects/TransactionType.ts
enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}
```

### 3.3 Aggregates

```typescript
// domain/aggregates/TransactionAggregate.ts
class TransactionAggregate {
  private transaction: Transaction;
  
  constructor(transaction: Transaction) {
    this.transaction = transaction;
  }

  // Regra de negócio: validar transação antes de criar
  static create(props: CreateTransactionProps): TransactionAggregate {
    // Validações de domínio
    if (!props.description || props.description.trim() === '') {
      throw new ValidationError('Description is required');
    }
    if (props.amount <= 0) {
      throw new ValidationError('Amount must be positive');
    }

    const transaction = new Transaction({
      id: generateUUID(),
      ...props,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return new TransactionAggregate(transaction);
  }

  // Método de domínio
  applyDiscount(discount: Money): void {
    if (this.transaction.type === TransactionType.INCOME) {
      throw new BusinessRuleError('Cannot apply discount to income');
    }
    this.transaction.amount = this.transaction.amount.subtract(discount);
  }
}
```

### 3.4 Repositories (Interfaces)

```typescript
// domain/repositories/ITransactionRepository.ts
interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findAll(filters?: TransactionFilters): Promise<Transaction[]>;
  findByAccountId(accountId: string): Promise<Transaction[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Transaction[]>;
  save(transaction: Transaction): Promise<Transaction>;
  delete(id: string): Promise<void>;
}
```

---

## 4. Injeção de Dependências (DI)

### 4.1 Container de DI

```typescript
// infrastructure/container/Container.ts
import { Container } from 'tsyringe';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { IAccountRepository } from '../../domain/repositories/IAccountRepository';
import { CreateTransactionUseCase } from '../../application/use-cases/transactions/CreateTransactionUseCase';
import { PrismaTransactionRepository } from '../orm/repositories/PrismaTransactionRepository';
import { PrismaAccountRepository } from '../orm/repositories/PrismaAccountRepository';

const container = new Container();

// Repositories
container.register<ITransactionRepository>('ITransactionRepository', {
  useClass: PrismaTransactionRepository
});

container.register<IAccountRepository>('IAccountRepository', {
  useClass: PrismaAccountRepository
});

// Use Cases
container.register<CreateTransactionUseCase>('CreateTransactionUseCase', {
  useFactory: (container) => {
    const transactionRepo = container.resolve<ITransactionRepository>('ITransactionRepository');
    return new CreateTransactionUseCase(transactionRepo);
  }
});

export { container };
```

### 4.2 Uso nos Controllers

```typescript
// presentation/controllers/TransactionController.ts
import { container } from '../../infrastructure/container/CreateTransactionUseCase';

class TransactionController {
  async create(request: FastifyRequest) {
    const createTransactionUseCase = container.resolve('CreateTransactionUseCase');
    const result = await createTransactionUseCase.execute(request.body);
    return result;
  }
}
```

---

## 5. ORM - Drizzle

### 5.1 Configuração

```typescript
// infrastructure/orm/schema.ts
import { pgTable, uuid, varchar, numeric, timestamp, boolean } from 'drizzle-orm/pg-core';

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  accountId: uuid('account_id').notNull(),
  agreementId: uuid('agreement_id'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  balance: numeric('balance', { precision: 10, scale: 2 }).notNull(),
  color: varchar('color', { length: 7 }),
  icon: varchar('icon', { length: 50 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
```

### 5.2 Repository Implementation

```typescript
// infrastructure/orm/repositories/PrismaTransactionRepository.ts
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../../domain/entities/Transaction';
import { db } from '../database/connection';
import { transactions } from '../schema';

export class PrismaTransactionRepository implements ITransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id));
    return result[0] ? this.mapToEntity(result[0]) : null;
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const data = this.mapToDb(transaction);
    const [saved] = await db.insert(transactions).values(data).returning();
    return this.mapToEntity(saved);
  }

  private mapToEntity(dbRecord: any): Transaction {
    return new Transaction({
      id: dbRecord.id,
      amount: new Money(Number(dbRecord.amount), 'BRL'),
      // ... outros campos
    });
  }

  private mapToDb(transaction: Transaction): any {
    return {
      id: transaction.id,
      amount: transaction.amount.amount.toString(),
      // ... outros campos
    };
  }
}
```

---

## 6. Casos de Uso (Use Cases)

### 6.1 CreateTransactionUseCase

```typescript
// application/use-cases/transactions/CreateTransactionUseCase.ts
import { ITransactionRepository } from '../../../domain/repositories/ITransactionRepository';
import { TransactionAggregate } from '../../../domain/aggregates/TransactionAggregate';
import { CreateTransactionDTO } from '../../dto/CreateTransactionDTO';
import { TransactionDTO } from '../../dto/TransactionDTO';

export class CreateTransactionUseCase {
  constructor(private readonly transactionRepository: ITransactionRepository) {}

  async execute(dto: CreateTransactionDTO): Promise<TransactionDTO> {
    // 1. Criar aggregate (valida regras de domínio)
    const aggregate = TransactionAggregate.create({
      description: dto.description,
      amount: dto.amount,
      type: dto.type,
      category: dto.category,
      accountId: dto.accountId,
      agreementId: dto.agreementId,
      date: new Date(dto.date)
    });

    // 2. Persistir via repository
    const savedTransaction = await this.transactionRepository.save(aggregate.getTransaction());

    // 3. Mapear para DTO de resposta
    return TransactionMapper.toDTO(savedTransaction);
  }
}
```

---

## 7. API REST

### 7.1 Rotas

| Método | Endpoint | Use Case |
|--------|----------|----------|
| GET | `/api/transactions` | GetTransactionsUseCase |
| GET | `/api/transactions/:id` | GetTransactionByIdUseCase |
| POST | `/api/transactions` | CreateTransactionUseCase |
| PUT | `/api/transactions/:id` | UpdateTransactionUseCase |
| DELETE | `/api/transactions/:id` | DeleteTransactionUseCase |
| GET | `/api/accounts` | GetAccountsUseCase |
| POST | `/api/accounts` | CreateAccountUseCase |
| GET | `/api/agreements` | GetAgreementsUseCase |

### 7.2 Controller

```typescript
// presentation/controllers/TransactionController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../infrastructure/container/Container';

export class TransactionController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const useCase = container.resolve('CreateTransactionUseCase');
      const result = await useCase.execute(request.body);
      return reply.status(201).send(result);
    } catch (error) {
      return reply.status(400).send({ error: error.message });
    }
  }

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const useCase = container.resolve('GetTransactionsUseCase');
    const result = await useCase.execute(request.query);
    return reply.send(result);
  }
}
```

---

## 8. Plano de Implementação

### Fase 1: Setup do Backend
- [ ] Criar projeto Node.js com TypeScript
- [ ] Configurar Fastify
- [ ] Configurar Drizzle ORM
- [ ] Configurar tsyringe (DI)
- [ ] Configurar Zod para validação

### Fase 2: Domain Layer
- [ ] Criar Value Objects (Money, TransactionType, AccountType)
- [ ] Criar Entities (Transaction, Account, Agreement)
- [ ] Criar Repository Interfaces
- [ ] Criar Domain Services

### Fase 3: Application Layer
- [ ] Implementar Use Cases
- [ ] Criar DTOs
- [ ] Criar Mappers

### Fase 4: Infrastructure Layer
- [ ] Implementar Repositories com Drizzle
- [ ] Configurar Container DI
- [ ] Criar migrations do banco

### Fase 5: Presentation Layer
- [ ] Criar Controllers
- [ ] Definir rotas API
- [ ] Adicionar middleware de autenticação

### Fase 6: Integração
- [ ] Conectar frontend com nova API
- [ ] Migrar chamadas do Supabase para API interna

---

## 9. Benefícios Esperados

| Benefício | Descrição |
|-----------|-----------|
| **Testabilidade** | Cada camada pode ser testada isoladamente com mocks |
| **Manutenibilidade** | Mudanças de banco/framework não afetam lógica de negócio |
| **Escalabilidade** | Novas funcionalidades seguem padrão estabelecido |
| **Clareza** | Responsabilidades bem definidas em cada camada |
| **DI** | Baixo acoplamento, fácil substituição de implementações |

---

## 10. Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Curva de aprendizado da equipe | Documentação + Code Review + Pair Programming |
| Overhead inicial de desenvolvimento | ROI a longo prazo justifica investimento |
| Complexidade do DDD | Começar com domínio simples, evoluir gradualmente |
| Performance do ORM | Benchmarking com Drizzle (otimizado para performance) |

---

## 11. Referências

- **Clean Architecture**: Robert C. Martin
- **Domain-Driven Design**: Eric Evans
- **Inversion of Control**: Martin Fowler
- **Drizzle ORM**: https://orm.drizzle.team
- **Fastify**: https://fastify.dev
- **tSyriNG**: https://github.com/microsoft/tsyringe