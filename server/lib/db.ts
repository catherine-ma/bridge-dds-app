import { Pool } from "pg";
import { DATABASE_URL } from './env';

console.log('Database URL', DATABASE_URL);

const pool = new Pool({
    connectionString: DATABASE_URL,
});


export default pool;