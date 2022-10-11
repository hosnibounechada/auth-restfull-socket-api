import { createClient, RedisClientType } from "redis";

class Redis {
  private static instance: Redis;
  private static client: RedisClientType;

  private constructor() {}

  private async connect() {
    // if (!process.env.REDIS_URI) throw new Error("REDIS_URI must be provided!");
    // Redis.client = createClient({
    //   url: process.env.REDIS_URI,
    // });

    Redis.client = createClient();
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
