import { User } from "../../models";

export const getFriends = async (id: string) => {
  const user = await User.findById(id);
  if (!user) return null;
  const friendsIds = user.friends.map((friend) => friend.id.toString() + "N");
  console.log(friendsIds);
  return friendsIds;
};
