import { Message } from "../../models/message";
import { User } from "../../models";
import { MessageType } from "../types";
import { MongoTransaction } from "../../services";

export const sendMessage = async (data: MessageType) => {
  const { from, to, type, content } = data;

  const message = Message.build({ from: from, to, type, content });

  const session = await MongoTransaction.startSessionAndStartTransaction();

  message.$session(session);

  await message.save();

  const sender = await User.updateOne(
    { _id: from, "friends.id": to },
    {
      $set: {
        "friends.$.sender": from,
        "friends.$.type": type,
        "friends.$.lastMessage": content,
        "friends.$.viewed": false,
      },
    },
    { session }
  );

  const receiver = await User.updateOne(
    { _id: to, "friends.id": from },
    {
      $set: {
        "friends.$.sender": from,
        "friends.$.type": type,
        "friends.$.lastMessage": content,
        "friends.$.viewed": false,
      },
    },
    { session }
  );

  if (!message || !sender.modifiedCount || !receiver.modifiedCount) {
    await MongoTransaction.abortTransactionAndEndSession(session);

    return false;
  }
  await MongoTransaction.commitTransactionAndEndSession(session);

  return message;
};
