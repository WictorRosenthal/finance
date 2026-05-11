
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '../orm/schema';

// ==============================
// Environment
// ==============================
const CONNECTION_STRING =
  process.env.DATABASE_URL ??
  'postgresql://postgres:1234@localhost:5432/postgres';

if (!CONNECTION_STRING) {
  throw new Error('DATABASE_URL is not defined');
}

// ==============================
// Postgres Client
// ==============================
const client = postgres(CONNECTION_STRING, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
});

// ==============================
// Drizzle Client
// ==============================
export const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV !== 'production'
});

// ==============================
// Health check (opcional)
// ==============================
export async function testConnection(): Promise<void> {
  await client`select 1`;
  console.log('Database connected');
}

// ==============================
// Graceful shutdown
// ==============================
export async function closeConnection(): Promise<void> {
  await client.end();
  console.log('Database connection closed');
}

process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});
