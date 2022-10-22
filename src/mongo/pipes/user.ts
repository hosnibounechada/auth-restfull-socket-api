import mongoose from "mongoose";
import { USER_STATUS } from "../../types/user";

export const searchUsersPipeLine: any = (id: string, displayName: string, skip: number, limit: number) => [
  {
    $match: {
      displayName: {
        $regex: `^${displayName}`,
        $options: "i",
      },
      _id: {
        $ne: new mongoose.Types.ObjectId(id),
      },
      "blocked.id": { $ne: new mongoose.Types.ObjectId(id) },
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
  {
    $project: {
      _id: 0,
      id: { $toString: "$_id" },
      displayName: 1,
      thumbnail: 1,
      status: {
        $cond: {
          if: {
            $in: [new mongoose.Types.ObjectId(id), "$friends.id"],
          },
          then: USER_STATUS.FRIEND,
          else: {
            $cond: {
              if: {
                $in: [new mongoose.Types.ObjectId(id), "$requests.id"],
              },
              then: USER_STATUS.REQUESTED,
              else: {
                $cond: {
                  if: {
                    $in: [new mongoose.Types.ObjectId(id), "$invitations.id"],
                  },
                  then: USER_STATUS.INVITED,
                  else: USER_STATUS.STRANGER,
                },
              },
            },
          },
        },
      },
    },
  },
];

export const friendsMessagesPipeLine: any = (id: string, skip: number, limit: number) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(id),
    },
  },
  {
    $project: {
      _id: 0,
      friends: 1,
    },
  },
  {
    $unwind: {
      path: "$friends",
    },
  },
  {
    $replaceRoot: {
      newRoot: "$friends",
    },
  },
  {
    $sort: {
      updatedAt: -1,
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
  {
    $lookup: {
      from: "users",
      localField: "id",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            $arrayElemAt: ["$user", 0],
          },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $project: {
      _id: 0,
      id: { $toString: "$_id" },
      displayName: 1,
      thumbnail: 1,
      sender: 1,
      lastMessage: 1,
      updatedAt: 1,
      viewed: 1,
    },
  },
];

export const onlineFriendsPipeLine: any = (id: string) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(id),
    },
  },
  {
    $project: {
      _id: 0,
      friends: 1,
    },
  },
  {
    $unwind: {
      path: "$friends",
    },
  },
  {
    $replaceRoot: {
      newRoot: "$friends",
    },
  },
  {
    $sort: {
      updatedAt: -1,
    },
  },
  {
    $lookup: {
      from: "users",
      localField: "id",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            $arrayElemAt: ["$user", 0],
          },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $project: {
      _id: 0,
      id: {
        $toString: "$_id",
      },
      displayName: 1,
      thumbnail: 1,
    },
  },
];

export const blockedUsersPipeLine: any = (id: string, skip: number, limit: number) => [
  {
    $match: {
      _id: new mongoose.Types.ObjectId(id),
    },
  },
  {
    $unwind: {
      path: "$blocked",
    },
  },
  {
    $replaceRoot: {
      newRoot: "$blocked",
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
  {
    $lookup: {
      from: "users",
      localField: "id",
      foreignField: "_id",
      as: "user",
    },
  },
  {
    $replaceRoot: {
      newRoot: {
        $mergeObjects: [
          {
            $arrayElemAt: ["$user", 0],
          },
          "$$ROOT",
        ],
      },
    },
  },
  {
    $project: {
      id: {
        $toString: "$_id",
      },
      _id: 0,
      displayName: 1,
      thumbnail: 1,
    },
  },
];
