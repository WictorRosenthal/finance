import { FastifyRequest, FastifyReply } from 'fastify';
import { container } from '../../infrastructure/container/Container';

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = request.body as any;
    const useCase = container.resolve('LoginUseCase') as { execute: (email: string, password: string) => Promise<string> };
    const token = await useCase.execute(email, password);
    return reply.send({ token });
  }

  async oauthCallback(request: FastifyRequest, reply: FastifyReply) {
    const { provider, token } = request.body as any;
    const useCase = container.resolve('OAuthCallbackUseCase') as { execute: (provider: string, token: string) => Promise<string> };
    const jwt = await useCase.execute(provider, token);
    return reply.send({ token: jwt });
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    const { email, password, name } = request.body as any;
    const useCase = container.resolve('RegisterUserUseCase') as { execute: (email: string, password: string, name: string) => Promise<void> };
    await useCase.execute(email, password, name);
    return reply.status(201).send({ message: 'User registered' });
  }
}