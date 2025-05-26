import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const shared: Partial<Knex.Config> = {
  client: 'pg',
  migrations: {
    tableName: 'knex_migrations',
    directory: './src/db/migrations',
    extension: 'ts'
  },
  pool: { min: 2, max: 10 },
  useNullAsDefault: true
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...shared,
    connection: process.env.SUPABASE_DB_URL!
  },
  production: {
    ...shared,
    connection: {
      connectionString: process.env.SUPABASE_DB_URL!,
      ssl: { rejectUnauthorized: false }
    }
  }
};
export default config;
