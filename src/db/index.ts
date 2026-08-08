import { drizzle } from 'drizzle-orm/node-postgres';
import relations from './relations';
import { Pool } from 'pg';

const dbSingleton = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  return drizzle({ client: pool, relations });
};

declare global {
  var db: ReturnType<typeof dbSingleton> | undefined;
}

const db = global.db || dbSingleton();

export default db;
