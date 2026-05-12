import 'reflect-metadata';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { registerRoutes } from './presentation/routes/api.routes';
import { errorHandler } from './presentation/middleware/errorHandler';

const PORT = parseInt(process.env.port || '3001');
const HOST = process.env.host || '0.0.0.0';

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

  // Register all routes (including authentication)
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