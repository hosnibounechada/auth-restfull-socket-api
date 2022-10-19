import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors";
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
  const id = req.currentUser?.id;

  const { from, to, type, content } = req.body as MessageType;

  if (id !== from || id === to) throw new BadRequestError("Invalid Operation");

  const message = Message.build({ from, to, type, content });

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
