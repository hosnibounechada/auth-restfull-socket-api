export type FriendType = {
  id: string;
  displayName: string;
  thumbnail: string;
  sender: string;
  lastMessage: string;
  updatedAt: Date;
  viewed: boolean;
};

export type OnlineType = {
  id: string;
  displayName: string;
  thumbnail: string;
};

export const USER_STATUS = {
  FRIEND: "friend",
  REQUESTED: "requested",
  INVITED: "invited",
  STRANGER: "stranger",
};
