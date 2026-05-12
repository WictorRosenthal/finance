# PRD - Implementação de Autenticação (JWT e OAuth)

## 1. Visão Geral

### 1.1 Objetivo
Adicionar autenticação robusta ao backend do Flow Guardião, utilizando JWT para autenticação tradicional (email/senha) e OAuth para login social (ex: Google), seguindo Clean Architecture + DDD + DI.

### 1.2 Justificativa
- Proteger rotas e dados sensíveis.
- Permitir login via provedores externos (Google, GitHub, etc).
- Garantir escalabilidade e testabilidade da autenticação.

---

## 2. Requisitos

### 2.1 Funcionais
- Usuário pode registrar e autenticar via email/senha.
- Usuário pode autenticar via OAuth (Google, etc).
- Rotas protegidas exigem token JWT válido.
- Logout (invalidação do token no frontend).

### 2.2 Não Funcionais
- Código desacoplado por camadas (Domain, Application, Infrastructure, Presentation).
- Uso de DI/IoC para injeção de dependências.
- Testes unitários para casos de uso de autenticação.

---

## 3. Arquitetura

### 3.1 Camadas Envolvidas

- **Domain:** Entidade User, interface IUserRepository.
- **Application:** Use cases (Login, Register, OAuthCallback), DTOs.
- **Infrastructure:** Implementação do repositório, serviços JWT/OAuth.
- **Presentation:** Controllers, rotas, middlewares de autenticação.

### 3.2 Estrutura de Diretórios

```
src/
├── domain/
│   ├── entities/User.ts
│   └── repositories/IUserRepository.ts
├── application/
│   ├── use-cases/auth/LoginUseCase.ts
│   ├── use-cases/auth/RegisterUseCase.ts
│   ├── use-cases/auth/OAuthCallbackUseCase.ts
│   └── dto/LoginDTO.ts
├── infrastructure/
│   ├── auth/JwtService.ts
│   ├── auth/OAuthService.ts
│   └── orm/repositories/DrizzleUserRepository.ts
├── presentation/
│   ├── controllers/AuthController.ts
│   ├── routes/auth.routes.ts
│   └── middleware/auth.middleware.ts
└── infrastructure/container/Container.ts
```

---

## 4. Fluxos

### 4.1 Registro/Autenticação Tradicional
1. Usuário envia email/senha para `/login`.
2. Controller chama LoginUseCase.
3. LoginUseCase valida usuário e senha via IUserRepository.
4. Gera JWT via JwtService.
5. Retorna token ao usuário.

### 4.2 Autenticação OAuth
1. Usuário inicia login social (ex: Google).
2. Frontend recebe token OAuth e envia para `/oauth/callback`.
3. Controller chama OAuthCallbackUseCase.
4. OAuthService valida token e extrai dados do usuário.
5. Busca/cria usuário no banco.
6. Gera JWT e retorna ao usuário.

### 4.3 Rotas Protegidas
- Middleware `auth.middleware.ts` valida JWT em cada requisição.

---

## 5. Critérios de Aceite

- [ ] Usuário pode registrar e logar via email/senha.
- [ ] Usuário pode logar via OAuth.
- [ ] Rotas protegidas só acessíveis com JWT válido.
- [ ] Código segue Clean Architecture + DDD + DI.
- [ ] Testes unitários para casos de uso de autenticação.

---

## 6. Observações Técnicas

- JWT assinado com segredo seguro (`process.env.JWT_SECRET`).
- OAuth inicialmente com Google (extensível para outros).
- Injeção de dependências via tsyringe.
- Tipagem reforçada no TypeScript.
