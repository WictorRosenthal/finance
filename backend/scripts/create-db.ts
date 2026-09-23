// filepath: backend/scripts/create-db.ts
import postgres from "postgres";

const adminConn = postgres("postgresql://postgres:1234@localhost:5432/postgres", {
  max: 1,
});

async function createDatabase() {
  try {
    // Check if database exists
    const result = await adminConn`SELECT 1 FROM pg_database WHERE datname = 'guardiao'`;

    if (result.length === 0) {
      await adminConn`CREATE DATABASE guardiao`;
      console.log('Database "guardiao" created successfully!');
    } else {
      console.log('Database "guardiao" already exists');
    }
  } catch (error: any) {
    if (error.code === "42P04") {
      console.log('Database "guardiao" already exists');
    } else {
      console.error("Error creating database:", error.message);
      process.exit(1);
    }
  } finally {
    await adminConn.end();
  }
}

createDatabase();
