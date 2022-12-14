import "dotenv/config";
import { httpServer, io } from "./app";
import mongoose from "mongoose";
import redis from "./services/redis";
import initialize from "./tcp";

const main = async () => {
  const PORT = process.env.PORT || 5000;

  if (!process.env.REDIS_LOCAL && !process.env.REDIS_URI) throw new Error("REDIS_URI must be provided!");
  if (!process.env.MONGO_URI && !process.env.MONGO_LOCAL) throw new Error("MONGO_URI must be provided!");
  if (!process.env.TWILIO_ACCOUNT_SID) throw new Error("TWILIO_ACCOUNT_SID must be provided!");
  if (!process.env.TWILIO_AUTH_TOKEN) throw new Error("TWILIO_ACCOUNT_SID must be provided!");
  if (!process.env.TWILIO_SERVICE_SID) throw new Error("TWILIO_ACCOUNT_SID must be provided!");

  const client = redis.getRedisClient();
  let successfulRedisConnection = false;
  try {
    let redis_uri = process.env.REDIS_LOCAL || process.env.REDIS_URI;
    await client.connect();
    console.log("Connected Successfully to Redis URI :", redis_uri);
    successfulRedisConnection = true;
  } catch (err) {
    console.error(err);
  }

  let successfulMongoDBConnection = false;
  try {
    let mongo_uri = process.env.MONGO_LOCAL! || process.env.MONGO_URI!;
    await mongoose.connect(mongo_uri);
    console.log("Connected Successfully to MongoDB URI :", mongo_uri);
    successfulMongoDBConnection = true;
  } catch (error) {
    console.error(error);
  }
  if (!successfulRedisConnection || !successfulMongoDBConnection) process.exit(0);

  httpServer.listen(PORT, () => console.log(`Server is running on PORT : ${PORT}`));
  initialize(io);
  statistics();
};

const statistics = () => {
  const stats = [];
  const { rss, heapTotal, external, heapUsed } = process.memoryUsage();
  stats.push({ item: "rss", value: `${rss / 1000000} MB` });
  stats.push({ item: "heapTotal", value: `${heapTotal / 1000000} MB` });
  stats.push({ item: "external", value: `${external / 1000000} MB` });
  stats.push({ item: "heapUsed", value: `${heapUsed / 1000000} MB` });
  console.table(stats);
};

main();
