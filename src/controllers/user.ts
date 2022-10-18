import { Request, Response } from "express";
import { NotFoundError } from "../errors";
import { User } from "../models";
import { MongoTransaction } from "../services";

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) throw new NotFoundError();

  res.send({ user });
};

export const getUsersByDisplayName = async (req: Request, res: Response) => {
  const id = req.currentUser?.id;
  const displayName = req.query.displayName?.toString() || "";
  const page = +req.query.page! || 0;

  const users = await User.find({ displayName: { $regex: "^" + displayName, $options: "i" }, _id: { $ne: id }, "blocked.id": { $ne: id } })
    .skip(page * 2)
    .limit(2);

  res.send({ users });
};

export const sendRequest = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { to } = req.params;

  const session = await MongoTransaction.startSessionAndStartTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
      "friends.id": { $ne: to },
      "requests.id": { $ne: to },
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
      "invitations.id": { $ne: id },
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
    await MongoTransaction.abortTransactionAndEndSession(session);

    return res.send({ success });
  }
  await MongoTransaction.commitTransactionAndEndSession(session);

  success = true;

  return res.send({ success });
};

export const acceptRequest = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { from } = req.params;

  const session = await MongoTransaction.startSessionAndStartTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
      "friends.id": { $ne: from },
    },
    {
      $addToSet: {
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
    await MongoTransaction.abortTransactionAndEndSession(session);

    return res.send({ success });
  }
  await MongoTransaction.commitTransactionAndEndSession(session);

  success = true;

  return res.send({ success });
};

export const rejectRequest = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { from } = req.params;

  const session = await MongoTransaction.startSessionAndStartTransaction();

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
    await MongoTransaction.abortTransactionAndEndSession(session);

    return res.send({ success });
  }
  await MongoTransaction.commitTransactionAndEndSession(session);

  success = true;

  return res.send({ success });
};

export const unfriendUser = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { userId } = req.params;

  const session = await MongoTransaction.startSessionAndStartTransaction();

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
    await MongoTransaction.abortTransactionAndEndSession(session);

    return res.send({ success });
  }
  await MongoTransaction.commitTransactionAndEndSession(session);

  success = true;

  return res.send({ success });
};

export const blockUser = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { userId } = req.params;

  const session = await MongoTransaction.startSessionAndStartTransaction();

  const currentUser = await User.updateOne(
    {
      _id: id,
      "blocked.id": { $ne: userId },
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
    await MongoTransaction.abortTransactionAndEndSession(session);

    return res.send({ success });
  }
  await MongoTransaction.commitTransactionAndEndSession(session);

  success = true;

  return res.send({ success });
};

export const unblockUser = async (req: Request, res: Response) => {
  let success = false;

  const id = req.currentUser?.id;

  const { userId } = req.params;

  const currentUser = await User.updateOne(
    {
      _id: id,
    },
    {
      $pull: {
        blocked: { id: userId },
      },
    }
  );

  if (!currentUser.modifiedCount) {
    return res.send({ success });
  }
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
