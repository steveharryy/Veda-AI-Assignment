import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

export const redisConnection = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  maxRetriesPerRequest: null,
  lazyConnect: true
});

redisConnection.on('connect', () => {
  console.log('💚 Shared Redis connection successfully established.');
});

redisConnection.on('error', (err) => {
  console.error('❤️ Redis client error:', err);
});

export default redisConnection;
