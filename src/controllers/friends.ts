import { Request, Response } from "express";
import mongoose from "mongoose";
import { BadRequestError } from "../errors";
import { User } from "../models";

export const sendRequest = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { to } = req.params;

  if (!id || !to) throw new BadRequestError("User not found");

  const session = await mongoose.startSession();

  session.startTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
      "friends.id": { $ne: to },
    },
    {
      $push: {
        requests: {
          id: to,
        },
      },
    },
    { session }
  );
  const user = await User.updateOne(
    {
      _id: to,
      "friends.id": { $ne: id },
    },
    {
      $addToSet: {
        invitations: {
          id: id,
        },
      },
    },
    { session }
  );

  if (!currentUser.modifiedCount || !user.modifiedCount) {
    await session.abortTransaction();

    await session.endSession();

    return res.send({ success });
  }
  await session.commitTransaction();

  await session.endSession();

  success = true;

  return res.send({ success });
};

export const acceptRequest = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { from } = req.params;

  if (!id || !from) throw new BadRequestError("User not found");

  const session = await mongoose.startSession();

  session.startTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
      "friends.id": { $ne: from },
    },
    {
      $push: {
        friends: {
          id: from,
          sender: from,
        },
      },
      $pull: {
        invitations: { id: from },
      },
    },
    { session }
  );
  const fromUser = await User.updateOne(
    {
      _id: from,
      "friends.id": { $ne: id },
    },
    {
      $addToSet: {
        friends: {
          id: id,
          sender: id,
        },
      },
      $pull: {
        requests: { id: id },
      },
    },
    { session }
  );

  if (!currentUser.modifiedCount || !fromUser.modifiedCount) {
    await session.abortTransaction();

    await session.endSession();

    return res.send({ success });
  }
  await session.commitTransaction();

  await session.endSession();

  success = true;

  return res.send({ success });
};

export const rejectRequest = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { from } = req.params;

  if (!id || !from) throw new BadRequestError("User not found");

  const session = await mongoose.startSession();

  session.startTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        invitations: { id: from },
      },
    },
    { session }
  );
  const fromUser = await User.updateOne(
    {
      _id: from,
    },
    {
      $pull: {
        requests: { id: id },
      },
    },
    { session }
  );

  if (!currentUser.modifiedCount || !fromUser.modifiedCount) {
    await session.abortTransaction();

    await session.endSession();

    return res.send({ success });
  }
  await session.commitTransaction();

  await session.endSession();

  success = true;

  return res.send({ success });
};

export const unfriendUser = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { userId } = req.params;

  if (!id || !userId) throw new BadRequestError("User not found");

  const session = await mongoose.startSession();

  session.startTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        friends: { id: userId },
      },
    },
    { session }
  );
  const user = await User.updateOne(
    {
      _id: userId,
    },
    {
      $pull: {
        friends: { id: id },
      },
    },
    { session }
  );

  if (!currentUser.modifiedCount || !user.modifiedCount) {
    await session.abortTransaction();

    await session.endSession();

    return res.send({ success });
  }
  await session.commitTransaction();

  await session.endSession();

  success = true;

  return res.send({ success });
};

export const blockUser = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { userId } = req.params;

  if (!id || !userId) throw new BadRequestError("User not found");

  const session = await mongoose.startSession();

  session.startTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $push: {
        blocked: {
          id: userId,
        },
      },
      $pull: {
        friends: { id: userId },
      },
    },
    { session }
  );
  const user = await User.updateOne(
    {
      _id: userId,
    },
    {
      $pull: {
        friends: { id: id },
      },
    },
    { session }
  );

  if (!currentUser.modifiedCount || !user.modifiedCount) {
    await session.abortTransaction();

    await session.endSession();

    return res.send({ success });
  }
  await session.commitTransaction();

  await session.endSession();

  success = true;

  return res.send({ success });
};

export const unblockUser = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { userId } = req.params;

  if (!id || !userId) throw new BadRequestError("User not found");

  const session = await mongoose.startSession();

  session.startTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        blocked: { id: userId },
      },
    },
    { session }
  );
  const user = await User.updateOne(
    {
      _id: userId,
    },
    {
      $pull: {
        blocked: { id: id },
      },
    },
    { session }
  );

  if (!currentUser.modifiedCount || !user.modifiedCount) {
    await session.abortTransaction();

    await session.endSession();

    return res.send({ success });
  }
  await session.commitTransaction();

  await session.endSession();

  success = true;

  return res.send({ success });
};

export const reportUser = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;
  const { userId } = req.params;
  const { description } = req.body;

  let success = true;

  const user = await User.updateOne(
    {
      _id: userId,
      "reports.id": { $ne: userId },
    },
    {
      $addToSet: {
        reports: {
          id,
          description,
        },
      },
    }
  );
  if (!user.modifiedCount) return res.send({ success: false });

  return res.send({ success });
};
