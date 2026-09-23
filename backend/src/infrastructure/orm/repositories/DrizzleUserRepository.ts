import { db } from "../../database/connection";
import { users } from "../schema";
import { eq, and } from "drizzle-orm";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

export class DrizzleUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const [userDb] = await db.select().from(users).where(eq(users.id, id));
    if (!userDb) return null;
    return this.mapToDomain(userDb);
  }

  async findByEmail(email: string): Promise<User | null> {
    const [userDb] = await db.select().from(users).where(eq(users.email, email));
    if (!userDb) return null;
    return this.mapToDomain(userDb);
  }

  async findByOAuth(provider: string, oauthId: string): Promise<User | null> {
    const [userDb] = await db
      .select()
      .from(users)
      .where(and(eq(users.oauthProvider, provider), eq(users.oauthId, oauthId)));
    if (!userDb) return null;
    return this.mapToDomain(userDb);
  }

  async save(user: User): Promise<User> {
    const [userDb] = await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        name: user.name,
        address: user.address,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        oauthProvider: user.oauthProvider,
        oauthId: user.oauthId,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email,
          passwordHash: user.passwordHash,
          name: user.name,
          address: user.address,
          phone: user.phone,
          avatarUrl: user.avatarUrl,
          oauthProvider: user.oauthProvider,
          oauthId: user.oauthId,
          role: user.role,
          updatedAt: user.updatedAt,
        },
      })
      .returning();
    return this.mapToDomain(userDb);
  }

  private mapToDomain(userDb: any): User {
    return new User({
      id: userDb.id,
      email: userDb.email,
      passwordHash: userDb.passwordHash,
      name: userDb.name,
      address: userDb.address,
      phone: userDb.phone,
      avatarUrl: userDb.avatarUrl,
      oauthProvider: userDb.oauthProvider,
      oauthId: userDb.oauthId,
      role: userDb.role,
      createdAt: userDb.createdAt,
      updatedAt: userDb.updatedAt,
    });
  }
}
