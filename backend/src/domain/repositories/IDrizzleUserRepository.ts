
import { User } from '../entities/User';

export interface IDrizzleUserRepository {
  findByUsername(username: string): Promise<User | null>;
  create(username: string, password: string, role: string): Promise<User>;
  findById(id: number): Promise<User | null>;
}