export type Message = {
  id: string;
  userId: string;
  messageContent: string;
  sentAt: Date;
  readAt: Date | null;
  courseId: string;
  recipientId: string;
  user?: {
    fullName: string;
  };
};

export type Conversation = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageAt?: Date | null;
  unreadCount: number;
  courseId: string;
  courseName?: string;
};
