import { Request, Response } from "express";
import { User } from "../models";

export const sendRequest = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;

  const { to } = req.params;

  const user = await User.findById(to);

  return res.send(user);
};

export const acceptRequest = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;

  const { from } = req.params;

  const user = await User.findById(from);

  return res.send(user);
};

export const rejectRequest = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;

  const { from } = req.params;

  const user = await User.findById(from);

  return res.send(user);
};

export const unfriendUser = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;

  const { userId } = req.params;

  const user = await User.findById(userId);

  return res.send(user);
};

export const blockUser = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;

  const { userId } = req.params;

  const user = await User.findById(userId);

  return res.send(user);
};

export const unblockUser = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;

  const { userId } = req.params;

  const user = await User.findById(userId);

  return res.send(user);
};

export const reportUser = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;

  const { userId } = req.params;

  const user = await User.findById(userId);

  return res.send(user);
};
