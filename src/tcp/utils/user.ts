// this entire file will be removed when Redis implemented, this file is made
// only for debugging and testing during development process.
interface User {
  userId: string;
  socketId: string;
}

export const friends: { [key: string]: string[] } = {
  abc: ["acb", "bac"],
  acb: ["abc", "bac", "bca"],
  bac: ["abc", "acb"],
  bca: ["acb", "cab", "cba"],
  cab: ["bca", "cba"],
  cba: ["bca", "cab"],
};

const users: User[] = [];

export function getUsers() {
  return users;
}

export function getUser(userId: string) {
  return users.find((user) => user.userId === userId);
}

export function addUser(user: User) {
  users.push(user);
}

export function removeUser(socketId: string) {
  const index = users.findIndex((user) => user.socketId === socketId);
  if (index !== -1) return users.splice(index, 1)[0];
}
