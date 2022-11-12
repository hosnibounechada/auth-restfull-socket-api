import { Request, Response } from "express";
import { GoneError, NotFoundError } from "../errors";
import { Message } from "../models/message";
import { User } from "../models";
import { MongoTransaction } from "../services";

type MessageType = {
  from: string;
  to: string;
  type: string;
  content: string;
};

export const getMessage = async (req: Request, res: Response) => {
  const userId = req.currentUser?.id;

  const { id } = req.params;

  const message = await Message.findOne({ _id: id, $or: [{ from: userId }, { to: userId }] });

  if (!message) throw new NotFoundError();

  res.send({ message });
};

export const sendMessage = async (req: Request, res: Response) => {
  const id = req.currentUser?.id!;

  const { to, type, content } = req.body as MessageType;

  let success = false;

  const message = Message.build({ from: id, to, type, content });

  const session = await MongoTransaction.startSessionAndStartTransaction();

  message.$session(session);

  await message.save();

  const sender = await User.updateOne(
    { _id: id, "friends.id": to },
    {
      $set: {
        "friends.$.sender": id,
        "friends.$.type": type,
        "friends.$.lastMessage": content,
        "friends.$.viewed": false,
      },
    },
    { session }
  );

  const receiver = await User.updateOne(
    { _id: to, "friends.id": id },
    {
      $set: {
        "friends.$.sender": id,
        "friends.$.type": type,
        "friends.$.lastMessage": content,
        "friends.$.viewed": false,
      },
    },
    { session }
  );

  if (!message || !sender.modifiedCount || !receiver.modifiedCount) {
    await MongoTransaction.abortTransactionAndEndSession(session);

    return res.send({ success });
  }
  await MongoTransaction.commitTransactionAndEndSession(session);

  success = true;

  res.send({ success, message });
};

export const updateMessage = async (req: Request, res: Response) => {
  const userId = req.currentUser?.id;

  const { id } = req.params;

  const { type, content } = req.body;

  const message = await Message.findOneAndUpdate({ _id: id, from: userId }, { type, content });

  if (!message) throw new NotFoundError();

  res.send({ message });
};

export const removeMessage = async (req: Request, res: Response) => {
  const userId = req.currentUser?.id;

  const { id } = req.params;

  const message = await Message.findOneAndUpdate({ _id: id, from: userId });

  if (!message) throw new NotFoundError();

  res.send({ message });
};

export const getMessages = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser?.id!;
  const { userId } = req.params;
  const page = +req.query.page! || 0;
  const limit = 20;

  const messages = await Message.find({
    $or: [
      { from: currentUserId, to: userId },
      { from: userId, to: currentUserId },
    ],
  })
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit);

  if (!messages) throw new NotFoundError();

  res.send({ messages });
};

export const deleteConversation = async (req: Request, res: Response) => {
  const currentUserId = req.currentUser?.id!;
  const { userId } = req.params;

  const result = await Message.deleteMany({
    $or: [
      { from: currentUserId, to: userId },
      { from: userId, to: currentUserId },
    ],
  });

  res.send({ success: true });
};

export const markAsViewed = async (req: Request, res: Response) => {
  const id = req.currentUser?.id!;

  const { userId } = req.params;

  let success = false;

  const session = await MongoTransaction.startSessionAndStartTransaction();

  const currentUser = await User.updateOne(
    { _id: id, "friends.id": userId },
    {
      $set: {
        "friends.$.viewed": true,
      },
    },
    { session }
  );
  const user = await User.updateOne(
    { _id: userId, "friends.id": id },
    {
      $set: {
        "friends.$.viewed": true,
      },
    },
    { session }
  );

  if (!currentUser.modifiedCount || !user.modifiedCount) {
    await MongoTransaction.abortTransactionAndEndSession(session);

    return res.send({ success });
  }

  await MongoTransaction.commitTransactionAndEndSession(session);

  res.send({ success: true });
};
