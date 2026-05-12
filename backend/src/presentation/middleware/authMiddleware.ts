import { FastifyRequest, FastifyReply } from 'fastify';
import { JwtService } from '../../infrastructure/auth/JwtService';

export async function authenticateJWT(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;
  if (!authHeader) return reply.status(401).send({ error: 'No token' });
  const token = authHeader.split(' ')[1];
  try {
    const jwtService = new JwtService();
    request.user = jwtService.verifyToken(token);
  } catch {
    return reply.status(403).send({ error: 'Invalid token' });
  }
}