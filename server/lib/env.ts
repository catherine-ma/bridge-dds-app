import { config } from 'dotenv';

config();

console.log('process', process.env);

export const DATABASE_URL = process.env.DATABASE_URL || '';