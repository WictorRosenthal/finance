import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();
  app.post('/login', controller.login.bind(controller));
  app.post('/oauth/callback', controller.oauthCallback.bind(controller));
}