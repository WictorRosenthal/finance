import { FastifyRequest, FastifyReply } from "fastify";
import { container } from "../../infrastructure/container/Container";

export class AuthController {
  async login(request: FastifyRequest, reply: FastifyReply) {
    const { email, password } = (request.body ?? {}) as {
      email?: string;
      password?: string;
    };
    if (!email?.trim() || !password) {
      return reply.status(400).send({ error: "Email e senha são obrigatórios" });
    }

    const useCase = container.resolve("LoginUseCase") as {
      execute: (email: string, password: string) => Promise<string>;
    };
    const token = await useCase.execute(email, password);
    return reply.send({ token });
  }

  async oauthCallback(request: FastifyRequest, reply: FastifyReply) {
    const { provider, token } = request.body as any;
    const useCase = container.resolve("OAuthCallbackUseCase") as {
      execute: (provider: string, token: string) => Promise<string>;
    };
    const jwt = await useCase.execute(provider, token);
    return reply.send({ token: jwt });
  }

  async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      // Fastify pode não fazer o parse automático do body para JSON se não configurado
      const { email, password, name } = request.body as {
        email?: string;
        password?: string;
        name?: string;
      };

      if (!email || !password || !name) {
        return reply.status(400).send({ error: "Campos obrigatórios ausentes." });
      }

      const useCase = container.resolve("RegisterUserUseCase") as {
        execute: (params: {
          email: string;
          password: string;
          name: string;
        }) => Promise<{ id: string; email: string; name: string }>;
      };
      const user = await useCase.execute({ email, password, name });
      return reply.status(201).send({ id: user.id, email: user.email, name: user.name });
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }
}
