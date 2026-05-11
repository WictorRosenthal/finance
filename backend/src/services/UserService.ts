import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DrizzleUserRepository } from '../infrastructure/orm/repositories/DrizzleUserRepository';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export class UserService {
  private repo = new DrizzleUserRepository();

  async register(username: string, password: string, role = 'read-only') {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.repo.create(username, hashedPassword, role);
    return { id: user.id, username: user.username, role: user.role };
  }

  async login(username: string, password: string) {
    const user = await this.repo.findByUsername(username);
    if (!user) throw new Error('User not found');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    return { token, user: { id: user.id, username: user.username, role: user.role } };
  }

  verifyToken(token: string) {
    return jwt.verify(token, JWT_SECRET);
  }
}