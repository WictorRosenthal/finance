import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '../../infrastructure/auth/JwtService';

export type AuthenticatedUser = {
  userId: string;
  role?: string;
};

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthenticatedUser;
  }
}

export async function authenticateJWT(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader) return reply.status(401).send({ error: 'No token' });
  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return reply.status(401).send({ error: 'Invalid authorization header' });
  }

  try {
    const jwtService = new JwtService();
    const payload = jwtService.verifyToken(token) as AuthenticatedUser;
    if (!payload.userId) {
      return reply.status(403).send({ error: 'Invalid token payload' });
    }
    request.user = payload;
  } catch {
    return reply.status(403).send({ error: 'Invalid token' });
  }
}

export function getAuthenticatedUserId(request: FastifyRequest): string {
  if (!request.user?.userId) {
    throw new Error('Authenticated user is required');
  }
  return request.user.userId;
}