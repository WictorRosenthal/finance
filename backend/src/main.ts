// filepath: backend/src/main.ts
import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './presentation/routes/api.routes';
import { errorHandler } from './presentation/middleware/errorHandler';
import express from 'express';
import userRoutes from './presentation/routes/userRoutes';

const app = express();
app.use(express.json());
app.use(userRoutes);

const PORT = parseInt(process.env.PORT || '3001');
const HOST = process.env.HOST || '0.0.0.0';

async function bootstrap() {
  const app = Fastify({
    logger: true
  });

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