import { db } from '../../database/connection';
import { users } from '../schema';
import { eq } from 'drizzle-orm';
import { UserDb } from '../schema';
 

export class DrizzleUserRepository {
  async findByUsername(username: string): Promise<UserDb | null> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user ?? null;
  }

  async create(username: string, password: string, role: string): Promise<UserDb> {
    const [user] = await db.insert(users).values({ username, password, role }).returning();
    return user;
  }

  async findById(id: number): Promise<UserDb | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  }
}