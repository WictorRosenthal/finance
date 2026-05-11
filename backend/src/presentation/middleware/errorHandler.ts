// filepath: backend/src/presentation/middleware/errorHandler.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { AppError } from '../../shared/errors/AppError';

export function errorHandler(error: Error, request: FastifyRequest, reply: FastifyReply) {
  console.error('Error:', error);
   const err = error as any;

  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
      code: error.code
    });
  }

  // Erros de validação do Fastify/Zod
  if (err.validation) {
    return reply.status(400).send({
      error: 'ValidationError',
      message: 'Invalid request data',
      details: err.validation
    });
  }

  // Erro genérico
  return reply.status(500).send({
    error: 'InternalServerError',
    message: 'An unexpected error occurred'
  });
}