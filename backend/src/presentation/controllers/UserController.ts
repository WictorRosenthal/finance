import { Request, Response } from 'express';
import { UserService } from '../../services/UserService';

const service = new UserService();

export class UserController {
  static async register(req: Request, res: Response) {
    try {
      const { username, password, role } = req.body;
      const user = await service.register(username, password, role);
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await service.login(username, password);
      res.status(200).json(result);
    } catch (err) {
      res.status(401).json({ error: (err as Error).message });
    }
  }
}
