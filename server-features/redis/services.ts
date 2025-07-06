import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from "@/config/envs";
import Redis from "ioredis";

const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
  db: 0,
  // retryStrategy: (times) => Math.min(times * 50, 2000),
});

export default redis;
