// filepath: backend/src/presentation/routes/api.routes.ts
import { FastifyInstance } from 'fastify';
import { TransactionController } from '../controllers/TransactionController';
import { AccountController } from '../controllers/AccountController';
import { AgreementController } from '../controllers/AgreementController';
import { UserController } from '../controllers/UserController';


export async function registerRoutes(app: FastifyInstance) {
  const transactionController = new TransactionController();
  const accountController = new AccountController();
  const agreementController = new AgreementController();
  const userController = new UserController();
  // Transactions
  app.post('/api/transactions', transactionController.create.bind(transactionController));
  app.get('/api/transactions', transactionController.getAll.bind(transactionController));
  app.get('/api/transactions/:id', transactionController.getById.bind(transactionController));
  app.put('/api/transactions/:id', transactionController.update.bind(transactionController));
  app.delete('/api/transactions/:id', transactionController.delete.bind(transactionController));

  // Accounts
  app.post('/api/accounts', accountController.create.bind(accountController));
  app.get('/api/accounts', accountController.getAll.bind(accountController));
  app.get('/api/accounts/:id', accountController.getById.bind(accountController));
  app.put('/api/accounts/:id', accountController.update.bind(accountController));
  app.delete('/api/accounts/:id', accountController.delete.bind(accountController));

  // Agreements
  app.post('/api/agreements', agreementController.create.bind(agreementController));
  app.get('/api/agreements', agreementController.getAll.bind(agreementController));
  app.get('/api/agreements/:id', agreementController.getById.bind(agreementController));
  app.put('/api/agreements/:id', agreementController.update.bind(agreementController));
  app.delete('/api/agreements/:id', agreementController.delete.bind(agreementController));

  // Users
  app.post('/api/register', userController.register.bind(userController));
  app.post('/api/login', userController.login.bind(userController));

  // Health check
  app.get('/api/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });
}