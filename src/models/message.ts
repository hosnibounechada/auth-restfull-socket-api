import mongoose, { Schema } from "mongoose";

interface MessageAttrs {
  from: string;
  to: string;
  type: string;
  content: string;
}

interface MessageDoc extends mongoose.Document<any> {
  from: string;
  to: string;
  type: string;
  content: string;
}

interface MessageModel extends mongoose.Model<MessageDoc> {
  build(attrs: MessageAttrs): MessageDoc;
}

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

messageSchema.statics.build = (attrs: MessageAttrs) => {
  return new Message(attrs);
};

const Message = mongoose.model<MessageDoc, MessageModel>("Message", messageSchema);

export { Message };
