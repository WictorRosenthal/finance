import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../infrastructure/container/Container';

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;
    const useCase = container.resolve('LoginUseCase');
    const token = await useCase.execute(email, password);
    return reply.send({ token });
  }

  async oauthCallback(request: FastifyRequest, reply: FastifyReply) {
    const { provider, token } = request.body as any;
    const useCase = container.resolve('OAuthCallbackUseCase');
    const jwt = await useCase.execute(provider, token);
    return reply.send({ token: jwt });
  }
}