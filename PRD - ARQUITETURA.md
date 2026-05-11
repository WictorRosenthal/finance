PRD – Finance Control Platform

1. Overview

Objective:
Build a financial control system with:
- JWT-based authentication (separate API)
- Backend with PostgreSQL (Drizzle)
- Frontend consuming APIs via HTTP

Architecture:
Frontend (React)
   ↓ HTTP
Auth API (JWT)
   ↓ validation
Backend API (Drizzle)
   ↓
PostgreSQL

2. Problem

Direct database access from frontend leads to:
- Security risks
- Poor scalability
- Tight coupling

Solution:
Decouple authentication, business logic, and persistence.

3. Components

Frontend:
- React
- Consumes API via fetch

Auth API:
- Login/register
- JWT generation and validation

Backend API:
- Accounts
- Transactions
- Uses Drizzle ORM

Database:
- PostgreSQL

4. Authentication Flow

Login:
Frontend → Auth API → returns JWT → stored locally

Data Access:
Frontend → Backend API (Bearer token)
Backend → validates JWT → returns data

5. Security

- JWT with user id and role
- bcrypt for passwords
- Middleware validation
- No direct DB access from frontend

6. Features

Auth:
- Register
- Login
- Token generation
- Token validation

Accounts:
- Create
- List
- Update
- Delete

Transactions:
- Create
- List

7. APIs

Auth API:
POST /login
POST /register

Backend API:
GET /api/accounts
POST /api/accounts
PUT /api/accounts/:id
DELETE /api/accounts/:id

8. Database

Users:
id, username, password, role

Accounts:
id, user_id, name, type, bank, balance

Transactions:
id, account_id, user_id, amount

9. Technologies

Backend:
- Node.js
- Express
- Drizzle
- PostgreSQL

Auth API:
- JWT
- bcryptjs

Frontend:
- React

10. Non-functional Requirements

- Scalability
- Security
- Maintainability
- Performance

11. Roadmap

Phase 1:
- Auth API
- Backend API
- Integration

Phase 2:
- Refresh token
- Role management

Phase 3:
- OAuth
- Multi-tenant

12. Risks

- Token compromise → expiration + refresh
- RLS errors → correct policies

13. Success Criteria

- Users can login
- JWT is validated
- Backend access is secured
- Data persisted in PostgreSQL

Summary:
Auth handles identity, backend handles data, frontend consumes APIs.
