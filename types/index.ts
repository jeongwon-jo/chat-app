import { Conversation, Message, User } from "@prisma/client";

export type ReplyPreview = {
  id: string;
  body: string | null;
  image: string | null;
  sender: User;
};

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
  replyTo?: ReplyPreview | null;
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
};
