import mongoose from "mongoose";

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
