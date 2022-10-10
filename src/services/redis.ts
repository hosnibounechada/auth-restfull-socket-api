import { createClient, RedisClientType } from "redis";

class Redis {
  private static instance: Redis;
  private static client: RedisClientType;

  private constructor() {}

  private async connect() {
    if (!process.env.REDIS_URI) throw new Error("REDIS_URI must be provided!");
    Redis.client = createClient({
      url: process.env.REDIS_URI,
    });
    // try {
    //   await Redis.client.connect();
    //   console.log("Connected Successfully to Redis URI :", process.env.REDIS_URI);
    // } catch (err) {
    //   console.error(err);
    // }
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
