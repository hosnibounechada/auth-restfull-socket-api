import { createClient, RedisClientType } from "redis";

class Redis {
  private static instance: Redis;
  private static client: RedisClientType;

  private constructor() {}

  private async connect() {
    let redis_url = process.env.REDIS_LOCAL ? undefined : { url: process.env.REDIS_URI };
    Redis.client = createClient(redis_url);
  }

  static getInstance() {
    if (!Redis.instance) {
      Redis.instance = new Redis();
      Redis.instance.connect();
    }
    return Redis.instance;
  }

  public getRedisClient() {
    return Redis.client;
  }
}

export default Redis.getInstance();
