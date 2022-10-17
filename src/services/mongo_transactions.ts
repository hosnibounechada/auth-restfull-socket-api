import mongoose, { ClientSession } from "mongoose";

export class MongoTransaction {
  static async startSessionAndStartTransaction() {
    const session = await mongoose.startSession();
    session.startTransaction();
    return session;
  }

  static async commitTransactionAndEndSession(session: ClientSession) {
    await session.commitTransaction();
    await session.endSession();
  }

  static async abortTransactionAndEndSession(session: ClientSession) {
    await session.abortTransaction();
    await session.endSession();
  }
}
