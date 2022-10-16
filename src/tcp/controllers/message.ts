import { Message } from "../../models/message";
import { MessageType } from "../types";

export const sendMessage = async (data: MessageType) => {
  const message = Message.build(data);

  await message.save();

  return message;
};
