// filepath: backend/src/main.ts
import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './presentation/routes/api.routes';
import { errorHandler } from './presentation/middleware/errorHandler';
import { userRoutes } from './presentation/routes/user.routes';

const PORT = parseInt(process.env.port || '3001');
const HOST = process.env.host || '0.0.0.0';

async function bootstrap() {
  const app = Fastify({
    logger: true
  });
  // Register user routes
  await app.register(userRoutes, { prefix: '/api' });
  // Register CORS
  await app.register(cors, {
    origin: true,
    credentials: true
  });

  // Register error handler
  app.setErrorHandler(errorHandler);

  // Register routes
  await registerRoutes(app);

  // Start server
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();