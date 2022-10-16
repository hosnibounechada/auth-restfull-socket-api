// Message schema for event payloads validation
export const messageSchema = {
  id: "/message",
  type: "object",
  properties: {
    from: { type: "string" },
    to: { type: "string" },
    type: { type: "string" },
    content: { type: "string" },
  },
  required: ["from", "to", "type", "content"],
};
