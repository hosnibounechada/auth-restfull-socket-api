import mongoose, { ProjectionType } from "mongoose";
import { UserDoc } from "../../models";

export function getUserProjections(id: string | undefined): ProjectionType<UserDoc> | null | undefined {
  return {
    friends: {
      $elemMatch: {
        id: { $eq: id },
      },
    },
    requests: {
      $elemMatch: {
        id: { $eq: id },
      },
    },
    invitations: {
      $elemMatch: {
        id: { $eq: id },
      },
    },
    displayName: 1,
    thumbnail: 1,
    picture: 1,
    "friends.id": 1,
    "requests.id": 1,
    "invitations.id": 1,
  };
}
