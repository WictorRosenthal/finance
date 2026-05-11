// filepath: backend/src/infrastructure/orm/schema.ts
import { pgTable, uuid, varchar, numeric, timestamp, boolean, serial, text} from 'drizzle-orm/pg-core';


export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey(),
  description: varchar('description', { length: 255 }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  accountId: uuid('account_id').notNull(),
  agreementId: uuid('agreement_id'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  balance: numeric('balance', { precision: 10, scale: 2 }).notNull(),
  color: varchar('color', { length: 7 }).notNull(),
  icon: varchar('icon', { length: 50 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const agreements = pgTable('agreements', {
  id: uuid('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  monthlyFee: numeric('monthly_fee', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  role: text('role').notNull(), // 'admin' | 'read-only'
});

export type TransactionDb = typeof transactions.$inferSelect;
export type AccountDb = typeof accounts.$inferSelect;
export type AgreementDb = typeof agreements.$inferSelect;
export type UserDb = typeof users.$inferSelect;