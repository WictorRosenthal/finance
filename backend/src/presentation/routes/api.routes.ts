import { FastifyInstance } from "fastify";
import { TransactionController } from "../controllers/TransactionController";
import { AccountController } from "../controllers/AccountController";
import { AgreementController } from "../controllers/AgreementController";
import { AuthController } from "@presentation/controllers/AuthController";
import { ProfileController } from "../controllers/ProfileController";
import { authenticateJWT } from "../middleware/authMiddleware";

export async function registerRoutes(app: FastifyInstance) {
  const transactionController = new TransactionController();
  const accountController = new AccountController();
  const agreementController = new AgreementController();
  const authController = new AuthController();
  const profileController = new ProfileController();
  const protectedRoute = { preHandler: authenticateJWT };

  app.post("/api/register", authController.register.bind(authController));
  app.post("/api/login", authController.login.bind(authController));
  app.post("/api/oauth/callback", authController.oauthCallback.bind(authController));
  app.get("/api/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });
  app.get("/api/user", protectedRoute, profileController.get.bind(profileController));
  app.put("/api/user", protectedRoute, profileController.update.bind(profileController));

  // Transactions
  app.post("/api/transactions", protectedRoute, transactionController.create.bind(transactionController));
  app.get("/api/transactions", protectedRoute, transactionController.getAll.bind(transactionController));
  app.get("/api/transactions/:id", protectedRoute, transactionController.getById.bind(transactionController));
  app.put("/api/transactions/:id", protectedRoute, transactionController.update.bind(transactionController));
  app.delete("/api/transactions/:id", protectedRoute, transactionController.delete.bind(transactionController));
  app.patch(
    "/api/transactions/:id/pay",
    protectedRoute,
    transactionController.markAsPaid.bind(transactionController),
  );

  // Accounts
  app.post("/api/accounts", protectedRoute, accountController.create.bind(accountController));
  app.get("/api/accounts", protectedRoute, accountController.getAll.bind(accountController));
  app.get("/api/accounts/:id", protectedRoute, accountController.getById.bind(accountController));
  app.put("/api/accounts/:id", protectedRoute, accountController.update.bind(accountController));
  app.delete("/api/accounts/:id", protectedRoute, accountController.delete.bind(accountController));

  // Agreements
  app.post("/api/agreements", protectedRoute, agreementController.create.bind(agreementController));
  app.get("/api/agreements", protectedRoute, agreementController.getAll.bind(agreementController));
  app.get("/api/agreements/:id", protectedRoute, agreementController.getById.bind(agreementController));
  app.put("/api/agreements/:id", protectedRoute, agreementController.update.bind(agreementController));
  app.delete("/api/agreements/:id", protectedRoute, agreementController.delete.bind(agreementController));
}
