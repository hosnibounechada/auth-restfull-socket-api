import { Request, Response } from "express";
import { NotFoundError } from "../errors";
import { Message } from "../models/message";

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

  const message = Message.build({ from: id, to, type, content });

  await message.save();

  res.send({ message });
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
  const { id } = req.params;
  const page = +req.query.page! || 0;

  const messages = await Message.find({ $or: [{ $and: [{ from: currentUserId }, { to: id }] }, { $and: [{ from: id }, { to: currentUserId }] }] })
    .sort({ createdAt: -1 })
    .skip(page * 2)
    .limit(2);

  if (!messages) throw new NotFoundError();

  res.send({ messages });
};
