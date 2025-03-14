import { Pool } from 'pg';

// The DATABASE_URL should be set in your .env.local file
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
