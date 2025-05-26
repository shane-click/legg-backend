import knex from 'knex';
import knexConfig from '../../knexfile.js';
const env = (process.env.NODE_ENV ?? 'development') as keyof typeof knexConfig;
export default knex(knexConfig[env]);
